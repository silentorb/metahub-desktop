import { newServer } from '../server'
import { app, BrowserWindow } from 'electron'
import path from 'path'
import { newApi } from './api'
import { loadPackageInfo } from './packaging'

export function newApp(sourcePath: string) {

  const createWindow = async () => {
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
    const packageInfo = await loadPackageInfo(sourcePath)
    const server = newServer({
      database: {
        path: sourcePath,
      }
    })

    newApi(server)
    await createWindow()
  })

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
  })
}
