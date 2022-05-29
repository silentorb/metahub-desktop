import { AsyncResponse, DataDocument, DataSource, DocumentInfo, RecordPath, } from 'metahub-protocol'
import { gatherFiles, loadDocument } from './reading'
import { MarkdownDatabaseCache, MarkdownDatabaseConfig } from './types'
import { updateRecord } from './writing'
import { right } from 'fp-ts/Either'
import * as path from 'path'

const voidSuccessResponse = right(undefined)

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

  async copyRecord(previous: RecordPath, next: RecordPath): AsyncResponse<void> {
    return right(undefined)
  }

  async deleteRecord(path: RecordPath): AsyncResponse<void> {
    return voidSuccessResponse
  }

  async getAllRecords(): AsyncResponse<DocumentInfo[]> {
    const result = await gatherFiles(this.config.path)
    return right(result)
  }

  async getRecordContent(id: string): AsyncResponse<DataDocument> {
    return loadDocument(id, this.getDocumentPath(id))()
  }

  async moveRecord(previous: RecordPath, next: RecordPath): AsyncResponse<void> {
    return voidSuccessResponse
  }

  async writeRecord(path: RecordPath, content: DataDocument): AsyncResponse<void> {
    const cache = this.cache
    const info = cache.index[path]
    if (info) {
      const newInfo = await updateRecord(info, content)
      cache.index[path] = newInfo
    }

    return voidSuccessResponse
  }

}
