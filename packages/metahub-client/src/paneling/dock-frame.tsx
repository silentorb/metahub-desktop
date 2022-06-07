import React, { useState } from 'react'
import { TabContentFactoryMap } from './types'
import { navigationEvent } from '../navigation'
import { LayoutState } from 'metahub-common'
import { useEventListener } from 'happening-react'
import { configWorkspaceLayoutState } from '../config'
import { Actions, DockLocation, Layout, Model, TabNode } from 'flexlayout-react'
import 'flexlayout-react/style/light.css'
import { getTabContentFactory } from './panel-creation'
import { right } from 'fp-ts/Either'
import { markdownEditorKey } from '../markdown-editor'
import { DataResourceSetter, withOptionalLoading } from '../utility'
import { defaultLayout, defaultPanels } from './default-layout'

interface Props {
  components: TabContentFactoryMap
  layoutState: LayoutState
  setLayoutState: DataResourceSetter<LayoutState>
}

const defaultLayoutState = (): LayoutState => ({
  layout: defaultLayout,
  tabPriority: [],
})

export const DockFrame = withOptionalLoading(configWorkspaceLayoutState, 'layoutState', defaultLayoutState,
  (props: Props) => {
    const { components, layoutState, setLayoutState } = props
    const { layout } = layoutState
    const [model, setModel] = useState(() => Model.fromJson(layout))

    // useEffect(() => {
    //   console.log('layout', layout)
    //   ifDataResourceIsReady<IJsonModel>(rawLayout => {
    //     setModel(Model.fromJson(rawLayout))
    //   })(layout)
    // }, [layout])

    useEventListener(navigationEvent, navigation => {
      const { id } = navigation
      const existing = model.getNodeById(id)
      if (existing) {
        model.doAction(Actions.selectTab(id))
      } else {
        const tabInfo = {
          name: navigation.title,
          id,
          component: markdownEditorKey,
        }
        const action = Actions.addNode(tabInfo, defaultPanels.editor, DockLocation.CENTER, -1)
        model.doAction(action)
      }
    })

    const onChange = (model: Model) => {
      const nextState: LayoutState = {
        ...layoutState,
        layout: model.toJson(),
      }
      setLayoutState(right(nextState))
    }

    const factory: (node: TabNode) => React.ReactNode = node => {
      const createTab = getTabContentFactory(components)(node)
      return createTab(node)
    }

    return (
      <Layout model={model} factory={factory} onModelChange={onChange}/>
    )
  })
