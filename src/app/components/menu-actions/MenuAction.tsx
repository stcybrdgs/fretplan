import React from 'react'

interface MenuActionProps {
  icon: React.ReactNode
  label: string
  onClick: () => void
  variant?: 'default' | 'danger'
  className?: string
}

export const MenuAction: React.FC<MenuActionProps> = ({
  icon,
  label,
  onClick,
  variant = 'default',
  className = '',
}) => {
  const baseClasses =
    'w-full flex items-center space-x-2 px-3 py-2 text-sm transition-colors rounded'

  const variantClasses = {
    default:
      'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700',
    danger:
      'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20',
  }

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      {icon}
      <span>{label}</span>
    </button>
  )
}
