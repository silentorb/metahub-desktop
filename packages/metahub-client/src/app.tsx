import React from 'react'
import ReactDOM from 'react-dom'
import { DockFrame, tabComponentMap } from './paneling'
import './styles.css'
import { NavigationContext, NavigationManager, newNavigationProps } from './navigation'
import { RecoilRoot } from 'recoil'
import { setServices } from './api'
import Modal from 'react-modal'
import { AppServices } from 'metahub-common'

Modal.setAppElement('#root')

interface Props {
  services: AppServices
}

const App = (props: Props) => {
  const { config, database } = props.services
  setServices(props.services)

  return (
    <div>
      <RecoilRoot>
        <NavigationContext.Provider value={newNavigationProps()}>
          <DockFrame components={tabComponentMap}/>
        </NavigationContext.Provider>
        <NavigationManager/>
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
