import { RecordPath, RecordInfo } from 'metahub-protocol'

export interface MarkdownDatabaseConfig {
  path: string
}

export interface MarkdownDatabaseCache {
  index: { [key: RecordPath]: RecordInfo }
}

export type MarkdownTree = any
