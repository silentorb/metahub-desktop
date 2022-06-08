import { ConfigStorage } from 'metahub-common'
import { loadConfig } from '../config/load-config'
import { AppState, saveConfig } from '../config'

export const newConfigStorage = (state: AppState): ConfigStorage => {
  return {
    loadConfig: loadConfig(state),
    saveConfig: saveConfig(state),
  }
}
