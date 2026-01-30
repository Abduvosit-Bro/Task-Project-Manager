import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQueryClient } from '@tanstack/react-query'
import ProjectList from '../components/projects/ProjectList'
import ProjectCreateModal from '../components/projects/ProjectCreateModal'
import ProjectEditModal from '../components/projects/ProjectEditModal'
import Button from '../components/ui/Button'
import { useProjects } from '../hooks/useProjects'
import { createProject, updateProject, deleteProject } from '../api/projects'

const ProjectsPage = () => {
  const { t } = useTranslation()
  const { data: projects = [], isLoading } = useProjects()
  const [open, setOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState<any>(null)
  const queryClient = useQueryClient()

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
        <Button onClick={() => setOpen(true)}>{t('newProject')}</Button>
      </div>
      {isLoading ? (
        <div>{t('loading')}</div>
      ) : (
        <ProjectList
          projects={projects}
          onEdit={(project) => {
            setSelectedProject(project)
            setEditOpen(true)
          }}
          onDelete={handleDelete}
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
