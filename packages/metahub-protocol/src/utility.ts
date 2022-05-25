// This file should only contain functions that support the typing of the protocol types

import { NonEmptyArray, NonEmptyStringArray, ResponseBundle } from './types'

function resolveNonEmptyArray<T>(array: T[]): NonEmptyArray<T> | [] {
  return array.length > 0
    ? array as NonEmptyArray<T>
    : []
}

export function newSuccessResponse<T>(result: T): ResponseBundle<T> {
  return [undefined, result]
}

export const voidSuccessResponse: ResponseBundle<void> = [undefined, undefined]

export function newErrorResponse<T>(error: Error): ResponseBundle<T> {
  return [error, undefined]
}
