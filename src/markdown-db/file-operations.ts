import * as fs from 'fs'
import * as path from 'path'
import { flatten } from './utility'

export function getFilesRecursive(fileOrDirectory: string): string[] {
  if (!fs.lstatSync(fileOrDirectory).isDirectory())
    return [fileOrDirectory]

  const hierarchy = fs.readdirSync(fileOrDirectory).map(f =>
    getFilesRecursive(fileOrDirectory + '/' + f)
  )

  return flatten(hierarchy)
}

export function writeFile(filePath: string, content: string): Promise<void> {
  return fs.writeFile.__promisify__(filePath, content)
}
