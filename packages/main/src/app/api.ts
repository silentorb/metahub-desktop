import { ipcMain } from 'electron'
import { Server } from '../server'
import { loadOrNewWorkspaceConfig, saveWorkspaceConfig } from '../config'

export function newApi(server: Server) {
  const { database } = server

  const root = server.config.database.path

  ipcMain.handle('getAllRecords', () => database.getAllRecords())
  ipcMain.handle('getRecordContent', (e, id: string) => database.getRecordContent(id))

  ipcMain.handle('loadConfig', (e, key: string) => loadOrNewWorkspaceConfig(root))
  ipcMain.handle('saveConfig', (e, key: string) => saveWorkspaceConfig(root))
}
