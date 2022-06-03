import { newServer } from '../server'
import { app, BrowserWindow } from 'electron'
import { program } from 'commander'
import path from 'path'
import { newApi } from './api'

export function newApp(sourcePath: string) {

  const server = newServer({
      database: {
        path: sourcePath,
      }
    })

  const createWindow = async () => {
    const options = program.opts()
    const { source } = options
    if (!source)
      throw new Error('--source CLI argument is temporarily required')


    const win = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        preload: path.resolve(__dirname, '..', 'preload', 'preload.js')
      }
    })

    win.maximize()
    await win.loadFile('../client/index.html')
    win.webContents.openDevTools()
  }

  app.whenReady().then(async () => {
    newApi(server)
    await createWindow()
  })

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
  })
}
