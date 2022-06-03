import { DataResource, loadingState } from '../api'
import React from 'react'
import * as E from 'fp-ts/Either'
import { pipe } from 'fp-ts/function'
import { RecoilState, useRecoilState } from 'recoil'

export type LoadingComponent<T> = (value: T, set: (newValue: DataResource<T>) => void) => JSX.Element

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
