import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/styles/theme.css'
import Explainer from './Explainer'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Explainer />
  </StrictMode>,
)
