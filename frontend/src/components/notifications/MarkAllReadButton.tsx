import Button from '../ui/Button'
import { useTranslation } from 'react-i18next'

const MarkAllReadButton = ({ onClick }: { onClick: () => void }) => {
  const { t } = useTranslation()
  return <Button onClick={onClick}>{t('markAllRead')}</Button>
}

export default MarkAllReadButton
