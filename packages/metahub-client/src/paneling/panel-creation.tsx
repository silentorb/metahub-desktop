import { WorkspacePanel } from '../workspace'
import React from 'react'
import { none, some } from 'fp-ts/Option'
import { TabData } from 'rc-dock/src/DockData'
import * as A from 'fp-ts/lib/Array'
import { pipe } from 'fp-ts/function'
import { commonPanel } from './panel-utility'
import { CreatePanel, DefaultPanels } from './types'

export type PanelCreatorById = (panelId: string, creator: () => TabData) => CreatePanel
export const panelCreatorById: PanelCreatorById = (panelId, creator) => id =>
  id === panelId
    ? some({ id, ...creator() })
    : none

export const workspacePanelCreator = panelCreatorById(
  DefaultPanels.workspace,
  () => ({ ...commonPanel, title: 'Workspace', content: <WorkspacePanel/> })
)

export const documentPanelCreator: CreatePanel = id =>
  some({
    ...commonPanel,
    id,
    title: id,
    content: <div></div>,
  })

export const builtinPanelCreators = (): CreatePanel[] => [
  workspacePanelCreator,
  documentPanelCreator,
]

export type RoutePanelCreation = (creators: CreatePanel[]) => CreatePanel
export const routePanelCreation: RoutePanelCreation = creators => location =>
  pipe(
    creators,
    A.findFirstMap(c => c(location))
  )
