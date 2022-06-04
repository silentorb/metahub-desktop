import React from 'react'
import { TabContentFactory } from './types'

export const commonPanel = { closable: true }

export const fallbackPanel: TabContentFactory = node => undefined //(<div>Empty</div>)
