import { ConfigStorage } from 'metahub-common'
import { loadConfig } from '../config/load-config'
import { AppState, saveConfig } from '../config'
import * as TE from 'fp-ts/TaskEither'

export const newConfigStorage = (state: AppState): ConfigStorage => {
  return {
    loadConfig: loadConfig(state),
    saveConfig: saveConfig(state),
  }
}

export const newConfigStub = (): ConfigStorage => ({
  loadConfig: () => TE.left(new Error("Using a stub config implementation that cannot load real config data")),
  saveConfig: () => TE.left(new Error("Using a stub config implementation that cannot save config data")),
})
