import React from 'react'
import { DataDocument, DocumentDatabase, DocumentInfo } from 'metahub-protocol'
import { newDatabaseStub } from 'metahub-common'
import { contextWrapper } from '../utility'
import { atom, atomFamily } from 'recoil'
import { pipe } from 'fp-ts/function'
import { DataResource, getServices, ifDataResourceIsReady, ignoreLoading, loadingState, setDataResource } from '../api'
import * as TE from 'fp-ts/TaskEither'
import * as O from 'fp-ts/Option'
import * as A from 'fp-ts/Array'

export interface DatabaseProps {
  database: DocumentDatabase
}

export const DatabaseContext = React.createContext<DatabaseProps>({
  database: newDatabaseStub(),
})

export const withDatabase = contextWrapper(DatabaseContext)

export const documentsState = atom<DataResource<readonly DocumentInfo[]>>({
  key: 'documents',
  default: loadingState,
  effects: [
    ({ setSelf, onSet }) => {
      pipe(
        getServices().database.getAllRecords(),
        setDataResource(setSelf),
      )()

      onSet((newValue, oldValue) =>
        pipe(
          newValue,
          ifDataResourceIsReady(content => {
            const previous = pipe(
              oldValue,
              ignoreLoading,
              O.getOrElse(() => [] as readonly DocumentInfo[]),
            )

            const added = content.filter(r1 => !previous.some(r2 => r1.id == r2.id))
            const removed = previous.filter(r1 => !content.some(r2 => r1.id == r2.id))
            // return pipe(
            //   added,
            //   A.map(),
            //   // getServices().database.writeRecord({ id, content }),
            //   TE.mapLeft(error => console.error(`Could not save document ${id} (${error.message})`))
            // )()
          })
        )
      )
    }
  ]
})

export const documentState = atomFamily<DataResource<DataDocument>, string>({
  key: 'document',
  default: loadingState,
  effects: id => [
    ({ setSelf, onSet }) => {
      pipe(
        getServices().database.getRecordContent({ id }),
        setDataResource(setSelf),
      )()

      onSet(
        ifDataResourceIsReady(content =>
          pipe(
            getServices().database.writeRecord({ id, content }),
            TE.mapLeft(error => console.error(`Could not save document ${id} (${error.message})`))
          )()
        )
      )
    }
  ]
})
