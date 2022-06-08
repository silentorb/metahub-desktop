import { DocumentDatabase } from 'metahub-protocol'
import { AppServices } from 'metahub-client'
import { ConfigStorage } from 'metahub-common'

export interface IElectronAPI extends DocumentDatabase, ConfigStorage {
}

declare global {
  interface Window {
    electronAPI: IElectronAPI
  }
}

export function newAppServices(): AppServices {
  const api = window.electronAPI
  return {
    config: api,
    database: api,
  }
}
