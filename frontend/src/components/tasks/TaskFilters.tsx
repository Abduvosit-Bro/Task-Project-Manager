import Select from '../ui/Select'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import { fetchTags } from '../../api/tags'

interface TaskFiltersProps {
  filters: { status: string; priority: string; tag: string }
  onChange: (filters: { status: string; priority: string; tag: string }) => void
}

const TaskFilters = ({ filters, onChange }: TaskFiltersProps) => {
  const { t } = useTranslation()
  const { data: tags = [] } = useQuery({ queryKey: ['tags'], queryFn: fetchTags })

  const statusOptions = [
    { value: '', label: '-' },
    { value: 'todo', label: 'todo' },
    { value: 'in_progress', label: 'in_progress' },
    { value: 'done', label: 'done' },
  ]

  const priorityOptions = [
    { value: '', label: '-' },
    { value: 'low', label: 'low' },
    { value: 'medium', label: 'medium' },
    { value: 'high', label: 'high' },
  ]

  const tagOptions = [
    { value: '', label: '-' },
    ...tags.map((tag: any) => ({ value: tag.id, label: tag.name }))
  ]

  return (
    <div className="flex gap-4 w-full">
      <div className="flex flex-col gap-1 flex-1">
        <label className="ml-1 text-xs font-medium text-ink/60 dark:text-white/60">
          {t('status')}
        </label>
        <Select
          value={filters.status}
          onChange={(val) => onChange({ ...filters, status: val })}
          options={statusOptions}
        />
      </div>

      <div className="flex flex-col gap-1 flex-1">
        <label className="ml-1 text-xs font-medium text-ink/60 dark:text-white/60">
          {t('priority')}
        </label>
        <Select
          value={filters.priority}
          onChange={(val) => onChange({ ...filters, priority: val })}
          options={priorityOptions}
        />
      </div>

      <div className="flex flex-col gap-1 flex-1">
        <label className="ml-1 text-xs font-medium text-ink/60 dark:text-white/60">
          {t('tags')}
        </label>
        <Select
          value={filters.tag || ''}
          onChange={(val) => onChange({ ...filters, tag: val })}
          options={tagOptions}
        />
      </div>
    </div>
  )
}

export default TaskFilters
