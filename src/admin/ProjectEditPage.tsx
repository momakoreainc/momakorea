import { useEffect, useState, type ReactNode } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import type { Project, ProjectCategory, ProjectSection } from '../types'
import { CATEGORIES } from '../lib/categories'
import { fetchAdminProjects, saveAdminProjects, uploadImage, slugify } from './api'

const EMPTY_PROJECT: Project = {
  id: '',
  title: '',
  category: CATEGORIES[0],
  location: '',
  year: String(new Date().getFullYear()),
  cover: '',
  summary: '',
  sections: [],
}

const inputClass =
  'mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none'

export function ProjectEditPage() {
  const { id } = useParams()
  const isNew = id === 'new'
  const navigate = useNavigate()
  const [allProjects, setAllProjects] = useState<Project[] | null>(null)
  const [project, setProject] = useState<Project>(EMPTY_PROJECT)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [uploadingCover, setUploadingCover] = useState(false)

  useEffect(() => {
    fetchAdminProjects()
      .then((all) => {
        setAllProjects(all)
        if (!isNew) {
          const found = all.find((p) => p.id === id)
          if (found) setProject(found)
        }
      })
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed to load'))
  }, [id, isNew])

  function update<K extends keyof Project>(key: K, value: Project[K]) {
    setProject((p) => ({ ...p, [key]: value }))
  }

  function updateSection(index: number, patch: Partial<ProjectSection>) {
    setProject((p) => ({
      ...p,
      sections: p.sections.map((s, i) => (i === index ? { ...s, ...patch } : s)),
    }))
  }

  function addSection() {
    setProject((p) => ({ ...p, sections: [...p.sections, { heading: '', body: '', image: '' }] }))
  }

  function removeSection(index: number) {
    setProject((p) => ({ ...p, sections: p.sections.filter((_, i) => i !== index) }))
  }

  function moveSection(index: number, dir: -1 | 1) {
    setProject((p) => {
      const target = index + dir
      if (target < 0 || target >= p.sections.length) return p
      const next = [...p.sections]
      ;[next[index], next[target]] = [next[target], next[index]]
      return { ...p, sections: next }
    })
  }

  async function handleCoverUpload(file: File) {
    setUploadingCover(true)
    setError(null)
    try {
      update('cover', await uploadImage(file))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload failed')
    } finally {
      setUploadingCover(false)
    }
  }

  async function handleSectionImageUpload(index: number, file: File) {
    setError(null)
    try {
      updateSection(index, { image: await uploadImage(file) })
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload failed')
    }
  }

  async function handleSave() {
    if (!allProjects) return
    setError(null)

    let finalProject = project
    if (isNew) {
      const newId = slugify(project.title) || `project-${Date.now()}`
      if (allProjects.some((p) => p.id === newId)) {
        setError('같은 주소(id)를 가진 프로젝트가 이미 있어요. 제목을 바꿔주세요.')
        return
      }
      finalProject = { ...project, id: newId }
    }

    if (!finalProject.title || !finalProject.cover) {
      setError('제목과 대표 이미지는 필수예요.')
      return
    }

    setSaving(true)
    try {
      const next = isNew
        ? [...allProjects, finalProject]
        : allProjects.map((p) => (p.id === finalProject.id ? finalProject : p))
      await saveAdminProjects(next)
      navigate('/')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  if (!allProjects) return <p className="p-10 text-sm text-neutral-500">불러오는 중...</p>

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <header className="flex items-center justify-between border-b border-neutral-200 bg-white px-6 py-4">
        <h1 className="text-base font-semibold text-neutral-900">
          {isNew ? '새 프로젝트' : '프로젝트 편집'}
        </h1>
        <button
          type="button"
          onClick={() => navigate('/')}
          className="text-sm text-neutral-500 hover:text-neutral-900"
        >
          ← 목록으로
        </button>
      </header>

      <main className="mx-auto max-w-2xl px-6 py-10">
        {error && <p className="mb-4 rounded bg-red-50 p-3 text-sm text-red-600">{error}</p>}

        <Field label="제목">
          <input
            value={project.title}
            onChange={(e) => update('title', e.target.value)}
            className={inputClass}
          />
        </Field>

        <Field label="카테고리">
          <select
            value={project.category}
            onChange={(e) => update('category', e.target.value as ProjectCategory)}
            className={inputClass}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="위치">
            <input
              value={project.location}
              onChange={(e) => update('location', e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="연도">
            <input
              value={project.year}
              onChange={(e) => update('year', e.target.value)}
              className={inputClass}
            />
          </Field>
        </div>

        <Field label="한 줄 소개">
          <textarea
            value={project.summary}
            onChange={(e) => update('summary', e.target.value)}
            rows={2}
            className={inputClass}
          />
        </Field>

        <Field label="대표 이미지">
          <ImageUploadField url={project.cover} uploading={uploadingCover} onFile={handleCoverUpload} />
        </Field>

        <div className="mt-10">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-neutral-900">섹션</h2>
            <button type="button" onClick={addSection} className="text-sm text-neutral-900 underline">
              + 섹션 추가
            </button>
          </div>
          <div className="flex flex-col gap-6">
            {project.sections.map((section, i) => (
              <div key={i} className="rounded-md border border-neutral-200 bg-white p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-xs text-neutral-400">섹션 {i + 1}</span>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => moveSection(i, -1)}
                      disabled={i === 0}
                      className="text-xs text-neutral-500 disabled:opacity-30"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      onClick={() => moveSection(i, 1)}
                      disabled={i === project.sections.length - 1}
                      className="text-xs text-neutral-500 disabled:opacity-30"
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      onClick={() => removeSection(i)}
                      className="text-xs text-red-600"
                    >
                      삭제
                    </button>
                  </div>
                </div>
                <Field label="소제목">
                  <input
                    value={section.heading}
                    onChange={(e) => updateSection(i, { heading: e.target.value })}
                    className={inputClass}
                  />
                </Field>
                <Field label="본문">
                  <textarea
                    value={section.body}
                    onChange={(e) => updateSection(i, { body: e.target.value })}
                    rows={3}
                    className={inputClass}
                  />
                </Field>
                <Field label="이미지">
                  <ImageUploadField
                    url={section.image}
                    onFile={(file) => handleSectionImageUpload(i, file)}
                  />
                </Field>
              </div>
            ))}
            {project.sections.length === 0 && (
              <p className="text-sm text-neutral-400">섹션이 없어요. 위 버튼으로 추가하세요.</p>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="mt-10 w-full rounded-md bg-neutral-900 py-3 text-sm font-medium text-white disabled:opacity-50"
        >
          {saving ? '저장 중...' : '저장'}
        </button>
      </main>
    </div>
  )
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="mb-4 block">
      <span className="text-xs font-medium text-neutral-600">{label}</span>
      {children}
    </label>
  )
}

function ImageUploadField({
  url,
  uploading,
  onFile,
}: {
  url: string
  uploading?: boolean
  onFile: (file: File) => void
}) {
  return (
    <div className="mt-1 flex items-center gap-4">
      {url && <img src={url} alt="" className="h-16 w-24 rounded object-cover" />}
      <label className="cursor-pointer rounded-md border border-neutral-300 px-3 py-2 text-xs text-neutral-700 hover:bg-neutral-50">
        {uploading ? '업로드 중...' : url ? '이미지 변경' : '이미지 업로드'}
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) onFile(file)
          }}
        />
      </label>
    </div>
  )
}
