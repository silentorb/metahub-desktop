import { CWorkspaceConfig, WorkspaceConfig } from 'metahub-common'
import { getWorkspaceConfigPath } from './utility'
import { pipe } from 'fp-ts/function'
import { readValidatedJsonFile } from '../io'
import { TaskEither } from 'fp-ts/TaskEither'

export const loadWorkspaceConfig = (root: string): TaskEither<Error, WorkspaceConfig> =>
  pipe(
    root,
    getWorkspaceConfigPath,
    readValidatedJsonFile<WorkspaceConfig>(CWorkspaceConfig),
  )
