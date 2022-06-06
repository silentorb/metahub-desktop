import { TaskEither } from 'fp-ts/TaskEither'

export type ConfigKeyType<T, K extends string> = <T>() => K

export interface TreeConfig {
  expandedFolders: string[]
}

export const configWorkspaceLayout: ConfigKeyType<any, 'workspace/layout'> = () =>
  'workspace/layout'

export const configWorkspaceTree: ConfigKeyType<TreeConfig, 'workspace/tree'> = () =>
  'workspace/tree'

export interface Application {
  loadConfig<T>(key: string): TaskEither<Error, T>

  saveConfig<T>(key: string, data: T): TaskEither<Error, void>
}
