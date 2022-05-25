import { DocumentDataSource } from 'metahub-protocl'

export interface IElectronAPI extends DocumentDataSource{
}

declare global {
  interface Window {
    electronAPI: IElectronAPI
  }
}

const _api = window.electronAPI

export const api = () => window.electronAPI

export const getDatabase = () => window.electronAPI
