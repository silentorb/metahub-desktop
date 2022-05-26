import React, { useState } from 'react'
import { DockLayout, TabBase } from 'rc-dock'
import 'rc-dock/dist/rc-dock.css'
import { DropDirection, LayoutBase, LayoutData, TabData } from 'rc-dock/src/DockData'
import { CreatePanel, DefaultPanels } from './types'
import { fallbackPanel } from './panel-utility'
import { pipe } from 'fp-ts/function'
import * as O from 'fp-ts/lib/Option'

interface Props {
  createPanel: CreatePanel
}

const defaultLayout = (): LayoutBase => ({
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
)

export const DockFrame = (props: Props) => {
  const { createPanel } = props
  const [layout, setLayout] = useState<LayoutBase>(defaultLayout())
  const onLayoutChange = (newLayout: LayoutBase, currentTabId?: string, direction?: DropDirection) => {
    console.log(currentTabId, newLayout, direction)
    if (currentTabId === 'protect1' && direction === 'remove') {
      alert('removal of this tab is rejected')
    } else {
      setLayout(newLayout)
    }
  }

  const loadTab = ({ id }: TabBase): TabData => id
    ? pipe(
      createPanel(id),
      O.getOrElse(() => fallbackPanel(id))
    )
    : fallbackPanel(id)

  return (
    <DockLayout
      // layout={layout}
      defaultLayout={layout as any}
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
