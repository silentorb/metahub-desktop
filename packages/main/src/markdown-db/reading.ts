import { getFilesRecursive, readFile } from '../io'
import { getRecordInfoFromAbsolutePath } from './path-operations'
import { DataDocument, DocumentContents } from 'metahub-protocol'
import * as A from 'fp-ts/Array'
import * as O from 'fp-ts/Option'
import { pipe } from 'fp-ts/function'
import * as TE from 'fp-ts/TaskEither'
import { TaskEither } from 'fp-ts/TaskEither'
import * as E from 'fp-ts/Either'
import { getMarkdownTitleOrFilename, getOptionalMarkdownTitle, parseMarkdown } from 'metahub-markdown'
import * as R from 'fp-ts/Record'

export const loadDocumentWithAST = (file: string): TaskEither<Error, DocumentContents> =>
  pipe(
    readFile(file),
    TE.chainEitherK(textContent =>
      pipe(
        parseMarkdown(textContent),
        E.map(content => ({ content, textContent })
        )
      )
    )
  )

export const loadDocument = (id: string, filePath: string): TaskEither<Error, DataDocument> =>
  pipe(
    loadDocumentWithAST(filePath),
    TE.map(({ textContent, content }) =>
      pipe(
        getOptionalMarkdownTitle(content),
        O.getOrElse(() => id.substring(id.lastIndexOf('/') + 1)),
        title => ({
          id,
          title,
          content,
          textContent,
        })
      )
    )
  )

export async function loadDocuments(files: string[]) {
  const result: { [key: string]: DocumentContents } = {}
  const errors = []
  for (const file of files) {
    const k = await pipe(
      loadDocumentWithAST(file),
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

export async function gatherFiles(root: string): Promise<DataDocument[]> {
  const files = getFilesRecursive(root)
  const documents = await loadDocuments(files)
  return A.filterMap((file: string) => {
    return pipe(
      getRecordInfoFromAbsolutePath(file, root),
      O.chain(info => pipe(
        documents,
        R.lookup(file),
        O.map(document => ({
          ...info,
          ...document,
          title: getMarkdownTitleOrFilename(document.content, info)
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
