import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Modal from '../ui/Modal'
import Input from '../ui/Input'
import Button from '../ui/Button'
import { translateText } from '../../api/translate'

const ProjectEditModal = ({ open, onClose, onSave, initialData }: { open: boolean; onClose: () => void; onSave: (payload: any) => void; initialData: any }) => {
  const { t } = useTranslation()
  const [form, setForm] = useState({ name_ja: '', name_uz: '', description_ja: '', description_uz: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (initialData) {
      setForm({
        name_ja: initialData.name_ja || '',
        name_uz: initialData.name_uz || '',
        description_ja: initialData.description_ja || '',
        description_uz: initialData.description_uz || '',
      })
    }
  }, [initialData])

  const handleTranslate = async () => {
    const updates: any = { ...form }
    if (form.name_ja && !form.name_uz) {
      const res = await translateText({ source_lang: 'ja', target_lang: 'uz', text: form.name_ja })
      updates.name_uz = res.translated_text
    }
    if (form.name_uz && !form.name_ja) {
      const res = await translateText({ source_lang: 'uz', target_lang: 'ja', text: form.name_uz })
      updates.name_ja = res.translated_text
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
    setLoading(true)
    setError('')
    try {
      await onSave(form)
      onClose()
    } catch (err: any) {
      const message =
        err?.response?.data?.detail ||
        Object.values(err?.response?.data || {})
          .flat()
          .join(' ') ||
        'Failed to update project'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal title={t('editProject')} open={open} onClose={onClose}>
      <div className="space-y-3">
        {error && <div className="text-sm text-red-500">{error}</div>}
        <Input placeholder={t('nameJa')} value={form.name_ja} onChange={(e) => setForm({ ...form, name_ja: e.target.value })} />
        <Input placeholder={t('nameUz')} value={form.name_uz} onChange={(e) => setForm({ ...form, name_uz: e.target.value })} />
        <Input placeholder={t('descriptionJa')} value={form.description_ja} onChange={(e) => setForm({ ...form, description_ja: e.target.value })} />
        <Input placeholder={t('descriptionUz')} value={form.description_uz} onChange={(e) => setForm({ ...form, description_uz: e.target.value })} />
        <div className="flex justify-between">
          <button className="text-sm text-teal" onClick={handleTranslate}>
            {t('autoTranslate')}
          </button>
          <div className="flex gap-2">
            <Button className="bg-gray-200 text-gray-700" onClick={onClose}>
              {t('cancel')}
            </Button>
            <Button onClick={handleSubmit} disabled={loading}>
              {t('save')}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default ProjectEditModal
