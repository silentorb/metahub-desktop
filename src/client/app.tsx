import React from 'react'
import ReactDOM from 'react-dom'

const App = () => (
  <div>Hello React</div>
)

ReactDOM.render(
  <React.StrictMode>
    <App/>
  </React.StrictMode>,
  document.getElementById('root')
)
