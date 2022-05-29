import React from 'react'
import ReactDOM from 'react-dom'
import { builtinPanelCreators, DockFrame, routePanelCreation } from './paneling'
import './styles.css'
import { AppServices } from './types'
import { DatabaseContext, setStaticDatabase } from './data'
import { NavigationContext, newNavigationProps } from './navigation'
import { RecoilRoot } from 'recoil'

interface Props {
  services: AppServices
}

const App = (props: Props) => {
  const { database } = props.services
  setStaticDatabase(database)
  const createPanel = routePanelCreation(builtinPanelCreators())

  return (
    <div>
      <RecoilRoot>
        <DatabaseContext.Provider value={{ database }}>
          <NavigationContext.Provider value={newNavigationProps()}>
            <DockFrame createPanel={createPanel}/>
          </NavigationContext.Provider>
        </DatabaseContext.Provider>
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
