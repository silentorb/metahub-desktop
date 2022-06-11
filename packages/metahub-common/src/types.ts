import { TaskEither } from 'fp-ts/TaskEither'
import { DocumentDatabase, Type } from 'metahub-protocol'
import { IsOptional, IsString } from 'class-validator'

export enum StorageLayer {
  projectMeta = 'projectMeta',
  globalMeta = 'globalMeta',
}

export interface ConfigElement<T, K extends string> {
  key: K
  storageLayer: StorageLayer,
  validationType: Type<T>
}

export interface ConfigStorage {
  loadConfig<T>(key: string): TaskEither<Error, T>

  saveConfig<T>(key: string, data: T): TaskEither<Error, void>
}

export interface PackageInfo {
  id: string
  title: string
  root: string
}

export class CPackageInfo implements PackageInfo {
  @IsString()
  id!: string

  @IsString()
  title!: string

  @IsString()
  @IsOptional()
  root: string = '.'
}

export interface AppServices {
  config: ConfigStorage
  database: DocumentDatabase
}
