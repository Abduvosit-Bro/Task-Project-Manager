import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useQueryClient } from '@tanstack/react-query'
import TaskList from '../components/tasks/TaskList'
import TaskFilters from '../components/tasks/TaskFilters'
import TaskFormModal from '../components/tasks/TaskFormModal'
import TaskDetailsModal from '../components/tasks/TaskDetailsModal'
import Button from '../components/ui/Button'
import { useTasks } from '../hooks/useTasks'
import { createTask, updateTask, deleteTask } from '../api/tasks'

const TasksPage = () => {
  const { t } = useTranslation()
  const { id } = useParams()
  const [filters, setFilters] = useState({ status: '', priority: '', tag: '' })
  const { data: tasks = [], isLoading } = useTasks(id || '', filters)
  const [open, setOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<any>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const queryClient = useQueryClient()

  const handleCreate = async (payload: any) => {
    if (!id) return
    await createTask(id, payload)
    await queryClient.invalidateQueries({ queryKey: ['tasks', id] })
    setOpen(false)
  }

  const handleUpdate = async (payload: any) => {
    if (!selectedTask || !id) return
    await updateTask(selectedTask.id, payload)
    await queryClient.invalidateQueries({ queryKey: ['tasks', id] })
    setEditOpen(false)
    setSelectedTask(null)
  }

  const handleDelete = async (taskId: number) => {
    if (!id || !window.confirm(t('confirmDelete'))) return
    await deleteTask(taskId)
    await queryClient.invalidateQueries({ queryKey: ['tasks', id] })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-ink dark:text-white">{t('tasks')}</h2>
        <Button onClick={() => setOpen(true)}>{t('newTask')}</Button>
      </div>
      <TaskFilters filters={filters} onChange={setFilters} />
      {isLoading ? (
        <div>{t('loading')}</div>
      ) : (
        <TaskList
          tasks={tasks}
          onTaskClick={(task) => {
            setSelectedTask(task)
            setDetailsOpen(true)
          }}
          onDelete={handleDelete}
        />
      )}
      <TaskFormModal open={open} onClose={() => setOpen(false)} onSave={handleCreate} title={t('newTask')} />
      <TaskDetailsModal
        open={detailsOpen}
        onClose={() => {
          setDetailsOpen(false)
          setSelectedTask(null)
        }}
        task={selectedTask}
        onEdit={() => {
          setDetailsOpen(false)
          setEditOpen(true)
        }}
      />
      {selectedTask && (
        <TaskFormModal
          open={editOpen}
          onClose={() => {
            setEditOpen(false)
            setSelectedTask(null)
          }}
          onSave={handleUpdate}
          initialData={selectedTask}
          title={t('editTask')}
        />
      )}
    </div>
  )
}

export default TasksPage
