import { DocumentDatabase } from 'metahub-protocol'
import { TabData } from 'rc-dock/src/DockData'
import { Option } from 'fp-ts/Option'

export const DefaultPanels = {
  structure: 'structure',
  workspace: 'workspace',
}

export interface AppServices {
  database: DocumentDatabase
}

export type CreatePanel = (id: string) => Option<TabData>
