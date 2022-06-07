import { TaskEither } from 'fp-ts/TaskEither'
import { Type } from 'metahub-protocol'
import { IsOptional, IsString } from 'class-validator'

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
