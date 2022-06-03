import React, { useEffect, useState } from 'react'
import { BoxBase, DockLayout, DropDirection, LayoutBase, PanelBase, TabBase, TabData } from 'rc-dock'
import 'rc-dock/dist/rc-dock.css'
import { fallbackPanel } from './panel-utility'
import { pipe } from 'fp-ts/function'
import * as O from 'fp-ts/Option'
import { some } from 'fp-ts/Option'
import { CreatePanel, DefaultPanels } from './types'
import { NavigationEvent, navigationEvent, noneLocation } from '../navigation'
import { useEventListener } from 'happening-react'
import * as Algorithm from 'rc-dock/lib/Algorithm'
import { configWorkspaceLayout } from '../config'
import { LayoutParent, TabContainer } from 'metahub-common'
import { useRecoilState } from 'recoil'
import { BoxData, LayoutData } from 'rc-dock/src/DockData'
import * as E from 'fp-ts/Either'
import { ifDataResourceIsReady } from '../api'

interface Props {
  createPanel: CreatePanel
}

const defaultPanels = {
  root: '~panels/root',
  editor: '~panels/editor',
  left: '~panels/left',
  right: '~panels/right',
}

const defaultLayout: LayoutParent = {
  id: defaultPanels.root,
  mode: 'horizontal',
  children:
    [
      {
        id: defaultPanels.left,
        mode: 'vertical',
        size: 200,
        tabs: [
          { id: DefaultPanels.workspace }
        ]
      },
      {
        id: defaultPanels.editor,
        panelLock: {},
        // panelLock: {widthFlex: 100000},
        mode: 'vertical',
        size: 1000,
        tabs: []
      } as any,
      {
        id: defaultPanels.right,
        mode: 'vertical',
        size: 200,
        tabs: [
          { id: DefaultPanels.structure }
        ]
      }
    ]
}

const wrappedDefaultLayout: LayoutBase = {
  dockbox: defaultLayout
}

const createPanelTab = (createPanel: CreatePanel, navigation: NavigationEvent) =>
  pipe(
    createPanel(navigation),
    O.getOrElse(() => fallbackPanel(navigation.id))
  )

export function simplifyTabContainer(box: PanelBase): TabContainer {
  const { id, size, activeId } = box
  const tabs = box.tabs
    .filter(box => box.id)
    .map(box => ({ id: box.id! }))

  return { id, size, tabs, activeId }
}

export function simplifyLayoutParent(box: BoxBase): LayoutParent {
  const { id, size, mode } = box
  const children = box.children.map(child => (
      'children' in child
        ? simplifyLayoutParent(child)
        : simplifyTabContainer(child)
    )
  )

  return { id, mode, size, children }
}

export const applyLayoutChanges = (createPanel: CreatePanel) => (latest: BoxData, layout: LayoutData): LayoutData => {
  let result = layout
  for (const child of latest.children) {
    if ('tabs' in child && child.id) {
      const mirror = Algorithm.find(layout, child.id)
      if (mirror && 'tabs' in mirror) {
        for (const tab of child.tabs) {
          if (tab.id && !mirror.tabs.some(t => t.id === tab.id)) {
            const newTab =  createPanelTab(createPanel, { id: tab.id })
            result = Algorithm.addTabToPanel(result, newTab, mirror)
          }
        }
      }
    }
  }

  return result
}

export const DockFrame = (props: Props) => {
  const { createPanel } = props
  const [layout, setLayout] = useRecoilState(configWorkspaceLayout)
  const [internalLayout, setInternalLayout] = useState<LayoutBase>(wrappedDefaultLayout)

  const loadTab = (tab: TabBase | TabData): TabData =>
    'content' in tab
      ? tab
      : createPanelTab(createPanel, tab.id ? tab as any : { id: noneLocation })

  useEffect(() => {
    console.log('layout', layout)
    console.log('internalLayout', internalLayout)
    ifDataResourceIsReady(layout, rawLayout => {
      const nextLayout = applyLayoutChanges(createPanel)(rawLayout as BoxData, internalLayout as LayoutData)
      if (nextLayout != internalLayout) {
        setInternalLayout(nextLayout)
      }
    })
  }, [layout])

  useEventListener(navigationEvent, navigation => {
    const tab = loadTab(navigation)
    const original = internalLayout as LayoutData
    const panel = Algorithm.find(original, defaultPanels.editor)
    const nextInternalLayout = Algorithm.addTabToPanel(original, tab, panel as any)
    setInternalLayout(nextInternalLayout)
    const nextLayout = simplifyLayoutParent(nextInternalLayout.dockbox)
    setLayout(some(nextLayout) as any)
  })

  const onLayoutChange = (newLayout: LayoutBase, currentTabId?: string, direction?: DropDirection) => {
    console.log(currentTabId, newLayout, direction)
    if (currentTabId === 'protect1' && direction === 'remove') {
      alert('removal of this tab is rejected')
    } else {
      setInternalLayout(newLayout)
      const simpleNewLayout = O.getOrElse(() => defaultLayout)(layout as any)
      setLayout(some(simpleNewLayout) as any)
    }
  }

  return (
    <DockLayout
      layout={internalLayout}
      defaultLayout={wrappedDefaultLayout as any}
      loadTab={loadTab}
      onLayoutChange={onLayoutChange}
      style={{
        position: 'absolute',
        left: 10,
        top: 10,
        right: 10,
        bottom: 10,
      }}
    />
  )
}
