import { atom } from 'recoil'
import { pipe } from 'fp-ts/function'
import * as E from 'fp-ts/Either'
import { DataDocument } from 'metahub-protocol'
import { newWorkspaceConfig, WorkspaceConfig } from 'metahub-common'
import { getServices } from '../api'

export const documentsState = atom<WorkspaceConfig>({
  key: 'documents',
  default: newWorkspaceConfig(),
  effects: [
    ({ setSelf }) => {
    pipe(
      getServices().application.loadConfig('workspace'),
      
    )
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
