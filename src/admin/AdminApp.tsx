import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAdminAuth } from './useAdminAuth'
import { LoginPage } from './LoginPage'
import { ProjectListPage } from './ProjectListPage'
import { ProjectEditPage } from './ProjectEditPage'

export function AdminApp() {
  const { authorized, login, logout } = useAdminAuth()

  if (authorized === null) {
    return <p className="p-10 text-sm text-neutral-500">불러오는 중...</p>
  }

  return (
    <BrowserRouter basename="/admin">
      {!authorized ? (
        <LoginPage onLogin={login} />
      ) : (
        <Routes>
          <Route path="/" element={<ProjectListPage onLogout={logout} />} />
          <Route path="/projects/:id" element={<ProjectEditPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      )}
    </BrowserRouter>
  )
}
