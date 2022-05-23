import { DataSource, RecordInfo, RecordPath } from '../core'
import { gatherFiles } from './reading'
import { MarkdownDatabaseCache, MarkdownDatabaseConfig, MarkdownRecord } from './types'
import { updateRecord } from './writing'

export class MarkdownDatabase implements DataSource<MarkdownRecord> {
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

  async getAllRecords(): Promise<RecordPath[]> {
    return gatherFiles(this.config.path)
      .map(f => f.path)
  }

  getRecordContent(): Promise<MarkdownRecord> {
    return Promise.resolve(undefined)
  }

  moveNamespace(previous: string, next: string): Promise<void> {
    return Promise.resolve(undefined)
  }

  moveRecord(previous: RecordPath, next: RecordPath): Promise<void> {
    return Promise.resolve(undefined)
  }

  async writeRecord(path: RecordPath, content: MarkdownRecord): Promise<void> {
    const cache = this.cache
    const info = cache.index[path]
    if (info) {
      const newInfo = await updateRecord(info, content)
      cache.index[path] = newInfo
    }
  }

}
