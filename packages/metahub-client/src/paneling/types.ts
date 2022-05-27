import { Option } from 'fp-ts/Option'
import { TabData } from 'rc-dock/src/DockData'
import { UiLocation } from '../navigation'

export const DefaultPanels = {
  structure: '~views/structure',
  workspace: '~views/workspace',
}

export type CreatePanel = (location: UiLocation) => Option<TabData>
