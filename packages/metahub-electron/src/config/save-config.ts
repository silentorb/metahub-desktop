import { pipe } from 'fp-ts/function'
import { ensureDirectoryExists, writeFile } from '../io'
import * as E from 'fp-ts/Either'
import * as TE from 'fp-ts/TaskEither'
import { TaskEither } from 'fp-ts/TaskEither'
import path from 'path'
import { AppState } from './types'
import { getConfigElement, getConfigFilePath } from './utility'

export const saveConfig = (app: AppState) => (key: string, data: any): TaskEither<Error, void> =>
    pipe(
      key,
      getConfigElement(app.configElements),
      TE.fromEither,
      TE.chain(
        config => pipe(
          config,
          getConfigFilePath(app.directories),
          filePath => pipe(
            ensureDirectoryExists(path.dirname(filePath)),
            TE.chain(
              () => TE.fromEither(
                E.tryCatch(
                  () => JSON.stringify(data, undefined, 2),
                  reason => new Error(`${reason}`
                  )
                )
              )
            ),
            TE.chain(writeFile(filePath))
          )
        )
      )
    )
