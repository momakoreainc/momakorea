import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import type { Project } from '../types'
import { fetchAdminProjects, saveAdminProjects } from './api'

type ProjectListPageProps = {
  onLogout: () => void
}

export function ProjectListPage({ onLogout }: ProjectListPageProps) {
  const [projects, setProjects] = useState<Project[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    fetchAdminProjects()
      .then(setProjects)
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed to load'))
  }, [])

  async function persist(next: Project[]) {
    setProjects(next)
    setBusy(true)
    setError(null)
    try {
      await saveAdminProjects(next)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save')
    } finally {
      setBusy(false)
    }
  }

  function move(index: number, dir: -1 | 1) {
    if (!projects) return
    const target = index + dir
    if (target < 0 || target >= projects.length) return
    const next = [...projects]
    ;[next[index], next[target]] = [next[target], next[index]]
    persist(next)
  }

  function remove(id: string) {
    if (!projects) return
    if (!window.confirm('이 프로젝트를 삭제할까요?')) return
    persist(projects.filter((p) => p.id !== id))
  }

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <header className="flex items-center justify-between border-b border-neutral-200 bg-white px-6 py-4">
        <h1 className="text-base font-semibold text-neutral-900">MoMaKorea Admin — Projects</h1>
        <div className="flex items-center gap-4">
          <Link to="/projects/new" className="text-sm font-medium text-neutral-900 underline">
            + 새 프로젝트
          </Link>
          <button type="button" onClick={onLogout} className="text-sm text-neutral-500 hover:text-neutral-900">
            로그아웃
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-10">
        {error && <p className="mb-4 rounded bg-red-50 p-3 text-sm text-red-600">{error}</p>}
        {!projects && <p className="text-sm text-neutral-500">불러오는 중...</p>}
        {projects && projects.length === 0 && (
          <p className="text-sm text-neutral-400">아직 프로젝트가 없어요.</p>
        )}
        {projects && (
          <ul className="flex flex-col gap-3">
            {projects.map((project, i) => (
              <li
                key={project.id}
                className="flex items-center gap-4 rounded-md border border-neutral-200 bg-white p-4"
              >
                <img src={project.cover} alt="" className="h-16 w-24 rounded object-cover" />
                <div className="flex-1">
                  <p className="font-medium text-neutral-900">{project.title}</p>
                  <p className="text-sm text-neutral-500">
                    {project.category} · {project.location} · {project.year}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => move(i, -1)}
                    disabled={i === 0 || busy}
                    className="rounded border border-neutral-300 px-2 py-1 text-xs disabled:opacity-30"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => move(i, 1)}
                    disabled={i === projects.length - 1 || busy}
                    className="rounded border border-neutral-300 px-2 py-1 text-xs disabled:opacity-30"
                  >
                    ↓
                  </button>
                  <Link
                    to={`/projects/${project.id}`}
                    className="rounded border border-neutral-300 px-3 py-1 text-xs text-neutral-700"
                  >
                    편집
                  </Link>
                  <button
                    type="button"
                    onClick={() => remove(project.id)}
                    className="rounded border border-red-300 px-3 py-1 text-xs text-red-600"
                  >
                    삭제
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  )
}
