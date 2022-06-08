import { ipcMain } from 'electron'
import { saveConfig } from '../config'
import { TaskEither } from 'fp-ts/TaskEither'
import { Either } from 'fp-ts/Either'
import { loadConfig } from '../config/load-config'
import { AppServices } from 'metahub-client'

export function newApi(services: () => AppServices) {
  function handle<A, T>(channel: string, handler: () => (...a: any[]) => TaskEither<Error, T>): void {
    ipcMain.handle(channel, async (e, ...a): Promise<Either<Error, T>> => {
        const r = await handler()(...a)()
        return r
      }
    )
  }

  handle('getAllRecords', () => services().database.getAllRecords)
  handle('getRecordContent', () => services().database.getRecordContent)
  handle('writeRecord', () => services().database.writeRecord)

  handle('loadConfig', () => services().config.loadConfig<any>)
  handle('saveConfig', () => services().config.saveConfig<any>)
}
