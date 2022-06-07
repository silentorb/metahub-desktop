import { ipcMain } from 'electron'
import { Server } from '../server'
import { AppState, getConfigDirectory, saveConfig, StorageDirectories } from '../config'
import { TaskEither } from 'fp-ts/TaskEither'
import { Either } from 'fp-ts/Either'
import { sanitizeDirectoryPath } from '../markdown-db'
import { loadConfig } from '../config/load-config'
import { configElements } from '../config/elements'

export function newApi(server: Server) {
  const { database } = server
  const root = server.config.database.path
  const directories: StorageDirectories = {
    project: getConfigDirectory(root),
    global: getConfigDirectory(sanitizeDirectoryPath(process.cwd()))
  }

  const app: AppState = {
    directories,
    configElements,
  }

  function handle0<T>(channel: string, handler: () => TaskEither<Error, T>): void {
    ipcMain.handle(channel, async (): Promise<Either<Error, T>> => {
        const v = await handler()()
        return v
      }
    )
  }

  function handle1<A, T>(channel: string, handler: (a: A) => TaskEither<Error, T>): void {
    ipcMain.handle(channel, async (e, a): Promise<Either<Error, T>> => {
        const r = await handler(a)()
        return r
      }
    )
  }

  function handle2<T, A, B>(channel: string, handler: (a: A) => (b: B) => TaskEither<Error, T>): void {
    ipcMain.handle(channel, async (e, a: A, b: B): Promise<Either<Error, T>> => {
      const r = await handler(a)(b)()
      return r
    })
  }

  handle0('getAllRecords', database.getAllRecords.bind(database))
  handle1('getRecordContent', database.getRecordContent.bind(database))
  handle2('writeRecord', (path: string) => (content: string) => database.writeRecord(path, content))

  handle1('loadConfig', loadConfig(app))
  handle2('saveConfig', saveConfig(app))
}
