import { configWorkspaceLayout, stateWorkspaceLayout, stateWorkspaceTree } from 'metahub-common'
import { ConfigElementMap } from './types'

export const configElements: ConfigElementMap = Object.fromEntries(
  [
    stateWorkspaceLayout,
    stateWorkspaceTree,
    configWorkspaceLayout,
  ]
    .map(c => [c.key, c])
)
