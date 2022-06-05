import { IJsonModel } from 'flexlayout-react'

export const defaultPanels = {
  root: '~panels/root',
  editor: '~panels/editor',
  left: '~panels/left',
  right: '~panels/right',
}

export const defaultLayout: IJsonModel = {
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
