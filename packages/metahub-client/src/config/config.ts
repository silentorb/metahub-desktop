import { atom, Loadable, RecoilValue, WrappedValue } from 'recoil'
import { pipe } from 'fp-ts/function'
import { ConfigKeyType, workspaceLayout } from 'metahub-common'
import { getServices } from '../api'
import * as TE from 'fp-ts/TaskEither'
import { none, Option, some } from 'fp-ts/Option'
import * as O from 'fp-ts/Option'

export type AtomDefaultValue<T> = RecoilValue<T> | Promise<T> | Loadable<T> | WrappedValue<T> | T

export const configState = <T>(key: ConfigKeyType<T>, defaultValue: AtomDefaultValue<Option<T>> = none) => atom<Option<any>>({
  key: 'config',
  default: defaultValue,
  effects: [
    ({ setSelf }) => {
      pipe(
        getServices().application.loadConfig<any>(key()),
        TE.match(
          _ => {
          },
          value => {
            setSelf(some(value))
          }
        ),
      )
    },
    ({ onSet }) => {
      onSet(
        O.match(
          () => {
          },
          value => {
            pipe(
              getServices().application.saveConfig(key(), value),
              TE.mapLeft(error => console.error(`Could not save config ${key()} (${error.message})`))
            )
          }
        )
      )
    }
  ]
})

export const configWorkspaceLayout = configState(workspaceLayout)
