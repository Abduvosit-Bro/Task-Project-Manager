import NotificationItem from './NotificationItem'
import { useTranslation } from 'react-i18next'

const NotificationList = ({
  notifications,
  onSelect,
}: {
  notifications: any[]
  onSelect: (notification: any) => void
}) => {
  const { t } = useTranslation()
  if (!notifications || notifications.length === 0) {
    return <div className="text-sm text-gray-500">{t('noData')}</div>
  }
  return (
    <div className="space-y-2">
      {notifications.map((n) => (
        <NotificationItem key={n.id} notification={n} onClick={() => onSelect(n)} />
      ))}
    </div>
  )
}

export default NotificationList
