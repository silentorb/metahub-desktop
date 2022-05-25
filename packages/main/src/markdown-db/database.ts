import {
  AsyncResponse,
  DataDocument,
  DataSource,
  newSuccessResponse,
  RecordInfo,
  RecordPath,
  voidSuccessResponse
} from 'metahub-protocol'
import { gatherFiles } from './reading'
import { MarkdownDatabaseCache, MarkdownDatabaseConfig } from './types'
import { updateRecord } from './writing'

export class MarkdownDatabase implements DataSource<DataDocument> {
  config: MarkdownDatabaseConfig
  cache: MarkdownDatabaseCache = {
    index: {}
  }

  constructor(config: MarkdownDatabaseConfig) {
    this.config = config
  }

  async copyRecord(previous: RecordPath, next: RecordPath): AsyncResponse<void> {
    return voidSuccessResponse
  }

  async deleteRecord(path: RecordPath): AsyncResponse<void> {
    return voidSuccessResponse
  }

  async getAllRecords(): AsyncResponse<RecordInfo[]> {
    const result = await gatherFiles(this.config.path)
    return newSuccessResponse(result.map(r => r.info))
  }

  getRecordContent(): AsyncResponse<DataDocument> {
    const result = {} as any
    return Promise.resolve(result)
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
