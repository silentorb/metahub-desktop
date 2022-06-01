import React from 'react'
import ReactDOM from 'react-dom'
import { builtinPanelCreators, DockFrame, routePanelCreation } from './paneling'
import './styles.css'
import { AppServices } from './types'
import { NavigationContext, newNavigationProps } from './navigation'
import { RecoilRoot } from 'recoil'
import { setServices } from './api'

interface Props {
  services: AppServices
}

const App = (props: Props) => {
  const { application, database } = props.services
  setServices(props.services)
  const createPanel = routePanelCreation(builtinPanelCreators())

  return (
    <div>
      <RecoilRoot>
        <NavigationContext.Provider value={newNavigationProps()}>
          <DockFrame createPanel={createPanel}/>
        </NavigationContext.Provider>
      </RecoilRoot>
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
