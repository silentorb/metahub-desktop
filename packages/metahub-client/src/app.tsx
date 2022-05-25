import React from 'react'
import ReactDOM from 'react-dom'
import { DockFrame } from './dock-frame'
import './styles.css'
import { AppServices } from './types'
import { DatabaseContext } from './contexts'

interface Props {
  services: AppServices
}

const App = (props: Props) => {
  const { database } = props.services
  return (
    <div>
      <DatabaseContext.Provider value={{ database }}>
        <DockFrame/>
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
