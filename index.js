// backend by gasnic https://github.com/OLOMIK
const { app, BrowserWindow } = require('electron')

const createWindow = () => {
  const win = new BrowserWindow({autoHideMenuBar: true, icon: "niepaint.ico"})
  win.maximize()
  win.loadFile('index.html')
}

app.whenReady().then(() => {
  createWindow()
  console.log("gui uruchomione poprawnie")
})