import { ConfigElement, StorageLayer } from 'metahub-common'
import { SanitizedPath } from '../markdown-db'

export type StorageDirectories = { [key in StorageLayer]: SanitizedPath }

export type ConfigElementMap = { [key: string]: ConfigElement<any, any> }

export interface AppState {
  directories: StorageDirectories,
  configElements: ConfigElementMap
}
