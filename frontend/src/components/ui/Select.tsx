import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check } from 'lucide-react'

interface Option {
  value: string | number
  label: string
}

interface SelectProps {
  value: string | number
  onChange: (value: string) => void
  options: Option[]
  placeholder?: string
  className?: string
}

const Select = ({ value, onChange, options, placeholder = '-', className = '' }: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const selectedOption = options.find((opt) => String(opt.value) === String(value))

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-3 text-sm text-ink dark:text-white focus:outline-none focus:ring-2 focus:ring-teal/50 focus:border-transparent transition-all shadow-sm hover:border-teal/30"
      >
        <span className={!selectedOption ? 'text-slate-400' : ''}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-100 dark:border-slate-800 max-h-60 overflow-auto focus:outline-none animate-in fade-in zoom-in-95 duration-100">
          <div className="p-1">
            {options.map((option) => (
              <div
                key={option.value}
                onClick={() => {
                  onChange(String(option.value))
                  setIsOpen(false)
                }}
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm cursor-pointer transition-colors ${
                  String(option.value) === String(value)
                    ? 'bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400 font-medium'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <span>{option.label}</span>
                {String(option.value) === String(value) && (
                  <Check className="w-4 h-4" />
                )}
              </div>
            ))}
            {options.length === 0 && (
              <div className="px-3 py-2 text-sm text-slate-400 text-center">
                No options
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Select
