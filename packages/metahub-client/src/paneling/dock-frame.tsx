import React, { useEffect, useState } from 'react'
import { TabContentFactoryMap } from './types'
import { navigationEvent } from '../navigation'
import { useEventListener } from 'happening-react'
import { configWorkspaceLayout } from '../config'
import { useRecoilState } from 'recoil'
import { ifDataResourceIsReady } from '../api'
import { Actions, DockLocation, Layout, Model } from 'flexlayout-react'
import { TabNode } from 'flexlayout-react/declarations/model/TabNode'
import { IJsonModel } from 'flexlayout-react/src/model/IJsonModel'
import 'flexlayout-react/style/light.css'
import { getTabContentFactory } from './panel-creation'
import { right } from 'fp-ts/Either'
import { markdownEditorKey } from '../markdown-editor/markdown-editor'

interface Props {
  components: TabContentFactoryMap
}

const defaultPanels = {
  root: '~panels/root',
  editor: '~panels/editor',
  left: '~panels/left',
  right: '~panels/right',
}

const defaultLayout: IJsonModel = {
  global: {
    tabSetEnableDeleteWhenEmpty: false,
  },
  borders: [],
  layout: {
    type: 'row',
    id: defaultPanels.root,
    weight: 100,
    children: [
      {
        type: 'tabset',
        id: defaultPanels.left,
        weight: 25,
        children: [
          {
            type: 'tab',
            id: '~panels/workspace',
            name: 'Workspace',
            component: 'workspace',
            enableClose: false,
          }
        ]
      },
      {
        type: 'tabset',
        id: defaultPanels.editor,
        weight: 50,
        children: []
      },
      {
        type: 'tabset',
        id: defaultPanels.right,
        weight: 25,
        children: [
          {
            type: 'tab',
            id: '~panels/structure',
            name: 'Structure',
            component: 'structure',
            enableClose: false,
          }
        ]
      }
    ]
  }
}

export const DockFrame = (props: Props) => {
  const { components } = props
  const [layout, setLayout] = useRecoilState(configWorkspaceLayout)
  const [model, setModel] = useState(Model.fromJson(defaultLayout))

  useEffect(() => {
    console.log('layout', layout)
    ifDataResourceIsReady<IJsonModel>(rawLayout => {
      setModel(Model.fromJson(rawLayout))
    })(layout)
  }, [layout])

  useEventListener(navigationEvent, navigation => {
    const tabInfo = {
      name: navigation.title,
      id: navigation.id,
      component: markdownEditorKey,
    }
    const action = Actions.addNode(tabInfo, defaultPanels.editor, DockLocation.CENTER, -1)
    model.doAction(action)
  })

  const onChange = (model: Model) => {
    setLayout(right(model.toJson()))
  }

  const factory: (node: TabNode) => React.ReactNode = node => {
    const createTab = getTabContentFactory(components)(node)
    return createTab(node)
  }
  return (
    <Layout model={model} factory={factory} onModelChange={onChange}>

    </Layout>
  )
}
