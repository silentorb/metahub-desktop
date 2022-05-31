import { pipe } from 'fp-ts/function'
import { ensureDirectoryExists, writeFile } from '../io'
import * as E from 'fp-ts/Either'
import * as TE from 'fp-ts/TaskEither'
import { TaskEither } from 'fp-ts/TaskEither'
import path from 'path'

export const saveConfig = (filePath: string) => (config: any): TaskEither<Error, void> =>
  pipe(
    ensureDirectoryExists(path.dirname(filePath)),
    TE.chain(
      () => TE.fromEither(
        E.tryCatch(
          () => JSON.stringify(config, undefined, 2),
          reason => new Error(`${reason}`
          )
        )
      )
    ),
    TE.chain(writeFile(filePath))
  )
