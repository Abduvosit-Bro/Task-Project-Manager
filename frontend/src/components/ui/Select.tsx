import React from 'react'

const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = ({ className = '', ...props }) => {
  return (
    <select
      className={`w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-3 text-sm text-ink dark:text-white focus:outline-none focus:ring-2 focus:ring-teal/50 focus:border-transparent transition-all shadow-sm cursor-pointer ${className}`}
      {...props}
    />
  )
}

export default Select
