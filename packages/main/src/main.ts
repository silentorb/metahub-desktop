import { program } from 'commander'
import { app, BrowserWindow, ipcMain } from 'electron'
import { newServer } from './server'
import * as path from 'path'

program
  .option('--source')

program.parse()

const createWindow = () => {
  const options = program.opts()
  const { source } = options
  if (!source)
    throw new Error('--source CLI argument is temporarily required')

  const server = newServer({
    database: {
      path: source,
    }
  })

  try {
    require('electron-reloader')(module);
  } catch {
  }

  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.resolve(__dirname, '../..', 'dist/preload', 'preload.js')
    }
  })

  win.loadFile('../client/index.html')
  win.maximize()
  win.webContents.openDevTools()

}

async function test() {
  return 'Hello there!'
}

app.whenReady().then(() => {
  ipcMain.handle('test2', test)
  createWindow()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
