import { RecordPath, RecordInfo } from '../core'

export interface MarkdownDatabaseConfig {
  path: string
}

export interface MarkdownDatabaseCache {
  index: { [key: RecordPath]: RecordInfo }
}

export type MarkdownTree = any

export interface MarkdownRecord {
  metadata: any
  content: MarkdownTree
}
