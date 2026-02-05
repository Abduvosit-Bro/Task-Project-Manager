import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Modal from '../ui/Modal'
import Input from '../ui/Input'
import Button from '../ui/Button'
import { translateText } from '../../api/translate'
import { useQuery } from '@tanstack/react-query'
import { fetchTags } from '../../api/tags'

const EventFormModal = ({
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
  const { t } = useTranslation()
  const { data: tags = [] } = useQuery({ queryKey: ['tags'], queryFn: fetchTags })
  const [form, setForm] = useState({
    title_ja: '',
    title_uz: '',
    description_ja: '',
    description_uz: '',
    start_at: '',
    end_at: '',
    location: '',
    tags: [] as number[],
  })

  useEffect(() => {
    if (initialData) {
      setForm({
        title_ja: initialData.title_ja || '',
        title_uz: initialData.title_uz || '',
        description_ja: initialData.description_ja || '',
        description_uz: initialData.description_uz || '',
        start_at: initialData.start_at ? initialData.start_at.slice(0, 16) : '',
        end_at: initialData.end_at ? initialData.end_at.slice(0, 16) : '',
        location: initialData.location || '',
        tags: initialData.tags || [],
      })
    }
  }, [initialData])

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
    await onSave({
      title_ja: form.title_ja,
      title_uz: form.title_uz,
      description_ja: form.description_ja,
      description_uz: form.description_uz,
      start_at: form.start_at,
      end_at: form.end_at || null,
      location: form.location || null,
      tags: form.tags,
    })
    setForm({
      title_ja: '',
      title_uz: '',
      description_ja: '',
      description_uz: '',
      start_at: '',
      end_at: '',
      location: '',
      tags: [],
    })
    onClose()
  }

  return (
    <Modal title={title || t('newEvent')} open={open} onClose={onClose}>
      <div className="space-y-3">
        <Input placeholder={t('titleJa')} value={form.title_ja} onChange={(e) => setForm({ ...form, title_ja: e.target.value })} />
        <Input placeholder={t('titleUz')} value={form.title_uz} onChange={(e) => setForm({ ...form, title_uz: e.target.value })} />
        <Input placeholder={t('descriptionJa')} value={form.description_ja} onChange={(e) => setForm({ ...form, description_ja: e.target.value })} />
        <Input placeholder={t('descriptionUz')} value={form.description_uz} onChange={(e) => setForm({ ...form, description_uz: e.target.value })} />
        <Input type="datetime-local" value={form.start_at} onChange={(e) => setForm({ ...form, start_at: e.target.value })} />
        <Input type="datetime-local" value={form.end_at} onChange={(e) => setForm({ ...form, end_at: e.target.value })} />
        <Input placeholder={t('location')} value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
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
          <button type="button" className="text-sm text-teal" onClick={handleTranslate}>
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

export default EventFormModal
