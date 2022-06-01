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

export function gatherFiles(root: string): TaskEither<Error, readonly DataDocument[]> {
  return pipe(
    getFilesRecursive(root),
    A.filterMap(
      getRecordInfoFromAbsolutePath(root)
    ),
    TE.traverseArray(info =>
      pipe(
        loadDocumentWithAST(info.storagePath),
        TE.map(document => ({
            ...info,
            ...document,
            title: getMarkdownTitleOrFilename(document.content, info)
          })
        )
      )
    )
  )
}
