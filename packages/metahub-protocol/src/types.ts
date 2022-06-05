import { TaskEither } from './fp'

export type RecordPath = string

export type NonEmptyArray<T> = [T, ...T[]]
export type NonEmptyStringArray = NonEmptyArray<string>

export interface DocumentInfo {
  id: string
  title: string
}

export type AsyncResponse<T> = TaskEither<Error, T>

export interface DataReader<T> {
  getAllRecords(): AsyncResponse<readonly DocumentInfo[]>

  getRecordContent(id: string): AsyncResponse<T>
}

export interface DataWriter<T> {
  copyRecord(previous: string, next: string): AsyncResponse<void>

  deleteRecord(path: string): AsyncResponse<void>

  moveRecord(previous: string, next: string): AsyncResponse<void>

  writeRecord(path: string, content: T): AsyncResponse<void>
}

export interface DataSource<T> extends DataReader<T>, DataWriter<T> {
}

export interface DocumentContents {
  content?: any
  textContent: string
}

export interface DataDocument extends DocumentInfo, DocumentContents {
  metadata?: any
}

export type DocumentDatabase = DataSource<DataDocument>
