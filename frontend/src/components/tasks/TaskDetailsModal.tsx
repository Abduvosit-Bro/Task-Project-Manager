import Modal from '../ui/Modal'
import Badge from '../ui/Badge'
import { useTranslation } from 'react-i18next'
import { pickLocalized } from '../../utils/i18nHelpers'
import Button from '../ui/Button'

interface TaskDetailsModalProps {
  open: boolean
  onClose: () => void
  task: any
  onEdit: () => void
}

const TaskDetailsModal = ({ open, onClose, task, onEdit }: TaskDetailsModalProps) => {
  const { t, i18n } = useTranslation()
  const lang = i18n.language as 'ja' | 'uz'

  if (!task) return null

  return (
    <Modal title={t('taskDetails')} open={open} onClose={onClose}>
      <div className="space-y-4">
        <div>
          <div className="text-xs text-gray-500 uppercase">{t('title')}</div>
          <div className="text-lg font-semibold text-ink dark:text-white">
            {pickLocalized(task, 'title', lang)}
          </div>
        </div>
        
        <div>
          <div className="text-xs text-gray-500 uppercase">{t('description')}</div>
          <div className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
            {pickLocalized(task, 'description', lang) || '-'}
          </div>
        </div>

        <div>
          <div className="text-xs text-gray-500 uppercase">{t('projects') || 'Projects'}</div>
          <div className="flex flex-wrap gap-2 mt-1">
            {task.projects_detail && task.projects_detail.length > 0 ? (
              task.projects_detail.map((proj: any) => (
                <span
                  key={proj.id}
                  className="px-2 py-1 rounded text-white text-xs"
                  style={{ backgroundColor: proj.color || '#ccc' }}
                >
                  {pickLocalized(proj, 'name', lang)}
                </span>
              ))
            ) : (
              <span className="text-sm text-gray-500">-</span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-gray-500 uppercase">{t('status')}</div>
            <div className="mt-1">
              <Badge label={task.status} tone={task.status === 'done' ? 'success' : 'neutral'} />
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500 uppercase">{t('priority')}</div>
            <div className="mt-1">
               <Badge label={task.priority} tone="warning" />
            </div>
          </div>
        </div>

        <div>
          <div className="text-xs text-gray-500 uppercase">{t('dueDate')}</div>
          <div className="text-sm text-gray-700 dark:text-gray-300">
            {task.due_at ? new Date(task.due_at).toLocaleString() : '-'}
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button className="bg-gray-200 text-gray-700" onClick={onClose}>
            {t('close')}
          </Button>
          <Button onClick={() => { onClose(); onEdit(); }}>
            {t('edit')}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default TaskDetailsModal
