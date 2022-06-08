import { app } from 'electron'
import { newApi } from './api'
import { loadPackageInfo } from './packaging'
import { createWindow } from './window'
import { PackageInfo, StorageLayer } from 'metahub-common'
import { AppDirectories, AppDirectory, AppState, getConfigDirectory } from '../config'
import { newMarkdownDatabase, resolveDirectoryPath, sanitizeDirectoryPath, SanitizedPath } from '../markdown-db'
import { AppServices } from 'metahub-client'
import { newConfigStorage } from './config'
import { configElements } from '../config/elements'

export function newServices(sourcePath: SanitizedPath, packageInfo: PackageInfo): AppServices {
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
    database: newMarkdownDatabase({ root: databaseRoot })
  }
}

export function newApp(sourcePath: SanitizedPath) {
  app.whenReady().then(async () => {
    const packageInfo = await loadPackageInfo(sourcePath)()
    const services = newServices(sourcePath, packageInfo)

    newApi(() => services)
    await createWindow()
  })

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
  })
}
