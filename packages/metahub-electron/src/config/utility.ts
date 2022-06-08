import { AppDirectories, ConfigElementMap } from './types'
import { ConfigElement } from 'metahub-common'
import * as E from 'fp-ts/Either'
import { Either } from 'fp-ts/Either'
import * as R from 'fp-ts/Record'
import { pipe } from 'fp-ts/function'

export function getConfigDirectory(root: string) {
  return `${root}/.metahub`
}

export const getProjectStateFilePath = (root: string) => (key: string) => {
  const configPath = getConfigDirectory(root)
  return `${configPath}/${key}.json`
}

export const getConfigFilePath = (directories: AppDirectories) => (element: ConfigElement<any, string>): string => {
  const configPath = directories[element.storageLayer]
  return `${configPath}/${element.key}.json`
}

export const getConfigElement = (configElements: ConfigElementMap) => (key: string): Either<Error, ConfigElement<any, any>> =>
  pipe(
    configElements,
    R.lookup(key),
    E.fromOption(() => new Error(`Could not find config path for ${key}`)),
  )
