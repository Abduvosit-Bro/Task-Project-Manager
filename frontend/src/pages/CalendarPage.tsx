import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import CalendarView from '../components/calendar/CalendarView'
import EventFormModal from '../components/calendar/EventFormModal'
import Button from '../components/ui/Button'
import { createEvent } from '../api/events'

const CalendarPage = () => {
  const { t } = useTranslation()
  const { id } = useParams()
  const [open, setOpen] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  const handleCreate = async (payload: any) => {
    if (!id) return
    await createEvent(id, payload)
    setRefreshKey((prev) => prev + 1)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-ink dark:text-white">{t('calendar')}</h2>
        <Button onClick={() => setOpen(true)}>{t('newEvent')}</Button>
      </div>
      {id && <CalendarView projectId={id} refreshKey={refreshKey} />}
      <EventFormModal open={open} onClose={() => setOpen(false)} onSave={handleCreate} />
    </div>
  )
}

export default CalendarPage
