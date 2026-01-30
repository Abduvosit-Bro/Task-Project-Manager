import Modal from '../ui/Modal'
import Button from '../ui/Button'
import { useTranslation } from 'react-i18next'

const MyProfileModal = ({ open, onClose, user }: { open: boolean; onClose: () => void; user: any }) => {
  const { t } = useTranslation()
  if (!user) return null
  return (
    <Modal title={t('profile')} open={open} onClose={onClose}>
      <div className="flex flex-col items-center mb-6">
        <div className="w-20 h-20 rounded-full bg-teal text-white flex items-center justify-center text-3xl font-bold mb-3">
          {user.first_name?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
        </div>
        <div className="text-xl font-semibold text-ink dark:text-white">
          {user.display_name || `${user.first_name} ${user.last_name}`}
        </div>
        <div className="text-sm text-gray-500">{user.email}</div>
      </div>
      
      <div className="space-y-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">{t('firstName')}</div>
            <div className="font-medium">{user.first_name || '-'}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">{t('lastName')}</div>
            <div className="font-medium">{user.last_name || '-'}</div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 border-t border-gray-200 dark:border-gray-700 pt-4">
          <div>
            <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">{t('studentId')}</div>
            <div className="font-medium font-mono bg-white dark:bg-gray-700 px-2 py-1 rounded inline-block text-sm">
              {user.student_id || '-'}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">{t('timezone')}</div>
            <div className="font-medium">{user.timezone}</div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <Button onClick={onClose}>{t('close')}</Button>
      </div>
    </Modal>
  )
}

export default MyProfileModal
