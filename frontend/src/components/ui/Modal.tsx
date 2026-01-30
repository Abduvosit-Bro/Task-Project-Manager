import React from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'

const Modal: React.FC<{ title: string; open: boolean; onClose: () => void; children: React.ReactNode }> = ({
  title,
  open,
  onClose,
  children,
}) => {
  if (!open) return null
  
  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="w-full max-w-xl rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-white/20 dark:border-white/10 p-6 shadow-2xl transform transition-all animate-in zoom-in-95 duration-200"
        onClick={(event) => event.stopPropagation()}
        role="presentation"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-slate-800 dark:text-white">{title}</h3>
          <button 
            onClick={onClose} 
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body
  )
}

export default Modal
