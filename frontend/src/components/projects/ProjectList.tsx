import { useNavigate } from 'react-router-dom'
import { Folder, MoreVertical, Edit2, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Project } from '../../types/project'
import { pickLocalized } from '../../utils/i18nHelpers'
import { useAuth } from '../../hooks/useAuth'

interface ProjectListProps {
  projects: Project[]
  mode?: 'my' | 'public'
  onEdit?: (project: Project) => void
  onDelete?: (id: number) => void
  onJoin?: (id: number) => void
}

export default function ProjectList({ projects, mode = 'my', onEdit, onDelete, onJoin }: ProjectListProps) {
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()
  const { user } = useAuth()
  const lang = i18n.language

  if (projects.length === 0) {
    return (
      <div className="text-center py-12 glass-card">
        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <Folder className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-1">
          {mode === 'my' ? t('noData') : t('noPublicProjects')}
        </h3>
        {mode === 'my' && <p className="text-slate-500 dark:text-slate-400">Create your first project to get started</p>}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <div
          key={project.id}
          onClick={() => navigate(`/app/projects/${project.id}/tasks`)}
          className={`group relative glass-card p-5 hover:shadow-md transition-all duration-300 flex flex-col justify-between hover:-translate-y-1 cursor-pointer`}
        >
          <div>
            <div className="flex justify-between items-start mb-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-teal-500/10 to-emerald-500/10 text-teal-600 dark:text-teal-400">
                <Folder className="w-6 h-6" />
              </div>
              
              {mode === 'my' && project.owner === user?.id && (
              <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    onEdit?.(project)
                  }}
                  className="p-2 rounded-lg bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-600 dark:bg-slate-800 dark:hover:bg-blue-900/30 dark:text-slate-400 dark:hover:text-blue-400 transition-colors"
                  title="Edit project"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    onDelete?.(project.id)
                  }}
                  className="p-2 rounded-lg bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 dark:bg-slate-800 dark:hover:bg-red-900/30 dark:text-slate-400 dark:hover:text-red-400 transition-colors"
                  title="Delete project"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              )}
            </div>

            <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2 line-clamp-1 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
              {pickLocalized(project, 'name', lang) || 'Untitled Project'}
            </h3>
            
            <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-2 h-10">
              {pickLocalized(project, 'description', lang)}
            </p>

            {/* Display Subject if available */}
            {(project.subject_ja || project.subject_uz) && (
              <div className="mb-2">
                <span className="text-xs px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  {pickLocalized(project, 'subject', lang)}
                </span>
              </div>
            )}
          </div>

          <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400 dark:text-slate-500">
            <span>Created {new Date(project.created_at).toLocaleDateString()}</span>
            {mode === 'public' && (
              <div onClick={(e) => e.stopPropagation()}>
                {project.member_status === 'active' ? (
                   <span className="text-green-500 text-sm font-medium">{t('member') || 'Member'}</span>
                ) : project.member_status === 'pending' ? (
                   <span className="text-yellow-500 text-sm font-medium">{t('requestPending') || 'Pending'}</span>
                ) : project.member_status === 'rejected' ? (
                   <span className="text-red-500 text-sm font-medium">{t('requestRejected') || 'Rejected'}</span>
                ) : (
                  <button
                    onClick={() => onJoin?.(project.id)}
                    className="px-3 py-1.5 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition-colors text-sm"
                  >
                    {t('join') || 'Join'}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
