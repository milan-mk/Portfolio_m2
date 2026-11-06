import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './dark.css'
import { initTheme } from './utils/theme'
import App from './App.tsx'

initTheme()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
