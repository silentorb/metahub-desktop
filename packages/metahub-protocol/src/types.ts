import { TaskEither } from './fp'

export type RecordPath = string

export type NonEmptyArray<T> = [T, ...T[]]
export type NonEmptyStringArray = NonEmptyArray<string>

export type Type<T> = new () => T

export interface DocumentInfo {
  id: string
  title: string
  path: NonEmptyStringArray
}

export type AsyncResponse<T> = TaskEither<Error, T>

export interface DataReader<T> {
  getAllRecords(): AsyncResponse<readonly DocumentInfo[]>

  getRecordContent(props: { id: string }): AsyncResponse<T>
}

export interface DataWriter<T> {
  copyRecord(props: { previous: string, next: string }): AsyncResponse<void>

  deleteRecord(props: { path: string }): AsyncResponse<void>

  moveRecord(props: { previous: string, next: string }): AsyncResponse<void>

  writeRecord(props: { id: string, content: T }): AsyncResponse<void>
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
