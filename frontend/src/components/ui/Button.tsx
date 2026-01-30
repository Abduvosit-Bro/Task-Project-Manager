import React from 'react'

const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ className = '', ...props }) => {
  return (
    <button
      className={`px-4 py-2 rounded-xl bg-teal text-white hover:bg-teal/90 dark:bg-teal dark:text-white shadow-lg shadow-teal/20 active:scale-95 transition-all duration-200 font-medium text-sm ${className}`}
      {...props}
    />
  )
}

export default Button
