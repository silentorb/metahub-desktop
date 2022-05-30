import React from 'react'
import { DataDocument, DocumentDatabase } from 'metahub-protocol'
import { DatabaseStub } from './database-stub'
import { contextWrapper } from '../utility'
import { atomFamily, selectorFamily } from 'recoil'
import * as E from 'fp-ts/Either'
import { pipe } from 'fp-ts/function'
import { getServices } from '../api'

export interface DatabaseProps {
  database: DocumentDatabase
}

export const DatabaseContext = React.createContext<DatabaseProps>({
  database: new DatabaseStub(),
})

export const withDatabase = contextWrapper(DatabaseContext)

export enum DocumentStatus {
  failed = 'failed',
  loading = 'loading',
  available = 'available',
}

export interface LoadingDocument {
  status: DocumentStatus.loading
}

export interface FailedDocument {
  status: DocumentStatus.failed
  error: Error
}

export interface AvailableDocument {
  status: DocumentStatus.available
  document: DataDocument
}

export type WrappedDocument = LoadingDocument | AvailableDocument | FailedDocument

export const documentsState = atomFamily<WrappedDocument, string>({
  key: 'documents',
  default: { status: DocumentStatus.loading },
  effects: id => [
    ({ setSelf }) => {
      getServices().database.getRecordContent(id)
        .then(result => {
          const wrappedDocument = pipe(
            result,
            E.match<Error, DataDocument, WrappedDocument>(
              error => ({ status: DocumentStatus.failed, error }),
              document => ({ status: DocumentStatus.available, document })
            )
          )
          setSelf(wrappedDocument)
        })
    }
  ]
})

// export const documentsQuery = selectorFamily({
//   key: 'documentsQuery',
//   get: (id: string) => async () => {
//     return staticDatabase.getRecordContent(id)
//   },
// })
