import React from 'react'
import ReactDOM from 'react-dom'
import { DockFrame } from './dock-frame'
import './styles.css'
import { getDatabase } from './api'

const App = () => {
  const db = getDatabase()
  db.getAllRecords()
    .then(result => {
      console.log('records', result)
    })

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
