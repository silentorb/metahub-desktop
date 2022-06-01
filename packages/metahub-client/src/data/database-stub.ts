import {
  AsyncResponse,
  DataDocument,
  DocumentDatabase,
  RecordInfo,
} from 'metahub-protocol'
import * as TE from 'fp-ts/TaskEither'

const voidSuccessResponse = TE.right(undefined)

export class DatabaseStub implements DocumentDatabase {
  getRecordContent(): AsyncResponse<DataDocument> {
    return TE.left(new Error('No database implementation is yet initialized'))
  }

  writeRecord(path: string, content: DataDocument): AsyncResponse<void> {
    return voidSuccessResponse
  }

  copyRecord(previous: string, next: string): AsyncResponse<void> {
    return voidSuccessResponse
  }

  deleteRecord(path: string): AsyncResponse<void> {
    return voidSuccessResponse
  }

  getAllRecords(): AsyncResponse<RecordInfo[]> {
    return TE.right([])
  }

  moveRecord(previous: string, next: string): AsyncResponse<void> {
    return TE.right(undefined)
  }

}
