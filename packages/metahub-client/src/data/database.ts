import React from 'react'
import { DataDocument, DocumentDatabase, DocumentInfo } from 'metahub-protocol'
import { DatabaseStub } from './database-stub'
import { contextWrapper } from '../utility'
import { atom, atomFamily } from 'recoil'
import { pipe } from 'fp-ts/function'
import { DataResource, getServices, loadDataResource, loadingState } from '../api'

export interface DatabaseProps {
  database: DocumentDatabase
}

export const DatabaseContext = React.createContext<DatabaseProps>({
  database: new DatabaseStub(),
})

export const withDatabase = contextWrapper(DatabaseContext)

export const documentsState = atom<DataResource<readonly DocumentInfo[]>>({
  key: 'documents',
  default: loadingState,
  effects: [
    ({ setSelf }) => {
      pipe(
        getServices().database.getAllRecords(),
        loadDataResource(setSelf),
      )()
    }
  ]
})

export const documentState = atomFamily<DataResource<DataDocument>, string>({
  key: 'document',
  default: loadingState,
  effects: id => [
    ({ setSelf }) => {
      pipe(
        getServices().database.getRecordContent(id),
        loadDataResource(setSelf),
      )()
    }
  ]
})
