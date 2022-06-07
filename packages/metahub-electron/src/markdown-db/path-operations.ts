import * as path from 'path'
import { NonEmptyStringArray } from 'metahub-protocol'
import { RecordInfo, SanitizedPath } from './types'
import { Either, left, right } from 'fp-ts/Either'
import { pipe } from 'fp-ts/function'

export function getFilePathWithoutExtension(file: string): string {
  const match = file.match(/^(.*)\.[^.]+$/)
  return match ? match[1] : file
}

export function getFileNameWithoutExtension(file: string): string {
  return getFilePathWithoutExtension(path.basename(file))
}

export const sanitizeDirectoryPath = (path: string): SanitizedPath =>
  path.replace(/\\+/g, '/')

export const getRecordInfoFromAbsolutePath = (rootPath: string) => (filePath: string): Either<Error, Omit<RecordInfo, 'title'>> => {
  const id = pipe(
    path.relative(rootPath, filePath),
    sanitizeDirectoryPath,
    getFilePathWithoutExtension,
  )

  const tokens = id.split('/')
  return tokens.length > 0
    ? right({
      id,
      path: tokens as NonEmptyStringArray,
      storagePath: filePath,
    })
    : left(new Error(`Invalid path format: ${rootPath}`))
}
