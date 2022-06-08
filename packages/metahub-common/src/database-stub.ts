import { DocumentDatabase, } from '../metahub-protocol'
import * as TE from 'fp-ts/TaskEither'

const voidSuccessResponse = TE.right(undefined)

export const newDatabaseStub = (): DocumentDatabase => ({
  getRecordContent: () =>
    TE.left(new Error('No database implementation is yet initialized')),

  writeRecord: ({ id, content }) =>
    voidSuccessResponse,

  copyRecord: ({ previous, next }) =>
    voidSuccessResponse,

  deleteRecord: ({ path }) =>
    voidSuccessResponse,

  getAllRecords: () =>
    TE.right([]),

  moveRecord: ({ previous, next }) =>
    TE.right(undefined),

})
