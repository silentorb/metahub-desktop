import { ipcMain } from 'electron'
import { Server } from '../server'

export function newApi(server: Server) {
  const { database } = server

  ipcMain.handle('getAllRecords', () => database.getAllRecords())
  ipcMain.handle('getRecordContent', (e, id: string) => database.getRecordContent(id))

}
