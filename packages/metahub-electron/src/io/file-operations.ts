import * as fs from 'fs'
import { flatten } from '../markdown-db/utility'
import * as path from 'path'
import * as TE from 'fp-ts/TaskEither'
import * as O from 'fp-ts/Option'
import { TaskEither } from 'fp-ts/TaskEither'
import { pipe } from 'fp-ts/function'
import { validateObject } from 'metahub-common'
import { Option } from 'fp-ts/Option'

export function getFilesRecursive(fileOrDirectory: string): string[] {
  if (fileOrDirectory == '.' || fileOrDirectory == '..')
    return []

  const fullPath = path.resolve(fileOrDirectory)

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

export function readJsonFile(filePath: string): TaskEither<Error, any> {
  return pipe(
    readFile(filePath),
    TE.chainEitherK(JSON.parse)
  )
}

export const readValidatedJsonFile = <T>(type: new () => T) => (filePath: string): TaskEither<Error, T> =>
  pipe(
    readJsonFile(filePath),
    validateObject(type),
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
