import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ErrorBoundary } from './components/ErrorBoundary'
import { applyStoredPrefsToDocument } from './bootstrapPrefs'
import './index.css'
import './i18n'
import App from './App.tsx'

applyStoredPrefsToDocument()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
