import Badge from '../ui/Badge'
import { pickLocalized } from '../../utils/i18nHelpers'
import { useTranslation } from 'react-i18next'
import { Calendar, CheckCircle2, Circle } from 'lucide-react'

const TaskItemRow = ({ task, onClick, onDelete }: { task: any; onClick: () => void; onDelete: () => void }) => {
  const { i18n } = useTranslation()
  const lang = i18n.language as 'ja' | 'uz'
  
  return (
    <div
      onClick={onClick}
      className="group flex items-center justify-between rounded-xl bg-white/60 dark:bg-slate-900/60 border border-transparent hover:border-teal/20 hover:bg-white/80 dark:hover:bg-slate-800/80 p-4 cursor-pointer shadow-sm hover:shadow-md transition-all duration-200"
    >
      <div className="flex items-center gap-3">
        <div className={`text-teal-500 ${task.status === 'done' ? 'opacity-100' : 'opacity-50 group-hover:opacity-100 transition-opacity'}`}>
          {task.status === 'done' ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
        </div>
        <div>
          <div className={`font-semibold text-slate-800 dark:text-white ${task.status === 'done' ? 'line-through text-slate-400 dark:text-slate-500' : ''}`}>
            {pickLocalized(task, 'title', lang)}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-1">
            <Calendar className="w-3 h-3" />
            {task.due_at ? new Date(task.due_at).toLocaleDateString() : '-'}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Badge label={task.priority} tone={task.priority === 'high' ? 'critical' : task.priority === 'medium' ? 'warning' : 'neutral'} />
        <Badge label={task.status} tone={task.status === 'done' ? 'success' : 'neutral'} />
      </div>
    </div>
  )
}

export default TaskItemRow
