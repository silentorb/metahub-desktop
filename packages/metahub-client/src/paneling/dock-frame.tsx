import React, { useState } from 'react'
import { DockLayout, TabBase } from 'rc-dock'
import 'rc-dock/dist/rc-dock.css'
import { DropDirection, LayoutBase, TabData } from 'rc-dock/src/DockData'
import { fallbackPanel } from './panel-utility'
import { pipe } from 'fp-ts/function'
import * as O from 'fp-ts/lib/Option'
import { CreatePanel, DefaultPanels } from './types'
import { navigationEvent, noneLocation, UiLocation } from '../navigation'
import { useEventListener } from 'happening-react'

// const Algorithm = require('rc-dock/lib/Algorithm')
import * as Algorithm from 'rc-dock/lib/Algorithm'

interface Props {
  createPanel: CreatePanel
}

const defaultLayout: LayoutBase = {
  dockbox: {
    mode: 'horizontal',
    children:
      [
        {
          mode: 'vertical',
          size: 200,
          tabs: [
            { id: DefaultPanels.workspace }
          ]
        },
        {
          id: '~editor',
          panelLock: {},
          // panelLock: {widthFlex: 100000},
          mode: 'vertical',
          size: 1000,
          tabs: []
        } as any,
        {
          mode: 'vertical',
          size: 200,
          tabs: [
            { id: DefaultPanels.structure }
          ]
        }
      ]
  }
}

const createPanelTab = (createPanel: CreatePanel, location: UiLocation) =>
  pipe(
    createPanel(location as UiLocation),
    O.getOrElse(() => fallbackPanel(location))
  )

export const DockFrame = (props: Props) => {
  const { createPanel } = props
  const [layout, setLayout] = useState<LayoutBase>(defaultLayout)

  const loadTab = (tab: TabBase): TabData => {
    const [type, id] = tab.id ? tab.id.split('@~@') : []
    const location = { type, id }
    return createPanelTab(createPanel, tab.id || noneLocation)
  }

  useEventListener(navigationEvent, location => {
    // if (location.type === 'document') {
    const tab = loadTab({ id: location })
    const panel = layout.dockbox.children[1]
    const nextLayout = Algorithm.addTabToPanel(layout as any, tab, panel as any)
    setLayout(nextLayout)
    // }
  })

  const onLayoutChange = (newLayout: LayoutBase, currentTabId?: string, direction?: DropDirection) => {
    console.log(currentTabId, newLayout, direction)
    if (currentTabId === 'protect1' && direction === 'remove') {
      alert('removal of this tab is rejected')
    } else {
      setLayout(newLayout)
    }
  }

  return (
    <DockLayout
      layout={layout}
      defaultLayout={defaultLayout as any}
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
