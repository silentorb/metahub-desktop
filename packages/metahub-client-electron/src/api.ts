import { DocumentDatabase } from 'metahub-protocol'
import { AppServices } from 'metahub-client'
import { Application } from 'metahub-common'

export interface IElectronAPI extends DocumentDatabase, Application {
}

declare global {
  interface Window {
    electronAPI: IElectronAPI
  }
}

export function newAppServices(): AppServices {
  const api = window.electronAPI
  return {
    application: api,
    database: api,
  }
}
