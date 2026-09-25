import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { LabotoryApp } from './labotory/LabotoryApp.tsx'

const isLabotory = window.location.pathname.startsWith('/new2')

createRoot(document.getElementById('root')!).render(
  <StrictMode>{isLabotory ? <LabotoryApp /> : <App />}</StrictMode>,
)
