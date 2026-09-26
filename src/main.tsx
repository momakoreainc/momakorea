import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { LabotoryApp } from './labotory/LabotoryApp.tsx'
import { AdminApp } from './admin/AdminApp.tsx'

const { pathname } = window.location
const isLabotory = pathname.startsWith('/new2')
const isAdmin = pathname.startsWith('/admin')

const page = isAdmin ? <AdminApp /> : isLabotory ? <LabotoryApp /> : <App />

createRoot(document.getElementById('root')!).render(<StrictMode>{page}</StrictMode>)
