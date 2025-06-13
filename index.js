const { app, BrowserWindow, Notification, shell } = require('electron');
const https = require('https');
const url = 'https://olomowostudio.pl/wersja.txt'; 
const DiscordRPC = require('discord-rpc');
const clientId = '1245328919071297679';
const packageJson = require('./package.json');
let mainWindow;

DiscordRPC.register(clientId);

const rpc = new DiscordRPC.Client({ transport: 'ipc' });

async function setActivity() {
  if (!rpc || !app.isReady()) return;

  rpc.setActivity({
    details: "Edytuje obraz",
    state: "Używając ColorBJ",
    startTimestamp: new Date(),
    largeImageKey: "colorbj", 
    largeImageText: "ColorBJ",
    smallImageKey: "colorbj",
    smallImageText: "Wersja klienta: " + packageJson.version,
    instance: false,
  });
}

rpc.on('ready', () => {
  console.log("Discord RPC is ready");
  setActivity();
});

rpc.on('error', (error) => {
  console.error("Discord RPC error:", error);
});

rpc.login({ clientId }).catch(console.error);   

const createWindow = () => {
  var splash = new BrowserWindow({
    width: 500, 
    height: 300, 
    transparent: true, 
    frame: false, 
    alwaysOnTop: true 
  });
  splash.loadFile('assets/splashScreen.html');

  mainWindow = new BrowserWindow({
    show: false, 
    autoHideMenuBar: true,
    icon: "niepaint.ico",
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });
  
  mainWindow.loadFile('index.html');
  
  mainWindow.webContents.on('will-navigate', (event, url) => {
    event.preventDefault(); 
    shell.openExternal(url); 
  });

  let splashShown = false;

  splash.once('show', () => {
    splashShown = true;
  });

  mainWindow.once('ready-to-show', () => {
    setTimeout(() => {
      if (splash && !splash.isDestroyed()) {
        splash.close();
      }
      mainWindow.maximize();
      mainWindow.show();
      mainWindow.focus();
    }, 3000); 
  });

  setTimeout(() => {
    if (!splashShown) {
      splash.show();
    }
  }, 100); 
};

app.on('ready', () => {
  createWindow();
  console.log("GUI uruchomione poprawnie");
  checkForUpdates();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

function checkForUpdates() {
  https.get(url, (res) => {
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      const remoteVersion = data.trim();
      compareVersions(remoteVersion);
    });
  }).on("error", (err) => {
    console.error("Error: " + err.message);
  });
}

function compareVersions(remoteVersion) {
  const localVersion = packageJson.version;

  if (isVersionGreater(remoteVersion, localVersion)) {
    showUpdateNotification(remoteVersion);
  }
}

function isVersionGreater(remote, local) {
  const remoteParts = remote.split('.').map(Number);
  const localParts = local.split('.').map(Number);

  for (let i = 0; i < remoteParts.length; i++) {
    if (remoteParts[i] > (localParts[i] || 0)) {
      return true;
    } else if (remoteParts[i] < (localParts[i] || 0)) {
      return false;
    }
  }

  return false;
}

function showUpdateNotification(rv) {
  const notification = new Notification({
    title: 'Dostępna aktualizacja',
    body: 'Jest dostępna nowa wersja ColorBJ. Kliknij aby pobrać. Wersja: ' + rv,
    icon: 'niepaint.png'
  });

  notification.onclick = () => {
    shell.openExternal("https://github.com/OLOMIK/ColorBJ/");
  };

  notification.show();
}
