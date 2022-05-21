
export type RecordPath = string

export interface RecordInfo {
  path: RecordPath
  namespace: string
  name: string
  storagePath: string
  title: string
}

export interface DataReader<T> {
  getAllRecords(): Promise<RecordPath[]>

  getRecordContent(): Promise<T>
}

export interface DataWriter<T> {
  copyRecord(previous: RecordPath, next: RecordPath): Promise<void>

  deleteRecord(path: RecordPath): Promise<void>

  moveNamespace(previous: string, next: string): Promise<void>

  moveRecord(previous: RecordPath, next: RecordPath): Promise<void>

  writeRecord(path: RecordPath, content: T): Promise<void>
}

export interface DataSource<T> extends DataReader<T>, DataWriter<T> {

}
