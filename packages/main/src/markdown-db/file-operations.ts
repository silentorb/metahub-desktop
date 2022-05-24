import * as fs from 'fs'
import { flatten } from './utility'
import * as path from 'path'

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

export function writeFile(filePath: string, content: string): Promise<void> {
  return fs.writeFile.__promisify__(filePath, content)
}
