import { TaskEither } from 'fp-ts/TaskEither'
import { Type } from 'metahub-protocol'

export enum StorageLayer {
  project = 'project',
  global = 'global',
}

export interface ConfigElement<T, K extends string> {
  key: K
  storageLayer: StorageLayer,
  validationType: Type<T>
}

export interface Application {
  loadConfig<T>(key: string): TaskEither<Error, T>

  saveConfig<T>(key: string, data: T): TaskEither<Error, void>
}
