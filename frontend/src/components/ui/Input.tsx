import React from 'react'

const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({ className = '', ...props }) => {
  return (
    <input
      className={`w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-3 text-sm text-ink dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal/50 focus:border-transparent transition-all shadow-sm ${className}`}
      {...props}
    />
  )
}

export default Input
