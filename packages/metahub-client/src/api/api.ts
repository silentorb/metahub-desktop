import { Either, left, right } from 'fp-ts/Either'
import { DefaultValue, WrappedValue } from 'recoil'
import * as TE from 'fp-ts/TaskEither'
import { AppServices } from '../types'

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

export const loadDataResource = <T>(setSelf: SetSelf<DataResource<T>>) =>
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
