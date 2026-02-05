import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQueryClient, useQuery } from '@tanstack/react-query'
import ProjectList from '../components/projects/ProjectList'
import ProjectCreateModal from '../components/projects/ProjectCreateModal'
import ProjectEditModal from '../components/projects/ProjectEditModal'
import Button from '../components/ui/Button'
import { useProjects } from '../hooks/useProjects'
import { createProject, updateProject, deleteProject, fetchPublicProjects, joinProject } from '../api/projects'

const ProjectsPage = () => {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState<'my' | 'public'>('my')
  
  const { data: myProjects = [], isLoading: isMyProjectsLoading } = useProjects()
  
  const { data: publicProjects = [], isLoading: isPublicProjectsLoading } = useQuery({
    queryKey: ['publicProjects'],
    queryFn: fetchPublicProjects,
    enabled: activeTab === 'public'
  })

  const [open, setOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState<any>(null)
  const queryClient = useQueryClient()

  const handleJoin = async (projectId: number) => {
    try {
      await joinProject(projectId)
      alert(t('joinRequestSent'))
      await queryClient.invalidateQueries({ queryKey: ['publicProjects'] })
    } catch (error) {
      console.error(error)
      alert(t('joinRequestFailed'))
    }
  }

  const handleCreate = async (payload: any) => {
    await createProject(payload)
    await queryClient.invalidateQueries({ queryKey: ['projects'] })
  }

  const handleUpdate = async (payload: any) => {
    if (!selectedProject) return
    await updateProject(selectedProject.id, payload)
    await queryClient.invalidateQueries({ queryKey: ['projects'] })
    setEditOpen(false)
    setSelectedProject(null)
  }

  const handleDelete = async (projectId: number) => {
    if (!window.confirm(t('confirmDelete'))) return
    await deleteProject(projectId)
    await queryClient.invalidateQueries({ queryKey: ['projects'] })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-ink dark:text-white">{t('projects')}</h2>
        {activeTab === 'my' && <Button onClick={() => setOpen(true)}>{t('newProject')}</Button>}
      </div>

      <div className="flex space-x-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl w-fit">
        <button
          onClick={() => setActiveTab('my')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'my'
              ? 'bg-white dark:bg-slate-700 text-teal-600 dark:text-teal-400 shadow-sm'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
          }`}
        >
          {t('myProjects')}
        </button>
        <button
          onClick={() => setActiveTab('public')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'public'
              ? 'bg-white dark:bg-slate-700 text-teal-600 dark:text-teal-400 shadow-sm'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
          }`}
        >
          {t('publicProjects')}
        </button>
      </div>

      {(activeTab === 'my' ? isMyProjectsLoading : isPublicProjectsLoading) ? (
        <div>{t('loading')}</div>
      ) : (
        <ProjectList
          projects={activeTab === 'my' ? myProjects : publicProjects}
          mode={activeTab}
          onEdit={(project) => {
            setSelectedProject(project)
            setEditOpen(true)
          }}
          onDelete={handleDelete}
          onJoin={handleJoin}
        />
      )}
      <ProjectCreateModal open={open} onClose={() => setOpen(false)} onCreate={handleCreate} />
      {selectedProject && (
        <ProjectEditModal
          open={editOpen}
          onClose={() => {
            setEditOpen(false)
            setSelectedProject(null)
          }}
          onSave={handleUpdate}
          initialData={selectedProject}
        />
      )}
    </div>
  )
}

export default ProjectsPage
