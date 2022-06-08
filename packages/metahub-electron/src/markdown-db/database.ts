import {
  AsyncResponse,
  DataDocument,
  DataReader,
  DataSource,
  DataWriter,
  DocumentInfo,
  RecordPath,
} from 'metahub-protocol'
import { gatherFiles, loadDocument } from './reading'
import { MarkdownDatabaseCache, MarkdownDatabaseConfig, SanitizedPath } from './types'
import { updateRecord } from './writing'
import * as path from 'path'
import * as TE from 'fp-ts/TaskEither'
import { pipe } from 'fp-ts/function'

const voidSuccessResponse = TE.right(undefined)

export const newMarkdownDatabaseReader = (cache: MarkdownDatabaseCache, root: SanitizedPath): DataWriter<DataDocument> => {
  return {
    copyRecord: (props: { previous: string, next: string }): AsyncResponse<void> => {
      return TE.right(undefined)
    },

    deleteRecord: (props: { path: string }): AsyncResponse<void> => {
      return voidSuccessResponse
    },

    moveRecord: ({ previous, next }): AsyncResponse<void> => {
      return voidSuccessResponse
    },

    writeRecord: ({ id, content }): AsyncResponse<void> => {
      const info = cache.index[id]
      if (info) {
        return pipe(
          updateRecord(info, content),
          TE.map(newInfo => {
            cache.index[id] = newInfo
          })
        )
      }

      return TE.left(Error(`Could not find file info for ${id}`))
    },
  }
}

export const newMarkdownDatabaseWriter = (cache: MarkdownDatabaseCache, root: SanitizedPath): DataReader<DataDocument> => {
  const getDocumentPath = (id: string): string =>
    `${root}/${id}.md`

  return {
    getAllRecords: (): AsyncResponse<readonly DocumentInfo[]> => {
      return pipe(
        gatherFiles(root),
        TE.map(files => {
          for (const file of files) {
            cache.index[file.id] = file
          }
          return files
        })
      )
    },

    getRecordContent: ({ id }): AsyncResponse<DataDocument> => {
      return loadDocument(root)(getDocumentPath(id))
    },

  }
}

export const newMarkdownDatabase = (config: MarkdownDatabaseConfig): DataSource<DataDocument> => {
  const root = config.root
  const cache: MarkdownDatabaseCache = {
    index: {}
  }

  return {
    ...newMarkdownDatabaseReader(cache, root),
    ...newMarkdownDatabaseWriter(cache, root),
  }
}
