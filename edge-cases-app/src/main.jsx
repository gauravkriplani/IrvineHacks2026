import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
// Import registry so window.__AOM__ becomes globally available during dev
import '../../aom-wrappers'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
