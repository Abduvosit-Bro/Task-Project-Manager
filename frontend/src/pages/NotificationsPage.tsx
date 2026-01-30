import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import NotificationList from '../components/notifications/NotificationList'
import MarkAllReadButton from '../components/notifications/MarkAllReadButton'
import NotificationDetailsModal from '../components/notifications/NotificationDetailsModal'
import { fetchNotification, fetchNotifications, markAllNotificationsRead, markNotificationRead } from '../api/notifications'
import { useState } from 'react'

const NotificationsPage = () => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const [selected, setSelected] = useState<any | null>(null)
  const [open, setOpen] = useState(false)
  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: fetchNotifications,
  })

  const { data: detail } = useQuery({
    queryKey: ['notification', selected?.id],
    queryFn: () => fetchNotification(selected.id),
    enabled: !!selected?.id,
  })

  const handleMarkAll = async () => {
    await markAllNotificationsRead()
    await queryClient.invalidateQueries({ queryKey: ['notifications'] })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-ink dark:text-white">{t('notifications')}</h2>
        <MarkAllReadButton onClick={handleMarkAll} />
      </div>
      {isLoading ? (
        <div>{t('loading')}</div>
      ) : (
        <NotificationList
          notifications={notifications}
          onSelect={(n) => {
            setSelected(n)
            setOpen(true)
          }}
        />
      )}
      <NotificationDetailsModal
        open={open}
        onClose={() => setOpen(false)}
        notification={detail}
        onMarkRead={async () => {
          if (!detail) return
          await markNotificationRead(detail.id)
          await queryClient.invalidateQueries({ queryKey: ['notifications'] })
          await queryClient.invalidateQueries({ queryKey: ['notification', detail.id] })
        }}
      />
    </div>
  )
}

export default NotificationsPage
