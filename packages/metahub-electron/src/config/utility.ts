import { AppState, StorageDirectories } from './types'
import { ConfigElement } from 'metahub-common'
import { Either } from 'fp-ts/Either'
import * as E from 'fp-ts/Either'
import { pipe } from 'fp-ts/function'

export function getConfigDirectory(root: string) {
  return `${root}/.metahub`
}

export const getProjectStateFilePath = (root: string) => (key: string) => {
  const configPath = getConfigDirectory(root)
  return `${configPath}/${key}.json`
}

export const getConfigFilePath = (directories: StorageDirectories) => (element: ConfigElement<any, string>): string => {
  const configPath = directories[element.storageLayer]
  return `${configPath}/${element.key}.json`
}

export const getConfigElement = (app: AppState) => (key: string): Either<Error, ConfigElement<any, string>> => {
  const config = app.configElements[key]
  return pipe(
    config,
    E.fromPredicate(c => !!c, () => new Error())
  )
}
