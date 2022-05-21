import { getFilesRecursive } from './file-operations'
import { getFileNameWithoutExtension, getRecordPathFromFullPath } from './path-operations'
import { RecordSurfaceInfo } from '../core'

const matter = require('gray-matter')

export type ContentLoader<T> = (file: string) => T

interface Article {
  content: string
  data: any
}

// TODO: Make async
export const loadMarkDown: ContentLoader<Article> = file => {
  const response = matter.read(file)
  const { content } = response
  const data = { ...response.data }
  return { content, data }
}

// TODO: Make async
export function gatherFiles(directory: string): RecordSurfaceInfo[] {
  const files = getFilesRecursive(directory)
  return files.map(file => {
    const key = getFileNameWithoutExtension(file)
    if (!key)
      throw new Error(`Could not find file ${file}`)

    // TODO: Properly format properties
    return getRecordPathFromFullPath(file, directory)
  })
}

// TODO: Make async
export function scanSourceFiles(dirPath: string) {
  const files = gatherFiles(dirPath)

  // for (const [key, filePath] of files) {
  //   // const templateName = article.data.template
  //   const contents = loadMarkDown(filePath)
  // }
}
