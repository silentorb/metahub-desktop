import { TabData } from 'rc-dock'
import React from 'react'

export const commonPanel = { closable: true }

export const fallbackPanel = (id?: string): TabData => ({
    ...commonPanel,
    id,
    title: 'Unnamed',
    content: <div/>
  }
)
