import path from 'path'
import { RecordSurfaceInfo } from '../core'

export function getFilePathWithoutExtension(file: string): string {
  const match = file.match(/^(.*)\.[^.]+$/)
  return match ? match[1] : file
}

export function getFileNameWithoutExtension(file: string): string {
  return getFilePathWithoutExtension(path.basename(file))
}

export function getRecordPathFromFullPath(filePath: string, rootPath: string): RecordSurfaceInfo {
  const withoutExternal = path.relative(filePath, rootPath)
  const withoutExtension = getFilePathWithoutExtension(withoutExternal)
  return {
    path: withoutExtension,
    namespace: path.dirname(withoutExtension),
    name: path.basename(withoutExtension),
    storagePath: filePath,
  }
}
