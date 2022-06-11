import { BrowserWindow, Menu } from 'electron'
import { resolveDirectoryPath } from '../markdown-db'
import { newMenus } from './menus'

export const createWindow = async () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: resolveDirectoryPath(__dirname, '..', 'preload', 'preload.js')
    }
  })

  win.maximize()
  await win.loadFile('../client/index.html')
  win.webContents.openDevTools()

  const menu = Menu.buildFromTemplate(newMenus())
  Menu.setApplicationMenu(menu)
}
