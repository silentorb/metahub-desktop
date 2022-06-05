import { RecordPath, DocumentInfo, NonEmptyStringArray, DataDocument } from 'metahub-protocol'

export interface RecordInfo extends DocumentInfo {
  path: NonEmptyStringArray
  storagePath: string
}

export type RecordDocument = DataDocument & RecordInfo

export interface MarkdownDatabaseConfig {
  path: string
}

export interface MarkdownDatabaseCache {
  index: { [key: RecordPath]: RecordInfo }
}
