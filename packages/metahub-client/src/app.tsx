import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import { DockFrame } from './dock-frame'
import './styles.css'

const App = () => {
  return (
    <div>
      <DockFrame/>
    </div>
  )
}

ReactDOM.render(
  <React.StrictMode>
    <App/>
  </React.StrictMode>,
  document.getElementById('root')
)
