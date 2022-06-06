import React, { useState } from 'react'
import { TabContentFactoryMap } from './types'
import { navigationEvent } from '../navigation'
import { useEventListener } from 'happening-react'
import { configWorkspaceLayout } from '../config'
import { Actions, DockLocation, Layout, Model, TabNode } from 'flexlayout-react'
import 'flexlayout-react/style/light.css'
import { getTabContentFactory } from './panel-creation'
import { right } from 'fp-ts/Either'
import { markdownEditorKey } from '../markdown-editor'
import { DataResourceSetter, withOptionalLoading } from '../utility'
import { defaultLayout, defaultPanels } from './default-layout'
import * as O from 'fp-ts/Option'

interface Props {
  components: TabContentFactoryMap
  layout: any
  setLayout: DataResourceSetter<any>
}

export const DockFrame = withOptionalLoading(configWorkspaceLayout, 'layout', (props: Props) => {
  const { components, layout, setLayout } = props
  const initialLayout = O.getOrElse(() => defaultLayout)(layout)
  const [model, setModel] = useState(Model.fromJson(initialLayout))

  // useEffect(() => {
  //   console.log('layout', layout)
  //   ifDataResourceIsReady<IJsonModel>(rawLayout => {
  //     setModel(Model.fromJson(rawLayout))
  //   })(layout)
  // }, [layout])

  useEventListener(navigationEvent, navigation => {
    const tabInfo = {
      name: navigation.title || 'Bob',
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
    <Layout model={model} factory={factory} onModelChange={onChange}/>
  )
})
