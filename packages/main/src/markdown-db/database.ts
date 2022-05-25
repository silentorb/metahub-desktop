import { DataDocument, DataSource, RecordInfo, RecordPath } from 'metahub-protocol'
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

  copyRecord(previous: RecordPath, next: RecordPath): Promise<void> {
    return Promise.resolve(undefined)
  }

  deleteRecord(path: RecordPath): Promise<void> {
    return Promise.resolve(undefined)
  }

  async getAllRecords(): Promise<RecordInfo[]> {
    const result = await gatherFiles(this.config.path)
    return result.map(r => r.info)
  }

  getRecordContent(): Promise<DataDocument> {
    const result = {} as any
    return Promise.resolve(result)
  }

  moveRecord(previous: RecordPath, next: RecordPath): Promise<void> {
    return Promise.resolve(undefined)
  }

  async writeRecord(path: RecordPath, content: DataDocument): Promise<void> {
    const cache = this.cache
    const info = cache.index[path]
    if (info) {
      const newInfo = await updateRecord(info, content)
      cache.index[path] = newInfo
    }
  }

}
