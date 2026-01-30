import { useQuery } from '@tanstack/react-query'
import { fetchTasks } from '../api/tasks'

export const useTasks = (projectId: string, params?: Record<string, string>) => {
  return useQuery({
    queryKey: ['tasks', projectId, params],
    queryFn: () => fetchTasks(projectId, params),
    enabled: !!projectId,
  })
}
