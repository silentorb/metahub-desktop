import { RecordTree } from './record-tree'
import React from 'react'
import { CreatePanel, DefaultPanels } from './types'
import { none, some } from 'fp-ts/Option'
import { TabData } from 'rc-dock/src/DockData'
import * as A from 'fp-ts/lib/Array'
import { pipe } from 'fp-ts/function'
import { commonPanel } from './panel-utility'

export type PanelCreatorById = (panelId: string, creator: () => TabData) => CreatePanel
export const panelCreatorById: PanelCreatorById = (panelId, creator) => id =>
  id === panelId
    ? some(creator())
    : none

export const builtinPanelCreators = (): CreatePanel[] => [
  panelCreatorById(
    DefaultPanels.workspace,
    () => ({ ...commonPanel, title: 'Workspace', content: <RecordTree/> })
  )
]

export type RoutePanelCreation = (creators: CreatePanel[]) => CreatePanel
export const routePanelCreation: RoutePanelCreation = creators => id =>
  pipe(
    creators,
    A.findFirstMap(c => c(id))
  )
