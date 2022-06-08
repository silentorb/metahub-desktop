import { ConfigElement, StorageLayer } from 'metahub-common'
import { SanitizedPath } from '../markdown-db'
import { DataSource } from 'metahub-protocol'

export enum AppDirectory {
  projectRoot = 'projectRoot',
}

export type AppDirectories = { [key in StorageLayer | AppDirectory]: SanitizedPath }

export type ConfigElementMap = { [key: string]: ConfigElement<any, any> }

export interface AppState {
  directories: AppDirectories,
  configElements: ConfigElementMap,
}
