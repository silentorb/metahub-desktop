import { SendMessage } from './types'
import { CommonCommands } from 'metahub-common/src/commands'

const isMac = process.platform === 'darwin'

export const newMenus = (sendMessage: SendMessage): Electron.MenuItemConstructorOptions[] => {
  const macAppMenu: Electron.MenuItemConstructorOptions = { role: 'appMenu' }
  return [
    ...(isMac ? [macAppMenu] : []),
    {
      role: 'fileMenu',
      label: 'File',
      submenu: [
        {
          label: 'New Document',
          accelerator: 'CmdOrCtrl+N',
          click: sendMessage(CommonCommands.newDocument()),
        },
        isMac ? { role: 'close' } : { role: 'quit' },
      ]
    },
    { role: 'editMenu' },
    { role: 'viewMenu' },
    { role: 'windowMenu' },
  ]
}
