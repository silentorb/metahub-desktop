import { getConfigElement, getConfigFilePath } from './utility'
import { flow, pipe } from 'fp-ts/function'
import { readValidatedJsonFile } from '../io'
import * as TE from 'fp-ts/TaskEither'
import { AppState } from './types'

export const loadConfig = (app: AppState) =>
  flow(
    getConfigElement(app.configElements),
    TE.fromEither,
    TE.chain(
      config => pipe(
        config,
        getConfigFilePath(app.directories),
        readValidatedJsonFile(config.validationType),
      )
    )
  )
