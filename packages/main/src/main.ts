if (process.env.NODE_ENV !== 'production') {
  require('source-map-support').install()
  require('electron-reloader')(module)
}

import { program } from 'commander'
import { app, BrowserWindow, ipcMain } from 'electron'
import { newServer, Server } from './server'
import * as path from 'path'

program
  .option('--source <path>', 'path to a data source root directory')

program.parse()

let server: Server

const createWindow = () => {
  const options = program.opts()
  const { source } = options
  if (!source)
    throw new Error('--source CLI argument is temporarily required')

  server = newServer({
    database: {
      path: source,
    }
  })

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

const getAllRecords = async () =>
  server
    ? server.db.getAllRecords()
    : []

app.whenReady().then(() => {
  ipcMain.handle('getAllRecords', getAllRecords)
  createWindow()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
