import { CPackageInfo, PackageInfo } from 'metahub-common'
import { TaskEither } from 'fp-ts/TaskEither'
import * as TE from 'fp-ts/TaskEither'
import { pipe } from 'fp-ts/function'
import * as path from 'path'
import { readValidatedJsonFile } from '../io'
import { joinPaths } from '../markdown-db'

export const packageInfoFromDirectoryPath = (directoryPath: string): PackageInfo => {
  const id = path.basename(directoryPath)
  return {
    id,
    title: id,
    root: '.'
  }
}

// If no package file is found, infer basic package settings.
// If an invalid package file is found, return an error.
export const loadPackageInfo = (directoryPath: string): TaskEither<Error, PackageInfo> =>
  pipe(
    joinPaths(directoryPath, 'metahub.json'),
    readValidatedJsonFile(CPackageInfo),
    TE.orElse(error => error.name === 'ENOENT'
      ? TE.right(packageInfoFromDirectoryPath(directoryPath))
      : TE.left(error)
    )
  )
