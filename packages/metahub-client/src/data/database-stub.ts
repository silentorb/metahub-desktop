import {
  AsyncResponse,
  DataDocument,
  DocumentDatabase,
  RecordInfo,
} from 'metahub-protocol'
import { left, right } from 'fp-ts/Either'

const voidSuccessResponse = right(undefined)

export class DatabaseStub implements DocumentDatabase {
  async getRecordContent(): AsyncResponse<DataDocument> {
    return left(new Error('No database implementation is yet initialized'))
  }

  async writeRecord(path: string, content: DataDocument): AsyncResponse<void> {
    return voidSuccessResponse
  }

  async copyRecord(previous: string, next: string): AsyncResponse<void> {
    return voidSuccessResponse
  }

  async deleteRecord(path: string): AsyncResponse<void> {
    return voidSuccessResponse
  }

  async getAllRecords(): AsyncResponse<RecordInfo[]> {
    return right([])
  }

  async moveRecord(previous: string, next: string): AsyncResponse<void> {
    return right(undefined)
  }

}
