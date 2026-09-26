import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { LabotoryApp } from './labotory/LabotoryApp.tsx'
import { AdminApp } from './admin/AdminApp.tsx'

const { pathname } = window.location
const isAdmin = pathname.startsWith('/admin')
const isDarkSite = pathname.startsWith('/new')

const page = isAdmin ? <AdminApp /> : isDarkSite ? <App /> : <LabotoryApp />

createRoot(document.getElementById('root')!).render(<StrictMode>{page}</StrictMode>)
