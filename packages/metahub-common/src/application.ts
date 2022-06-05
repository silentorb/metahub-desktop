import { TaskEither } from 'fp-ts/TaskEither'

export type ConfigKeyType<T, K extends string> = <T>() => K

export const workspaceLayout: ConfigKeyType<any, 'workspace/layout'> = () =>
  'workspace/layout'

export interface Application {
  loadConfig<T>(key: string): TaskEither<Error, T>

  saveConfig<T>(key: string, data: T): TaskEither<Error, void>
}
