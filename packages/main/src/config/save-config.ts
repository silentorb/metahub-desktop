import { pipe } from 'fp-ts/function'
import { getWorkspaceConfigPath } from './utility'
import { readValidatedJsonFile, writeFile } from '../io'
import { WorkspaceConfig } from 'metahub-common'
import { Option } from 'fp-ts/Option'
import * as TE from 'fp-ts/TaskEither'
import * as E from 'fp-ts/Either'

export const saveWorkspaceConfig = (root: string) => (config: WorkspaceConfig): Option<Error> =>
  pipe(
    E.tryCatch(
      () => JSON.stringify(config),
      reason => new Error(`${reason}`
      ),
      E.map(content => writeFile(getWorkspaceConfigPath(root), content))
    )
