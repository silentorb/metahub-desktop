import { atom } from 'recoil'
import { pipe } from 'fp-ts/function'
import { ConfigElement, stateWorkspaceLayout, stateWorkspaceTree } from 'metahub-common'
import { DataResource, getServices, ifDataResourceIsReady, loadingState, setDataResource } from '../api'
import * as TE from 'fp-ts/TaskEither'

export const configState = <T, K extends string>(config: ConfigElement<T, K>) =>
  atom<DataResource<T>>({
    key: `config/${config.key}`,
    default: loadingState,
    effects: [
      ({ setSelf }) => {
        pipe(
          getServices().application.loadConfig<T>(config.key),
          TE.mapLeft(error => {
            console.error(`There was an error loading config ${config.key}: ${error.message}`)
            return error
          }),
          setDataResource(setSelf),
        )()
      },
      ({ onSet }) => {
        onSet(
          ifDataResourceIsReady(value =>
            pipe(
              getServices().application.saveConfig(config.key, value),
              TE.mapLeft(error => console.error(`Could not save config ${config.key} (${error.message})`))
            )
          )
        )
      }
    ]
  })

export const configWorkspaceLayoutState = configState(stateWorkspaceLayout)
export const configWorkspaceTreeState = configState(stateWorkspaceTree)
