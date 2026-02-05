import TaskItemRow from './TaskItemRow'
import { useTranslation } from 'react-i18next'

const TaskList = ({ tasks, onTaskClick, onDelete }: { tasks: any[]; onTaskClick: (task: any) => void; onDelete?: (taskId: number) => void }) => {
  const { t } = useTranslation()
  if (!tasks || tasks.length === 0) {
    return <div className="text-sm text-gray-500">{t('noData')}</div>
  }
  return (
    <div className="space-y-2">
      {tasks.map((task) => (
        <TaskItemRow 
          key={task.id} 
          task={task} 
          onClick={() => onTaskClick(task)} 
          onDelete={onDelete ? () => onDelete(task.id) : undefined} 
        />
      ))}
    </div>
  )
}

export default TaskList
