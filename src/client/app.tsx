import React from 'react'
import ReactDOM from 'react-dom'
import { DockFrame } from './dock-frame'

const App = () => (
  <div>
    <h1>Hello React</h1>
    <DockFrame/>
  </div>
)

ReactDOM.render(
  <React.StrictMode>
    <App/>
  </React.StrictMode>,
  document.getElementById('root')
)
