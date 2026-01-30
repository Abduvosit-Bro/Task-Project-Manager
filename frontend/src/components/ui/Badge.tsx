import React from 'react'

export type BadgeTone = 'neutral' | 'success' | 'warning' | 'critical' | 'info' | 'primary'

const Badge: React.FC<{ label: string; tone?: BadgeTone }> = ({ label, tone = 'neutral' }) => {
  const toneMap: Record<BadgeTone, string> = {
    neutral: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700',
    success: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20',
    warning: 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400 border-amber-100 dark:border-amber-500/20',
    critical: 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400 border-rose-100 dark:border-rose-500/20',
    info: 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 border-blue-100 dark:border-blue-500/20',
    primary: 'bg-teal-50 text-teal-600 dark:bg-teal-500/10 dark:text-teal-400 border-teal-100 dark:border-teal-500/20',
  }

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${toneMap[tone]} whitespace-nowrap`}>
      {label}
    </span>
  )
}

export default Badge
