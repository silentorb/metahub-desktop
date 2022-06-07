import { DataResource, loadingState } from '../api'
import React from 'react'
import * as E from 'fp-ts/Either'
import * as O from 'fp-ts/Option'
import { pipe } from 'fp-ts/function'
import { RecoilState, useRecoilState } from 'recoil'

export type LoadingComponent<T> = (value: T, set: (newValue: DataResource<T>) => void) => JSX.Element
export type DataResourceSetter<T> = (set: DataResource<T>) => void

export function useLoading<T>(state: RecoilState<DataResource<T>>, component: LoadingComponent<T>) {
  const [value, set] = useRecoilState(state)
  return value === loadingState
    ? <div>Loading</div>
    : pipe(
      value,
      E.map(get => component(get, set)),
      E.getOrElse(error => <div>Error: {error.message}</div>)
    )
}

export const defaultLoadingError = (error: Error) => <div>Error: {error.message}</div>

export const withRequiredLoading = <T, K extends string, InnerProps>(
  state: RecoilState<DataResource<T>>, key: K,
  WrappedComponent: (props: InnerProps) => JSX.Element,
  onError: (error: Error) => JSX.Element = defaultLoadingError) =>
  (props: Omit<Omit<InnerProps, K>, `set${Capitalize<K>}`>): JSX.Element => {
    const [value, set] = useRecoilState(state)
    if (value === loadingState)
      return <div>Loading</div>

    return pipe(
      value,
      E.map(get => {
        const nextProps = {
          ...props,
          [key]: get,
          ['set' + key.charAt(0).toUpperCase() + key.slice(1)]: set,
        }
        return <WrappedComponent {...nextProps as any}/>
      }),
      E.getOrElse(onError)
    )
  }


export const withOptionalLoading = <T, K extends string, InnerProps>(
  state: RecoilState<DataResource<T>>, key: K, defaultValue: () => T,
  WrappedComponent: (props: InnerProps) => JSX.Element) =>
  (props: Omit<Omit<InnerProps, K>, `set${Capitalize<K>}`>): JSX.Element => {
    const [either, set] = useRecoilState(state)
    if (either === loadingState)
      return <div>Loading</div>

    const value = pipe(
      either,
      E.getOrElse(() => defaultValue())
    )

    const nextProps = {
      ...props,
      [key]: value,
      ['set' + key.charAt(0).toUpperCase() + key.slice(1)]: set,
    }

    return <WrappedComponent {...nextProps as any}/>
  }
