import * as path from 'path'
import { NonEmptyStringArray, RecordInfo } from 'metahub-protocol'
import { none, Option, some } from 'fp-ts/Option'
import * as O from 'fp-ts/Option'

export function getFilePathWithoutExtension(file: string): string {
  const match = file.match(/^(.*)\.[^.]+$/)
  return match ? match[1] : file
}

export function getFileNameWithoutExtension(file: string): string {
  return getFilePathWithoutExtension(path.basename(file))
}

export function getRecordPathFromFullPath(filePath: string, rootPath: string): Option<Omit<RecordInfo, 'title'>> {
  const withoutExternal = path.relative(rootPath, filePath)
  const withoutExtension = getFilePathWithoutExtension(withoutExternal)
  const tokens = withoutExtension.split('/')
  return tokens.length > 0
    ? some({
      id: withoutExtension,
      path: tokens as NonEmptyStringArray,
      storagePath: filePath,
    })
    : none
}
