import { BrowserWindow, Menu } from 'electron'
import { resolveDirectoryPath } from '../markdown-db'
import { newMenus } from './menus'
import { SendMessage } from './types'

export const createWindow = async (sendMessage: SendMessage) => {
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

  const menu = Menu.buildFromTemplate(newMenus(sendMessage))
  Menu.setApplicationMenu(menu)
}
