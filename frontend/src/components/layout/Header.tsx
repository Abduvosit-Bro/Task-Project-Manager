import { useTranslation } from 'react-i18next'
import { useAuth } from '../../hooks/useAuth'
import { useState, useEffect } from 'react'
import MyProfileModal from '../common/MyProfileModal'
import { Sun, Moon, Globe, LogOut, User } from 'lucide-react'

const Header = () => {
  const { i18n, t } = useTranslation()
  const { logout, user } = useAuth()
  const [profileOpen, setProfileOpen] = useState(false)
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    // Initialize state on mount
    const root = document.documentElement
    setIsDark(root.classList.contains('dark'))
  }, [])

  const toggleLanguage = () => {
    const order = ['ja', 'uz'] as const
    const currentIndex = order.indexOf(i18n.language as (typeof order)[number])
    const next = order[(currentIndex + 1) % order.length]
    void i18n.changeLanguage(next)
    localStorage.setItem('ui_language', next)
  }

  const toggleTheme = () => {
    const root = document.documentElement
    const isCurrentlyDark = root.classList.contains('dark')
    
    if (isCurrentlyDark) {
      root.classList.remove('dark')
      localStorage.setItem('theme', 'light')
      setIsDark(false)
    } else {
      root.classList.add('dark')
      localStorage.setItem('theme', 'dark')
      setIsDark(true)
    }
  }

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-slate-200/50 dark:border-slate-800/50 bg-white/70 dark:bg-night/70 backdrop-blur-md sticky top-0 z-40 transition-colors duration-300">
      <div className="text-sm font-semibold text-ink dark:text-white tracking-tight flex items-center gap-2">
        <img 
          src="/logo.png" 
          alt="Logo" 
          className="w-12 h-12 object-contain"
          onError={(e) => {
            e.currentTarget.style.display = 'none'
            e.currentTarget.nextElementSibling?.classList.remove('hidden')
          }}
        />
        <div className="hidden w-2 h-2 rounded-full bg-teal shadow-[0_0_8px_rgba(20,184,166,0.6)]"></div>
        {t('appName')}
      </div>
      
      <div className="flex items-center gap-3">
        <button
          onClick={toggleLanguage}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-xs font-medium"
          title={t('language')}
        >
          <Globe className="w-3.5 h-3.5" />
          <span>{i18n.language.toUpperCase()}</span>
        </button>

        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-amber-100 dark:hover:bg-slate-700 hover:text-amber-600 dark:hover:text-yellow-400 transition-all duration-300"
          title={isDark ? "Light Mode" : "Dark Mode"}
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-1"></div>

        <button
          onClick={() => setProfileOpen((prev) => !prev)}
          className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group"
        >
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-teal to-blue-500 text-white flex items-center justify-center text-xs font-bold shadow-sm group-hover:shadow-md transition-all">
            {user?.display_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || <User className="w-4 h-4" />}
          </div>
          <span className="text-xs font-medium text-ink dark:text-white hidden md:block">
             {user?.display_name || user?.first_name || 'Profile'}
          </span>
        </button>

        <button
          onClick={() => logout()}
          className="p-2 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20 transition-colors"
          title={t('logout')}
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
      <MyProfileModal open={profileOpen} onClose={() => setProfileOpen(false)} user={user} />
    </header>
  )
}

export default Header
