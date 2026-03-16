import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { RegistrationFlowProvider } from './context/RegistrationFlowContext'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RegistrationFlowProvider>
      <App />
    </RegistrationFlowProvider>
  </React.StrictMode>,
)
