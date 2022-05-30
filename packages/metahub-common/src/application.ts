import { Either } from 'fp-ts/Either'
import { TaskEither } from 'fp-ts/TaskEither'

export type ConfigTypes = 'workspace'

export interface Application {
  loadConfig<T>(key: ConfigTypes): TaskEither<Error, T>
  saveConfig<T>(key: ConfigTypes, data: T): TaskEither<Error, void>
}
