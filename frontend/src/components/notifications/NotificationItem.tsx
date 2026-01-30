import Badge from '../ui/Badge'

const NotificationItem = ({
  notification,
  onClick,
}: {
  notification: any
  onClick: () => void
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-between rounded-xl bg-white/70 dark:bg-night/70 p-3 text-left"
    >
      <div>
        <div className="font-semibold text-ink dark:text-white">{notification.type}</div>
        <div className="text-xs text-gray-500">{notification.scheduled_for}</div>
      </div>
      <Badge label={notification.is_read ? 'read' : 'new'} tone={notification.is_read ? 'neutral' : 'success'} />
    </button>
  )
}

export default NotificationItem
