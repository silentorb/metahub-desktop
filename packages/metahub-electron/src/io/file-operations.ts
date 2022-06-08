import * as fs from 'fs'
import { flatten } from '../markdown-db/utility'
import * as path from 'path'
import * as E from 'fp-ts/Either'
import * as TE from 'fp-ts/TaskEither'
import * as O from 'fp-ts/Option'
import { TaskEither } from 'fp-ts/TaskEither'
import { pipe } from 'fp-ts/function'
import { validateObject } from 'metahub-common'
import { Type } from 'metahub-protocol'
import { Option } from 'fp-ts/Option'
import { Either } from 'fp-ts/Either'
import { resolveDirectoryPath } from '../markdown-db'

export function getFilesRecursive(fileOrDirectory: string): string[] {
  if (fileOrDirectory == '.' || fileOrDirectory == '..')
    return []

  const fullPath = resolveDirectoryPath(fileOrDirectory)

  if (!fs.existsSync(fullPath))
    throw new Error(`Could not find source directory: "${fullPath}"`)

  if (fs.lstatSync(fullPath).isDirectory()) {
    const hierarchy = fs.readdirSync(fullPath).map(f =>
      getFilesRecursive(fileOrDirectory + '/' + f)
    )
    return flatten(hierarchy)
  } else if (path.extname(fullPath) == '.md') {
    return [fullPath]
  } else {
    return []
  }
}

export function readFile(filePath: string): TaskEither<Error, string> {
  return TE.tryCatch(
    () => fs.promises.readFile(filePath, 'utf8'),
    reason => new Error(`${reason}`)
  )
}

export const parseJson = (jsonString: string): Either<Error, any> =>
  E.tryCatch(
    () => JSON.parse(jsonString),
    reason => new Error(`${reason}`)
  )

export function readJsonFile(filePath: string): TaskEither<Error, any> {
  return pipe(
    readFile(filePath),
    TE.chainEitherK(parseJson),
  )
}

export const readValidatedJsonFile = <T>(type: Type<T>) => (filePath: string): TaskEither<Error, T> =>
  pipe(
    readJsonFile(filePath),
    TE.chain(
      validateObject(type),
    )
  )

export const ensureDirectoryExists = (directoryPath: string): TaskEither<Error, Option<string>> =>
  pipe(
    TE.tryCatch(
      () => fs.promises.mkdir(directoryPath, { recursive: true }),
      reason => new Error(`${reason}`),
    ),
    TE.map(O.fromNullable)
  )

export const writeFile = (filePath: string) => (content: string): TaskEither<Error, void> =>
  TE.tryCatch(
    () => fs.promises.writeFile(filePath, content),
    reason => new Error(`${reason}`),
  )
