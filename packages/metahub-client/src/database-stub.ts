import {
  AsyncResponse,
  DataDocument,
  DocumentDatabase,
  newErrorResponse,
  newSuccessResponse,
  RecordInfo,
  voidSuccessResponse
} from 'metahub-protocol'

export class DatabaseStub implements DocumentDatabase {
  async getRecordContent(): AsyncResponse<DataDocument> {
    return newErrorResponse(Error('No database implementation is yet initialized'))
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
    return newSuccessResponse([])
  }

  async moveRecord(previous: string, next: string): AsyncResponse<void> {
    return newSuccessResponse(undefined)
  }

}
