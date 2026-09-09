import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { RoleProvider } from './layout/RoleProvider'
import { patchFetchForTokenExpiry } from './lib/fetchInterceptor'

import { ErrorBoundary } from './components/ErrorBoundary'

patchFetchForTokenExpiry()

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <ErrorBoundary>
    <RoleProvider>
      <App />
    </RoleProvider>
  </ErrorBoundary>
)
