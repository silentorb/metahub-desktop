import { Option } from 'fp-ts/Option'
import { TabData } from 'rc-dock'
import { NavigationEvent, UiLocation } from '../navigation'

export const DefaultPanels = {
  structure: '~views/structure',
  workspace: '~views/workspace',
}

export type CreatePanel = (navigation: NavigationEvent) => Option<TabData>
