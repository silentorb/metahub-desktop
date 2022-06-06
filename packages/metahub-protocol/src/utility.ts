// This file should only contain functions that support the typing of the protocol types

import { NonEmptyArray } from './types'

export function resolveNonEmptyArray<T>(array: T[]): NonEmptyArray<T> | [] {
  return array.length > 0
    ? array as NonEmptyArray<T>
    : []
}
