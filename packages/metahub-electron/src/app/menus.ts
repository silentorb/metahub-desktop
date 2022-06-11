import shell = Electron.shell
import app = Electron.app

const isMac = process.platform === 'darwin'

export const newMenus = (): Electron.MenuItemConstructorOptions[] => {
  const macAppMenu: Electron.MenuItemConstructorOptions = { role: 'appMenu' }
  return [
    ...(isMac ? [macAppMenu] : []),
    { role: 'fileMenu' },
    { role: 'editMenu' },
    { role: 'viewMenu' },
    { role: 'windowMenu' },
  ]
}
