import { getFilesRecursive, readFile } from './file-operations'
import { getRecordPathFromFullPath } from './path-operations'
import { DataDocument } from 'metahub-protocol'
import * as path from 'path'
import * as A from 'fp-ts/lib/Array'
import * as O from 'fp-ts/Option'
import { pipe } from 'fp-ts/function'
import * as TE from 'fp-ts/lib/TaskEither'
import * as T from 'fp-ts/lib/TaskEither'
import { getMarkdownTitle, parseMarkdown } from 'metahub-markdown'
import * as R from 'fp-ts/lib/Record'
import { VFile } from 'vfile'
import { TaskEither } from 'fp-ts/lib/TaskEither'
import { Parent } from 'unist'

export const loadDocument = (file: string): TaskEither<Error, Parent> =>
  pipe(
    readFile(file),
    TE.chainEitherK(parseMarkdown)
  )

export async function loadDocuments(files: string[]) {
  const result: { [key: string]: Parent } = {}
  const errors = []
  for (const file of files) {
    const k = await pipe(
      loadDocument(file),
      TE.match(
        error => {
          errors.push(error);
          return undefined
        },
        document => result[file] = document
      )
    )()
    const i = 0
  }
  return result
}

export async function gatherFiles(directory: string): Promise<DataDocument[]> {
  const files = getFilesRecursive(directory)
  const root = path.resolve(directory)
  const documents = await loadDocuments(files)
  return A.filterMap((file: string) => {
    return pipe(
      getRecordPathFromFullPath(file, root),
      O.chain(info => pipe(
        documents,
        R.lookup(file),
        O.map(document => ({
          info: {
            ...info,
            title: getMarkdownTitle(document, info)
          }
        }))
      ))
    )
  })(files)
}

// export async function scanSourceFiles(dirPath: string) {
//   const files = gatherFiles(dirPath)
//
//   // for (const [key, filePath] of files) {
//   //   // const templateName = article.data.template
//   //   const contents = loadMarkDown(filePath)
//   // }
// }
