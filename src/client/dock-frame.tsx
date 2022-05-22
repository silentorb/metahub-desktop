import React from 'react'
import DockLayout from 'rc-dock'
import 'rc-dock/dist/rc-dock.css'

export const DockFrame = () => {
  const defaultLayout = {
    dockbox: {
      mode: 'horizontal',
      children: [
        {
          tabs: [
            { id: 'tab1', title: 'tab1', content: <div>Hello World</div> }
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
