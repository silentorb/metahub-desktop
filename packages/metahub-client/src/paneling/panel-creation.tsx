import React from 'react'
import { WorkspacePanel } from '../workspace'
import { none, some } from 'fp-ts/Option'
import { TabData } from 'rc-dock'
import * as A from 'fp-ts/Array'
import { pipe } from 'fp-ts/function'
import { commonPanel } from './panel-utility'
import { CreatePanel, DefaultPanels } from './types'
import { MarkdownEditor } from '../markdown-editor/markdown-editor'

export type PanelCreatorById = (panelId: string, creator: () => TabData) => CreatePanel
export const panelCreatorById: PanelCreatorById = (panelId, creator) => navigation =>
  navigation.id === panelId
    ? some({ id: navigation.id, ...creator() })
    : none

export const workspacePanelCreator = panelCreatorById(
  DefaultPanels.workspace,
  () => ({ ...commonPanel, title: 'Workspace', content: <WorkspacePanel/> })
)

export const structurePanelCreator = panelCreatorById(
  DefaultPanels.structure,
  () => ({ ...commonPanel, title: 'Structure', content: <div/> })
)
export const documentPanelCreator: CreatePanel = navigation =>
  navigation.title
    ? some({
      ...commonPanel,
      id: navigation.id,
      title: navigation.title,
      content: <MarkdownEditor id={navigation.id}></MarkdownEditor>,
    })
    : none

export const builtinPanelCreators = (): CreatePanel[] => [
  workspacePanelCreator,
  structurePanelCreator,
  documentPanelCreator,
]

export type RoutePanelCreation = (creators: CreatePanel[]) => CreatePanel
export const routePanelCreation: RoutePanelCreation = creators => location =>
  pipe(
    creators,
    A.findFirstMap(c => c(location))
  )
