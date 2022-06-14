import * as E from 'fp-ts/Either'
import { Either, left, right } from 'fp-ts/Either'
import { DefaultValue, WrappedValue } from 'recoil'
import * as TE from 'fp-ts/TaskEither'
import * as O from 'fp-ts/Option'
import { none, Option } from 'fp-ts/Option'
import { AppServices } from 'metahub-common'

let services: AppServices

export const getServices = () => services

export const setServices = (value: AppServices) => {
  services = value
}

export const loadingState = 'loading'

export type DataResource<T> = 'loading' | Either<Error, T>

export type SetSelf<T> =
  (param:
     | T
     | DefaultValue
     | Promise<T | DefaultValue>
     | WrappedValue<T>
     | ((param: T | DefaultValue) => T | DefaultValue | WrappedValue<T>),
  ) => void

export const setDataResource = <T>(setSelf: SetSelf<DataResource<T>>) =>
  TE.match<Error, DataResource<T>, T>(
    error => {
      const value = left(error)
      setSelf(value)
      return value
    },
    record => {
      const value = right(record)
      setSelf(value)
      return value
    }
  )

export const ignoreLoading = <T>(resource: DataResource<T> | DefaultValue): Option<T> =>
  resource === loadingState || resource instanceof DefaultValue
    ? none
    : O.getRight(resource)

export const ifDataResourceIsReady = <T, O>(action: (value: T) => O) => (resource: DataResource<T>) => {
  if (resource !== loadingState) {
    E.match(() => {
    }, action)(resource)
  }
}
