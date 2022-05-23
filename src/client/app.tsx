import React from 'react'
import ReactDOM from 'react-dom'
import { DockFrame } from './dock-frame'
import './app.css'

const App = () => (
  <div>
    <DockFrame/>
  </div>
)

ReactDOM.render(
  <React.StrictMode>
    <App/>
  </React.StrictMode>,
  document.getElementById('root')
)
