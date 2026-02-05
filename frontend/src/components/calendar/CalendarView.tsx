import { useEffect, useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { fetchCalendar, fetchEvent, updateEvent } from '../../api/events'
import { fetchTask, updateTask } from '../../api/tasks'
import { useTranslation } from 'react-i18next'
import { pickLocalized } from '../../utils/i18nHelpers'
import EventFormModal from './EventFormModal'
import TaskFormModal from '../tasks/TaskFormModal'

const CalendarView = ({ projectId, refreshKey }: { projectId?: string; refreshKey: number }) => {
  const { i18n } = useTranslation()
  const [events, setEvents] = useState<any[]>([])
  const [selectedTask, setSelectedTask] = useState<any | null>(null)
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null)
  const [editTaskOpen, setEditTaskOpen] = useState(false)
  const [editEventOpen, setEditEventOpen] = useState(false)
  const [refreshInternal, setRefreshInternal] = useState(0)

  useEffect(() => {
    const load = async () => {
      const data = await fetchCalendar(projectId)
      const lang = i18n.language as 'ja' | 'uz'
      const mapped = data.map((item: any) => ({
        id: item.id,
        title: pickLocalized(item, 'title', lang),
        start: item.start,
        end: item.end,
        allDay: item.allDay,
        backgroundColor: item.project_color || '#3b82f6',
        borderColor: item.project_color || '#3b82f6',
        extendedProps: {
          project_name_ja: item.project_name_ja,
          project_name_uz: item.project_name_uz,
          project_color: item.project_color
        }
      }))
      setEvents(mapped)
    }
    void load()
  }, [projectId, i18n.language, refreshKey, refreshInternal])

  const handleEventClick = async (info: any) => {
    const id: string = info.event.id
    if (id.startsWith('task-')) {
      const taskId = Number(id.replace('task-', ''))
      const data = await fetchTask(taskId)
      setSelectedTask(data)
      setEditTaskOpen(true)
    } else if (id.startsWith('event-')) {
      const eventId = Number(id.replace('event-', ''))
      const data = await fetchEvent(eventId)
      setSelectedEvent(data)
      setEditEventOpen(true)
    }
  }

  const handleTaskUpdate = async (payload: any) => {
    if (!selectedTask) return
    await updateTask(selectedTask.id, payload)
    setEditTaskOpen(false)
    setRefreshInternal((prev) => prev + 1)
  }

  const handleEventUpdate = async (payload: any) => {
    if (!selectedEvent) return
    await updateEvent(selectedEvent.id, payload)
    setEditEventOpen(false)
    setRefreshInternal((prev) => prev + 1)
  }

  return (
    <div className="glass-card p-6">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek',
        }}
        events={events}
        eventClick={handleEventClick}
        height="auto"
      />
      <TaskFormModal
        open={editTaskOpen}
        onClose={() => setEditTaskOpen(false)}
        onSave={handleTaskUpdate}
        initialData={selectedTask}
        title="Edit Task"
      />
      <EventFormModal
        open={editEventOpen}
        onClose={() => setEditEventOpen(false)}
        onSave={handleEventUpdate}
        initialData={selectedEvent}
        title="Edit Event"
      />
    </div>
  )
}

export default CalendarView
