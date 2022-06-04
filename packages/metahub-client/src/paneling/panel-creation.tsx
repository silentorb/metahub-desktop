import React from 'react'
import { WorkspacePanel } from '../workspace'
import { fallbackPanel } from './panel-utility'
import { TabContentFactory, TabContentFactoryMap } from './types'
import { MarkdownEditor, markdownEditorKey } from '../markdown-editor'
import { TabNode } from 'flexlayout-react'


export const tabComponentMap: TabContentFactoryMap = {
  'workspace': () => <WorkspacePanel/>,
  [markdownEditorKey]: tab => <MarkdownEditor id={tab.getId()}></MarkdownEditor>,
  'structure': () => <div/>,
}

export const getTabContentFactory = (components: TabContentFactoryMap) => (tab: TabNode): TabContentFactory => {
  const component = tab.getComponent()
  return component ? components[component] || fallbackPanel : fallbackPanel
}
