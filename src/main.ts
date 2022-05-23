const { app, BrowserWindow } = require('electron')

const createWindow = () => {
  try {
    require('electron-reloader')(module);
  } catch {}

  const win = new BrowserWindow({
    width: 800,
    height: 600
  })

  win.loadFile('../dist/index.html')
  win.maximize()
  win.webContents.openDevTools()
}

app.whenReady().then(() => {
  createWindow()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
