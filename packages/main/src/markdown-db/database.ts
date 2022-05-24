import { DataSource, RecordInfo, RecordPath } from 'metahub-common'
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

  async getAllRecords(): Promise<RecordInfo[]> {
    return gatherFiles(this.config.path)
  }

  getRecordContent(): Promise<MarkdownRecord> {
    const result = {} as any
    return Promise.resolve(result)
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
