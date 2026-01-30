import Modal from '../ui/Modal'
import Button from '../ui/Button'
import { useTranslation } from 'react-i18next'
import { pickLocalized } from '../../utils/i18nHelpers'

const NotificationDetailsModal = ({
  open,
  onClose,
  notification,
  onMarkRead,
}: {
  open: boolean
  onClose: () => void
  notification: any | null
  onMarkRead: () => void
}) => {
  const { t, i18n } = useTranslation()
  if (!notification) return null
  const lang = i18n.language as 'ja' | 'uz'
  const entity = notification.entity

  return (
    <Modal title={t('notifications')} open={open} onClose={onClose}>
      <div className="space-y-3 text-sm">
        <div>
          <div className="text-xs text-gray-500">{t('status')}</div>
          <div>{notification.type}</div>
        </div>
        <div>
          <div className="text-xs text-gray-500">scheduled_for</div>
          <div>{notification.scheduled_for}</div>
        </div>
        <div>
          <div className="text-xs text-gray-500">entity_type</div>
          <div>{notification.entity_type}</div>
        </div>
        {entity && entity.project && (
          <div>
            <div className="text-xs text-gray-500">{t('projects')}</div>
            <div>{pickLocalized(entity.project, 'name', lang)}</div>
          </div>
        )}
        {entity && (
          <div>
            <div className="text-xs text-gray-500">{t('titleJa')}</div>
            <div>{pickLocalized(entity, 'title', lang)}</div>
          </div>
        )}
        {notification.entity_type === 'task' && entity && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="text-xs text-gray-500">{t('dueAt')}</div>
              <div>{entity.due_at || '-'}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">{t('priority')}</div>
              <div>{entity.priority}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">{t('status')}</div>
              <div>{entity.status}</div>
            </div>
          </div>
        )}
        {notification.entity_type === 'event' && entity && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="text-xs text-gray-500">{t('startAt')}</div>
              <div>{entity.start_at || '-'}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">{t('endAt')}</div>
              <div>{entity.end_at || '-'}</div>
            </div>
          </div>
        )}
        <div className="flex justify-end gap-2 pt-2">
          {!notification.is_read && (
            <Button onClick={onMarkRead}>{t('markRead')}</Button>
          )}
          <Button className="bg-gray-200 text-gray-700" onClick={onClose}>
            {t('cancel')}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default NotificationDetailsModal
