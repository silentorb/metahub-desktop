import { DocumentDataSource } from 'metahub-protocol'

export interface IElectronAPI extends DocumentDataSource {
}

declare global {
  interface Window {
    electronAPI: IElectronAPI
  }
}

const _api = window.electronAPI

export const api = () => window.electronAPI

export const getDatabase: () => DocumentDataSource = () => window.electronAPI
