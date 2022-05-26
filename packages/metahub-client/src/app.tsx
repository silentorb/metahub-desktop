import React from 'react'
import ReactDOM from 'react-dom'
import { DockFrame } from './dock-frame'
import './styles.css'
import { AppServices } from './types'
import { DatabaseContext } from './database'
import { NavigationContext, newNavigationProps } from './navigation'
import { builtinPanelCreators, routePanelCreation } from './panel-creation'

interface Props {
  services: AppServices
}

const App = (props: Props) => {
  const { database } = props.services
  const createPanel = routePanelCreation(builtinPanelCreators())

  return (
    <div>
      <DatabaseContext.Provider value={{ database }}>
        <NavigationContext.Provider value={newNavigationProps()}>
          <DockFrame createPanel={createPanel}/>
        </NavigationContext.Provider>
      </DatabaseContext.Provider>
    </div>
  )
}

export function startMetaHubClient(props: Props) {
  ReactDOM.render(
    <React.StrictMode>
      <App {...props}/>
    </React.StrictMode>,
    document.getElementById('root')
  )
}
