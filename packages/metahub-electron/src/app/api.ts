import { ipcMain } from 'electron'
import { Server } from '../server'
import { getConfigFilePath, saveConfig } from '../config'
import { readJsonFile } from '../io'
import { flow } from 'fp-ts/function'
import { TaskEither } from 'fp-ts/TaskEither'
import { Either } from 'fp-ts/Either'

export function newApi(server: Server) {
  const { database } = server

  const root = server.config.database.path

  function handle0<T>(channel: string, handler: () => TaskEither<Error, T>): void {
    ipcMain.handle(channel, async (): Promise<Either<Error, T>> => {
        const v = await handler()()
        return v
      }
    )
  }

  function handle1<A, T>(channel: string, handler: (a: A) => TaskEither<Error, T>): void {
    ipcMain.handle(channel, async (e, a): Promise<Either<Error, T>> =>
    {  const r = await handler(a)()
    return r
    }
    )
  }

  function handle2<T, A, B>(channel: string, handler: (a: A) => (b: B) => TaskEither<Error, T>): void {
    ipcMain.handle(channel, async (e, a: A, b: B): Promise<Either<Error, T>> =>
      await handler(a)(b)()
    )
  }

  handle0('getAllRecords', database.getAllRecords.bind(database))
  handle1('getRecordContent', database.getRecordContent.bind(database))

  const getConfigPathByKey = getConfigFilePath(root)

  handle1('loadConfig', flow(getConfigPathByKey, readJsonFile))
  handle2('saveConfig', (content: any) => flow(getConfigPathByKey, saveConfig)(content))
}
