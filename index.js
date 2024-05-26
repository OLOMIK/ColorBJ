const { app, BrowserWindow, Notification } = require('electron');
const https = require('https');
const url = 'https://crystalx.pl/colorbj/lts-version.txt';

let mainWindow;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    autoHideMenuBar: true,
    icon: "niepaint.ico"
  });
  mainWindow.maximize();
  mainWindow.loadFile('index.html');
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
  const packageJson = require('./package.json');
  const localVersion = packageJson.version;

  if (remoteVersion > localVersion) {
    showUpdateNotification(remoteVersion);
  }
}

function showUpdateNotification(rv) {
  const notification = new Notification({
    title: 'Dostępna aktualizacja',
    body: 'Jest dostępna nowa wersja ColorBJ. Kliknij aby pobrać. Wersja: ' + rv,
    icon: 'niepaint.png'
  });

  notification.onclick = () => {
    require('electron').shell.openExternal("https://github.com/OLOMIK/ColorBJ/");
  };

  notification.show();
}
