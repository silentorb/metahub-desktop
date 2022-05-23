import { program } from 'commander'
import { app, BrowserWindow } from 'electron'
import { newServer } from './server'

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
    height: 600
  })

  win.loadFile('../client/index.html')
  win.maximize()
  win.webContents.openDevTools()

}

app.whenReady().then(() => {
  createWindow()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
