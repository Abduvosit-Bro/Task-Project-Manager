import { Link, useLocation } from 'react-router-dom'
import { useProjects } from '../../hooks/useProjects'
import { useTranslation } from 'react-i18next'
import { pickLocalized } from '../../utils/i18nHelpers'
import { LayoutDashboard, Bell, Settings, FolderKanban } from 'lucide-react'

const Sidebar = () => {
  const { t, i18n } = useTranslation()
  const lang = i18n.language as 'ja' | 'uz'
  const { data: projects } = useProjects()
  const location = useLocation()

  const isActive = (path: string) => location.pathname.includes(path)

  return (
    <aside className="w-full md:w-64 bg-white/70 dark:bg-night/70 backdrop-blur-md border-r border-slate-200/50 dark:border-slate-800/50 p-6 flex flex-col gap-8 h-screen sticky top-0">
      <div className="flex items-center gap-3 px-2">
        <img 
          src="/logo.png" 
          alt="Logo" 
          className="w-20 h-20 object-contain"
          onError={(e) => {
            e.currentTarget.style.display = 'none'
            e.currentTarget.nextElementSibling?.classList.remove('hidden')
          }}
        />
        <div className="hidden w-8 h-8 rounded-xl bg-gradient-to-br from-teal to-blue-600 flex items-center justify-center text-white shadow-lg shadow-teal/20">
          <LayoutDashboard className="w-5 h-5" />
        </div>
        <div className="text-lg font-bold text-ink dark:text-white leading-tight tracking-tight">
          {t('appName')}
        </div>
      </div>

      <nav className="space-y-1">
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 mb-2">
          Main
        </div>
        <Link
          to="/app/projects"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
            location.pathname === '/app/projects'
              ? 'bg-teal/10 text-teal dark:bg-teal/20'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-ink dark:hover:text-slate-200'
          }`}
        >
          <FolderKanban className="w-4 h-4" />
          {t('projects')}
        </Link>
      </nav>

      <nav className="space-y-1 flex-1 overflow-hidden flex flex-col">
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 mb-2 flex items-center justify-between">
          <span>{t('projects')}</span>
          <span className="bg-slate-100 dark:bg-slate-800 text-slate-500 text-[10px] px-1.5 py-0.5 rounded-full">
            {projects?.length || 0}
          </span>
        </div>
        <div className="space-y-1 overflow-y-auto scrollbar-thin pr-1 pb-4">
          {(projects || []).map((project: any) => (
            <Link
              key={project.id}
              to={`/app/projects/${project.id}/tasks`}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                location.pathname.includes(`/projects/${project.id}`)
                  ? 'bg-teal/5 text-teal border-l-2 border-teal'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-ink dark:hover:text-slate-200 border-l-2 border-transparent'
              }`}
            >
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: project.color || '#cbd5e1' }} />
              <span className="truncate">{pickLocalized(project, 'name', lang)}</span>
            </Link>
          ))}
        </div>
      </nav>

      <nav className="space-y-1 mt-auto">
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 mb-2">
          System
        </div>
        <Link
          to="/app/notifications"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
            isActive('/app/notifications')
              ? 'bg-amber/10 text-amber dark:bg-amber/20'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-ink dark:hover:text-slate-200'
          }`}
        >
          <Bell className="w-4 h-4" />
          {t('notifications')}
        </Link>
        <Link
          to="/app/settings"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
            isActive('/app/settings')
              ? 'bg-slate-100 text-ink dark:bg-slate-800 dark:text-white'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-ink dark:hover:text-slate-200'
          }`}
        >
          <Settings className="w-4 h-4" />
          {t('settings')}
        </Link>
      </nav>
    </aside>
  )
}

export default Sidebar
