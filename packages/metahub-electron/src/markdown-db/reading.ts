import { getFilesRecursive, readFile } from '../io'
import { getRecordInfoFromAbsolutePath } from './path-operations'
import { DocumentContents } from 'metahub-protocol'
import * as O from 'fp-ts/Option'
import { pipe } from 'fp-ts/function'
import * as TE from 'fp-ts/TaskEither'
import { TaskEither } from 'fp-ts/TaskEither'
import * as E from 'fp-ts/Either'
import { getOptionalMarkdownTitle, parseMarkdown } from 'metahub-markdown'
import { RecordDocument } from './types'
import { Parent } from 'unist'

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

export const getTitle = (id: string, content: Parent) =>
  pipe(
    getOptionalMarkdownTitle(content),
    O.getOrElse(() => id.substring(id.lastIndexOf('/') + 1)),
  )

export const loadDocument = (rootPath: string) => (filePath: string): TaskEither<Error, RecordDocument> =>
  pipe(
    loadDocumentWithAST(filePath),
    TE.chainEitherK(({ textContent, content }) =>
      pipe(
        getRecordInfoFromAbsolutePath(rootPath)(filePath),
        E.map(info => ({
            ...info,
            title: getTitle(info.id, content),
            content,
            textContent,
          })
        )
      )
    )
  )

export function gatherFiles(rootPath: string): TaskEither<Error, readonly RecordDocument[]> {
  return pipe(
    getFilesRecursive(rootPath),
    TE.traverseArray(
      loadDocument(rootPath)
    )
  )
}
