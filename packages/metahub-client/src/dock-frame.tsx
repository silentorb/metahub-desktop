import React from 'react'
import { DockLayout, LayoutData } from 'rc-dock'
import 'rc-dock/dist/rc-dock.css'
import { RecordTree } from './record-tree'

export const DockFrame = () => {
  const defaultLayout: LayoutData = {
    dockbox: {
      mode: 'horizontal',
      children: [
        {
          tabs: [
            { id: 'tab1', title: 'tab1', content: <RecordTree/> }
          ]
        }
      ]
    }
  }

  return (
    <DockLayout
      defaultLayout={defaultLayout}
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
