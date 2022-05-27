export type RecordPath = string

export type NonEmptyArray<T> = [T, ...T[]]
export type NonEmptyStringArray = NonEmptyArray<string>

export type ResponseBundle<T> = [undefined, T] | [Error, undefined]
export type AsyncResponse<T> = Promise<ResponseBundle<T>>

export interface RecordInfo {
  id: string
  path: NonEmptyStringArray
  storagePath: string
  title: string
}

export interface DataReader<T> {
  getAllRecords(): AsyncResponse<RecordInfo[]>

  getRecordContent(): AsyncResponse<T>
}

export interface DataWriter<T> {
  copyRecord(previous: string, next: string): AsyncResponse<void>

  deleteRecord(path: string): AsyncResponse<void>

  moveRecord(previous: string, next: string): AsyncResponse<void>

  writeRecord(path: string, content: T): AsyncResponse<void>
}

export interface DataSource<T> extends DataReader<T>, DataWriter<T> {
}

export interface DataDocument {
  info: RecordInfo
  metadata?: any
  content?: any
}

export type DocumentDatabase = DataSource<DataDocument>
