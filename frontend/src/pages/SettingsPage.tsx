import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import Select from '../components/ui/Select'
import { useAuth } from '../hooks/useAuth'
import { updateProfile } from '../api/auth'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { fetchTags, createTag, deleteTag, updateTag } from '../api/tags'
import { fetchTimezones } from '../api/timezones'

const SettingsPage = () => {
  const { t, i18n } = useTranslation()
  const { user, refreshProfile } = useAuth()
  const [displayName, setDisplayName] = useState(user?.display_name || '')
  const [firstName, setFirstName] = useState(user?.first_name || '')
  const [lastName, setLastName] = useState(user?.last_name || '')
  const [studentId, setStudentId] = useState(user?.student_id || '')
  const [timezone, setTimezone] = useState(user?.timezone || 'Asia/Tashkent')
  const [newTag, setNewTag] = useState('')
  const [profileError, setProfileError] = useState('')
  const [tagError, setTagError] = useState('')
  const queryClient = useQueryClient()
  const { data: tags = [] } = useQuery({ queryKey: ['tags'], queryFn: fetchTags })
  const { data: timezones = [] } = useQuery({ queryKey: ['timezones'], queryFn: fetchTimezones })

  useEffect(() => {
    if (user) {
      setDisplayName(user.display_name || '')
      setFirstName(user.first_name || '')
      setLastName(user.last_name || '')
      setStudentId(user.student_id || '')
      setTimezone(user.timezone || 'Asia/Tashkent')
    }
  }, [user, i18n.language])

  const handleSave = async () => {
    setProfileError('')
    if (!studentId.trim()) {
      setProfileError(t('studentIdRequired'))
      return
    }
    try {
      await updateProfile({
        display_name: displayName,
        first_name: firstName,
        last_name: lastName,
        student_id: studentId,
        timezone,
      })
      await refreshProfile()
    } catch (err: any) {
      const message =
        err?.response?.data?.detail ||
        Object.values(err?.response?.data || {})
          .flat()
          .join(' ') ||
        'Failed to update profile'
      setProfileError(message)
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-ink dark:text-white">{t('settings')}</h2>
      <div className="rounded-2xl bg-white/70 dark:bg-night/70 p-4 space-y-4">
        <div className="text-sm font-semibold text-gray-500">{t('profile')}</div>
        {profileError && <div className="text-sm text-red-500">{profileError}</div>}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Input placeholder={t('firstName')} value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          <Input placeholder={t('lastName')} value={lastName} onChange={(e) => setLastName(e.target.value)} />
        </div>
        <Input placeholder={t('studentId')} value={studentId} onChange={(e) => setStudentId(e.target.value)} />
        <Input placeholder={t('displayName')} value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
        <Select
          value={timezone}
          onChange={(val) => setTimezone(val)}
          options={timezones.map((tz: string) => ({ value: tz, label: tz }))}
        />
        <Button onClick={handleSave}>{t('update')}</Button>
      </div>
      <div className="rounded-2xl bg-white/70 dark:bg-night/70 p-4 space-y-3">
        <div className="text-sm font-semibold text-gray-500">{t('tags')}</div>
        {tagError && <div className="text-sm text-red-500">{tagError}</div>}
        <div className="flex gap-2">
          <Input placeholder={t('newTag')} value={newTag} onChange={(e) => setNewTag(e.target.value)} />
          <Button
            onClick={async () => {
              if (!newTag) return
              setTagError('')
              try {
                await createTag({ name: newTag })
                setNewTag('')
                await queryClient.invalidateQueries({ queryKey: ['tags'] })
              } catch (err: any) {
                const message =
                  err?.response?.data?.detail ||
                  Object.values(err?.response?.data || {})
                    .flat()
                    .join(' ') ||
                  'Failed to create tag'
                setTagError(message)
              }
            }}
          >
            {t('save')}
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag: any) => (
            <div key={tag.id} className="flex items-center gap-1 rounded-full bg-teal/20 px-2 py-1 text-xs text-teal">
              <button
                onClick={async () => {
                  const next = window.prompt(t('renameTag'), tag.name)
                  if (!next) return
                  setTagError('')
                  try {
                    await updateTag(tag.id, { name: next })
                    await queryClient.invalidateQueries({ queryKey: ['tags'] })
                  } catch (err: any) {
                    const message =
                      err?.response?.data?.detail ||
                      Object.values(err?.response?.data || {})
                        .flat()
                        .join(' ') ||
                      'Failed to update tag'
                    setTagError(message)
                  }
                }}
              >
                {tag.name}
              </button>
              <button
                onClick={async () => {
                  setTagError('')
                  try {
                    await deleteTag(tag.id)
                    await queryClient.invalidateQueries({ queryKey: ['tags'] })
                  } catch (err: any) {
                    const message =
                      err?.response?.data?.detail ||
                      Object.values(err?.response?.data || {})
                        .flat()
                        .join(' ') ||
                      'Failed to delete tag'
                    setTagError(message)
                  }
                }}
                className="text-coral"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SettingsPage
