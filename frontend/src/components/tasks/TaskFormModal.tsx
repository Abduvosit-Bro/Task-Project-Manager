import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Modal from '../ui/Modal'
import Input from '../ui/Input'
import Select from '../ui/Select'
import Button from '../ui/Button'
import { translateText } from '../../api/translate'
import { useQuery } from '@tanstack/react-query'
import { fetchTags } from '../../api/tags'
import { fetchProjects } from '../../api/projects'
import { pickLocalized } from '../../utils/i18nHelpers'

const TaskFormModal = ({
  open,
  onClose,
  onSave,
  initialData,
  title,
}: {
  open: boolean
  onClose: () => void
  onSave: (payload: any) => void
  initialData?: any
  title?: string
}) => {
  const { t, i18n } = useTranslation()
  const lang = i18n.language as 'ja' | 'uz'
  const { data: tags = [], refetch } = useQuery({ queryKey: ['tags'], queryFn: fetchTags })
  const { data: projects = [] } = useQuery({ queryKey: ['projects'], queryFn: fetchProjects })
  const validTagIds = useMemo(() => new Set(tags.map((tag: any) => tag.id)), [tags])
  const [form, setForm] = useState({
    title_ja: '',
    title_uz: '',
    description_ja: '',
    description_uz: '',
    due_at: '',
    status: 'todo',
    priority: 'medium',
    tags: [] as number[],
    projects: [] as number[],
  })
  const [error, setError] = useState('')

  useEffect(() => {
    if (open) {
      void refetch()
    }
    if (initialData) {
      setForm({
        title_ja: initialData.title_ja || '',
        title_uz: initialData.title_uz || '',
        description_ja: initialData.description_ja || '',
        description_uz: initialData.description_uz || '',
        due_at: initialData.due_at ? initialData.due_at.slice(0, 16) : '',
        status: initialData.status || 'todo',
        priority: initialData.priority || 'medium',
        tags: initialData.tags || [],
        projects: initialData.projects || [],
      })
    } else if (open) {
      setForm({
        title_ja: '',
        title_uz: '',
        description_ja: '',
        description_uz: '',
        due_at: '',
        status: 'todo',
        priority: 'medium',
        tags: [],
        projects: [],
      })
    }
  }, [initialData, open, refetch])

  const handleTranslate = async () => {
    const updates: any = { ...form }
    if (form.title_ja && !form.title_uz) {
      const res = await translateText({ source_lang: 'ja', target_lang: 'uz', text: form.title_ja })
      updates.title_uz = res.translated_text
    }
    if (form.title_uz && !form.title_ja) {
      const res = await translateText({ source_lang: 'uz', target_lang: 'ja', text: form.title_uz })
      updates.title_ja = res.translated_text
    }
    if (form.description_ja && !form.description_uz) {
      const res = await translateText({ source_lang: 'ja', target_lang: 'uz', text: form.description_ja })
      updates.description_uz = res.translated_text
    }
    if (form.description_uz && !form.description_ja) {
      const res = await translateText({ source_lang: 'uz', target_lang: 'ja', text: form.description_uz })
      updates.description_ja = res.translated_text
    }
    setForm(updates)
  }

  const handleSubmit = async () => {
    setError('')
    if (!form.title_ja.trim() && !form.title_uz.trim()) {
      setError(t('titleRequired'))
      return
    }
    try {
      const sanitizedTags = form.tags.filter((id) => validTagIds.has(id))
      await onSave({
      title_ja: form.title_ja,
      title_uz: form.title_uz,
      description_ja: form.description_ja,
      description_uz: form.description_uz,
      due_at: form.due_at || null,
      status: form.status,
      priority: form.priority,
      tags: sanitizedTags,
      projects: form.projects,
      })
      setForm({
      title_ja: '',
      title_uz: '',
      description_ja: '',
      description_uz: '',
      due_at: '',
      status: 'todo',
      priority: 'medium',
      tags: [],
      projects: [],
      })
      onClose()
    } catch (err: any) {
      const message =
        err?.response?.data?.detail ||
        Object.values(err?.response?.data || {})
          .flat()
          .join(' ') ||
        'Failed to create task'
      setError(message)
    }
  }

  return (
    <Modal title={title || t('newTask')} open={open} onClose={onClose}>
      <div className="space-y-3">
        {error && <div className="text-sm text-red-500">{error}</div>}
        <Input placeholder={t('titleJa')} value={form.title_ja} onChange={(e) => setForm({ ...form, title_ja: e.target.value })} />
        <Input placeholder={t('titleUz')} value={form.title_uz} onChange={(e) => setForm({ ...form, title_uz: e.target.value })} />
        <Input placeholder={t('descriptionJa')} value={form.description_ja} onChange={(e) => setForm({ ...form, description_ja: e.target.value })} />
        <Input placeholder={t('descriptionUz')} value={form.description_uz} onChange={(e) => setForm({ ...form, description_uz: e.target.value })} />
        <Input type="datetime-local" value={form.due_at} onChange={(e) => setForm({ ...form, due_at: e.target.value })} />
        <div className="grid grid-cols-2 gap-3">
          <Select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
            <option value="todo">todo</option>
            <option value="in_progress">in_progress</option>
            <option value="done">done</option>
          </Select>
          <Select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
            <option value="low">low</option>
            <option value="medium">medium</option>
            <option value="high">high</option>
          </Select>
        </div>
        <div className="space-y-2">
          <div className="text-xs text-gray-500">{t('projects') || 'Projects'}</div>
          <div className="flex flex-wrap gap-2">
            {projects.map((proj: any) => (
              <label key={proj.id} className="flex items-center gap-2 text-xs">
                <input
                  type="checkbox"
                  checked={form.projects.includes(proj.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setForm({ ...form, projects: [...form.projects, proj.id] })
                    } else {
                      setForm({ ...form, projects: form.projects.filter((id) => id !== proj.id) })
                    }
                  }}
                />
                <span className="px-2 py-1 rounded text-white text-[10px]" style={{ backgroundColor: proj.color || '#ccc' }}>
                   {pickLocalized(proj, 'name', lang)}
                </span>
              </label>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <div className="text-xs text-gray-500">Tags</div>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag: any) => (
              <label key={tag.id} className="flex items-center gap-2 text-xs">
                <input
                  type="checkbox"
                  checked={form.tags.includes(tag.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setForm({ ...form, tags: [...form.tags, tag.id] })
                    } else {
                      setForm({ ...form, tags: form.tags.filter((id) => id !== tag.id) })
                    }
                  }}
                />
                {tag.name}
              </label>
            ))}
          </div>
        </div>
        <div className="flex justify-between">
          <button className="text-sm text-teal" onClick={handleTranslate}>
            {t('autoTranslate')}
          </button>
          <div className="flex gap-2">
            <Button className="bg-gray-200 text-gray-700" onClick={onClose}>
              {t('cancel')}
            </Button>
            <Button onClick={handleSubmit}>{t('save')}</Button>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default TaskFormModal
