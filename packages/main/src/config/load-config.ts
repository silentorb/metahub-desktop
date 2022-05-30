import { CWorkspaceConfig, newWorkspaceConfig, WorkspaceConfig } from 'metahub-common'
import { getWorkspaceConfigPath } from './utility'
import { flow } from 'fp-ts/function'
import { readValidatedJsonFile } from '../io'
import * as TE from 'fp-ts/TaskEither'
import { TaskEither } from 'fp-ts/TaskEither'
import * as E from 'fp-ts/Either'
import * as T from 'fp-ts/Task'

export const loadWorkspaceConfig: (root: string) => TaskEither<Error, WorkspaceConfig> =
  flow(
    getWorkspaceConfigPath,
    readValidatedJsonFile<WorkspaceConfig>(CWorkspaceConfig),
  )

export const loadOrNewWorkspaceConfig: (root: string) => TaskEither<Error, WorkspaceConfig> =
  flow(
    loadWorkspaceConfig,
    TE.getOrElse(() => async () => newWorkspaceConfig()),
    T.map(w => E.right(w))
  )
