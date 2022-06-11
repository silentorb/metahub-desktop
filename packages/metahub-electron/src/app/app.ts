import { app } from 'electron'
import { newApi } from './api'
import { loadPackageInfo } from './packaging'
import { createWindow } from './window'
import { newDatabaseStub, PackageInfo, StorageLayer } from 'metahub-common'
import { AppDirectories, AppDirectory, AppState, getConfigDirectory } from '../config'
import { newMarkdownDatabase, resolveDirectoryPath, sanitizeDirectoryPath, SanitizedPath } from '../markdown-db'
import { AppServices } from 'metahub-common'
import { newConfigStorage, newConfigStub } from './config'
import { configElements } from '../config/elements'
import * as TE from 'fp-ts/TaskEither'
import { pipe } from 'fp-ts/function'

export const newServices = (sourcePath: SanitizedPath) => (packageInfo: PackageInfo): AppServices => {
  const databaseRoot = resolveDirectoryPath(sourcePath, packageInfo.root)
  const directories: AppDirectories = {
    [AppDirectory.projectRoot]: sourcePath,
    [StorageLayer.projectMeta]: getConfigDirectory(sourcePath),
    [StorageLayer.globalMeta]: getConfigDirectory(sanitizeDirectoryPath(process.cwd())),
  }
  const state: AppState = {
    directories,
    configElements,
  }

  return {
    config: newConfigStorage(state),
    database: newMarkdownDatabase({ root: databaseRoot }),
    sendMessage: () => () => {},
  }
}

export function newEmptyServices(): AppServices {

  return {
    config: newConfigStub(),
    database: newDatabaseStub(),
    sendMessage: () => () => {},
  }
}

export function newApp(sourcePath: SanitizedPath) {
  app.whenReady().then(async () => {
    const services = await pipe(
      loadPackageInfo(sourcePath),
      TE.match(
        newEmptyServices,
        newServices(sourcePath)
      )
    )()

    newApi(() => services)
    await createWindow(services.sendMessage)
  })

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
  })
}
