import React from 'react'
import DockLayout from 'rc-dock'
import 'rc-dock/dist/rc-dock.css'
import { RecordTree } from './record-tree'

export const DockFrame = () => {
  window.electronAPI.test()
    .then((result: string) => {
      console.log('result', result)
    })

  const defaultLayout = {
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
