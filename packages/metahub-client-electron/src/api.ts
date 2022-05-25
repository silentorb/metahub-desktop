import { DocumentDatabase } from 'metahub-protocol'
import { AppServices } from 'metahub-client/src/types'

export interface IElectronAPI extends DocumentDatabase {
}

declare global {
  interface Window {
    electronAPI: IElectronAPI
  }
}

export function newAppServices(): AppServices {
  return {
    database: window.electronAPI
  }
}
