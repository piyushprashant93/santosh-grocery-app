import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { RoleProvider } from './layout/RoleProvider'
import { patchFetchForTokenExpiry } from './lib/fetchInterceptor'

patchFetchForTokenExpiry()

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <RoleProvider>
    <App />
  </RoleProvider>
)
