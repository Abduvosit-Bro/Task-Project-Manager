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
  return (
    <div className="flex gap-4 w-full">
      <div className="flex flex-col gap-1 flex-1">
        <label className="ml-1 text-xs font-medium text-ink/60 dark:text-white/60">
          {t('status')}
        </label>
        <Select
          value={filters.status}
          onChange={(e) => onChange({ ...filters, status: e.target.value })}
        >
          <option value="">-</option>
          <option value="todo">todo</option>
          <option value="in_progress">in_progress</option>
          <option value="done">done</option>
        </Select>
      </div>

      <div className="flex flex-col gap-1 flex-1">
        <label className="ml-1 text-xs font-medium text-ink/60 dark:text-white/60">
          {t('priority')}
        </label>
        <Select
          value={filters.priority}
          onChange={(e) => onChange({ ...filters, priority: e.target.value })}
        >
          <option value="">-</option>
          <option value="low">low</option>
          <option value="medium">medium</option>
          <option value="high">high</option>
        </Select>
      </div>

      <div className="flex flex-col gap-1 flex-1">
        <label className="ml-1 text-xs font-medium text-ink/60 dark:text-white/60">
          {t('tags')}
        </label>
        <Select
          value={filters.tag || ''}
          onChange={(e) => onChange({ ...filters, tag: e.target.value })}
        >
          <option value="">-</option>
          {tags.map((tag: any) => (
            <option key={tag.id} value={tag.id}>
              {tag.name}
            </option>
          ))}
        </Select>
      </div>
    </div>
  )
}

export default TaskFilters
