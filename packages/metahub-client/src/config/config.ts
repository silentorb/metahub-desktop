import { atom, Loadable, RecoilValue, WrappedValue } from 'recoil'
import { pipe } from 'fp-ts/function'
import { ConfigKeyType, workspaceLayout } from 'metahub-common'
import { DataResource, getServices, ifDataResourceIsReady, loadingState, setDataResource } from '../api'
import * as TE from 'fp-ts/TaskEither'

export type AtomDefaultValue<T> = RecoilValue<T> | Promise<T> | Loadable<T> | WrappedValue<T> | T

export const configState = <T>(key: ConfigKeyType<T>, defaultValue: AtomDefaultValue<DataResource<T>> = loadingState) =>
  atom<DataResource<T>>({
    key: `config/${key}`,
    default: defaultValue,
    effects: [
      ({ setSelf }) => {
        pipe(
          getServices().application.loadConfig<T>(key()),
          setDataResource(setSelf),
        )()
      },
      ({ onSet }) => {
        onSet(
          ifDataResourceIsReady(value =>
            pipe(
              getServices().application.saveConfig(key(), value),
              TE.mapLeft(error => console.error(`Could not save config ${key()} (${error.message})`))
            )
          )
        )
      }
    ]
  })

export const configWorkspaceLayout = configState(workspaceLayout)
