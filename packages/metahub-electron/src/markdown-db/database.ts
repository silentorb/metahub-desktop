import { AsyncResponse, DataDocument, DataSource, DocumentInfo, RecordPath, } from 'metahub-protocol'
import { gatherFiles, loadDocument } from './reading'
import { MarkdownDatabaseCache, MarkdownDatabaseConfig } from './types'
import { updateRecord } from './writing'
import * as path from 'path'
import * as TE from 'fp-ts/TaskEither'
import { pipe } from 'fp-ts/function'

const voidSuccessResponse = TE.right(undefined)

export class MarkdownDatabase implements DataSource<DataDocument> {
  config: MarkdownDatabaseConfig
  root: string
  cache: MarkdownDatabaseCache = {
    index: {}
  }

  constructor(config: MarkdownDatabaseConfig) {
    this.config = config
    this.root = path.resolve(config.path).replace(/\\/g, '/')
  }

  getDocumentPath(id: string): string {
    return `${this.root}/${id}.md`
  }

  copyRecord(previous: RecordPath, next: RecordPath): AsyncResponse<void> {
    return TE.right(undefined)
  }

  deleteRecord(path: RecordPath): AsyncResponse<void> {
    return voidSuccessResponse
  }

  getAllRecords(): AsyncResponse<readonly DocumentInfo[]> {
    return gatherFiles(this.config.path)
  }

  getRecordContent(id: string): AsyncResponse<DataDocument> {
    return loadDocument(id, this.getDocumentPath(id))
  }

  moveRecord(previous: RecordPath, next: RecordPath): AsyncResponse<void> {
    return voidSuccessResponse
  }

  writeRecord(path: RecordPath, content: DataDocument): AsyncResponse<void> {
    const cache = this.cache
    const info = cache.index[path]
    if (info) {
      return pipe(
        updateRecord(info, content),
        TE.map(newInfo => {
          cache.index[path] = newInfo
        })
      )
    }

    return TE.left(Error(`Could not find file info for ${path}`))
  }

}
