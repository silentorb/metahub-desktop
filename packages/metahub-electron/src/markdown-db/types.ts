import { DataDocument, DocumentInfo, RecordPath } from 'metahub-protocol'

export interface RecordInfo extends DocumentInfo {
  storagePath: string
}

export type RecordDocument = DataDocument & RecordInfo

export interface MarkdownDatabaseConfig {
  path: string
}

export interface MarkdownDatabaseCache {
  index: { [key: RecordPath]: RecordInfo }
}
