import { TabNode } from 'flexlayout-react'
import React from 'react'

export const DefaultPanels = {
  structure: '~views/structure',
  workspace: '~views/workspace',
}

export type TabContentFactory = (node: TabNode) => React.ReactNode

export type TabContentFactoryMap = { [key: string]: TabContentFactory }
