import { pipe } from 'fp-ts/function'
import { getWorkspaceConfigPath } from './utility'
import { writeFile } from '../io'
import { WorkspaceConfig } from 'metahub-common'
import { Option } from 'fp-ts/Option'
import * as E from 'fp-ts/Either'
import * as TE from 'fp-ts/TaskEither'
import { TaskEither } from 'fp-ts/TaskEither'

export const saveWorkspaceConfig = (root: string) => (config: WorkspaceConfig): TaskEither<Error, void> =>
  pipe(
    TE.fromEither(
      E.tryCatch(
        () => JSON.stringify(config),
        reason => new Error(`${reason}`
        )
      )
    ),
    TE.chain(content => writeFile(getWorkspaceConfigPath(root), content))
  )
