import * as fs from 'fs'
import { flatten } from '../markdown-db/utility'
import * as path from 'path'
import * as TE from 'fp-ts/TaskEither'
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
  } else {
    return [fullPath]
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

export function writeFile(filePath: string, content: string): TaskEither<Error, void> {
  return TE.tryCatch(
    () => fs.promises.writeFile(filePath, content),
    reason => new Error(`${reason}`),
  )
}
