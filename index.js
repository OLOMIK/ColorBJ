// backend by gasnic https://github.com/OLOMIK
const { app, BrowserWindow, Notification } = require('electron')
var fs = require('fs');
const https = require('https');
const url = 'https://crystalx.pl/colorbj/lts-version.txt';
const createWindow = () => {
  const win = new BrowserWindow({autoHideMenuBar: true, icon: "niepaint.ico"})
  win.maximize()
  win.loadFile('index.html')
}

app.whenReady().then(() => {
  createWindow()
  console.log("gui uruchomione poprawnie")
  checkForUpdates();
})



// tu autoupdate robimy
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
    require("shell").openExternal("https://github.com/OLOMIK/ColorBJ/")
    
  };

  notification.show();
}