import { TaskEither } from 'fp-ts/TaskEither'
import { LayoutParent } from './workspace'

export type ConfigKeyType<T> = <T>() => string

export const workspaceLayout: ConfigKeyType<LayoutParent> = () =>
  'workspace/layout'

export interface Application {
  loadConfig<T>(key: string): TaskEither<Error, T>

  saveConfig<T>(key: string, data: T): TaskEither<Error, void>
}
