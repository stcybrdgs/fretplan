import React, { useEffect, useRef } from 'react'
import { Edit3, Trash2 } from 'lucide-react'

interface ContextMenuProps {
  isOpen: boolean
  position: { x: number; y: number }
  currentColor: string
  onColorSelect: (color: string) => void
  onRename: () => void
  onDelete: () => void
  onClose: () => void
}

const ContextMenu: React.FC<ContextMenuProps> = ({
  isOpen,
  position,
  currentColor,
  onColorSelect,
  onRename,
  onDelete,
  onClose,
}) => {
  const menuRef = useRef<HTMLDivElement>(null)

  // Available colors
  const colors = [
    { name: 'red', class: 'bg-red-600', value: 'red' },
    { name: 'orange', class: 'bg-orange-600', value: 'orange' },
    { name: 'yellow', class: 'bg-yellow-500', value: 'yellow' },
    { name: 'green', class: 'bg-green-600', value: 'green' },
    { name: 'teal', class: 'bg-teal-600', value: 'teal' },
    { name: 'blue', class: 'bg-blue-600', value: 'blue' },
    { name: 'indigo', class: 'bg-indigo-600', value: 'indigo' },
    { name: 'purple', class: 'bg-purple-600', value: 'purple' },
    { name: 'pink', class: 'bg-pink-600', value: 'pink' },
    { name: 'gray', class: 'bg-gray-600', value: 'gray' },
  ]

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  // Calculate position to keep menu in viewport
  const adjustedPosition = {
    x: Math.min(position.x, window.innerWidth - 200), // 200px menu width
    y: Math.min(position.y, window.innerHeight - 200), // Approximate menu height
  }

  // Handle color selection with debugging
  const handleColorClick = (colorValue: string) => {
    console.log('Color clicked:', colorValue)
    onColorSelect(colorValue)
    // Don't close immediately - let the parent handle closing
  }

  // Handle rename with debugging
  const handleRenameClick = () => {
    console.log('Rename clicked')
    onRename()
    // Don't close immediately - let the parent handle closing
  }

  // Handle delete with debugging
  const handleDeleteClick = () => {
    console.log('Delete clicked')
    onDelete()
    // Don't close immediately - let the parent handle closing
  }

  return (
    <div
      ref={menuRef}
      className='fixed z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden'
      style={{
        left: adjustedPosition.x,
        top: adjustedPosition.y,
        minWidth: '180px',
      }}
    >
      {/* Color Section */}
      <div className='p-3'>
        <div className='text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2'>
          Color
        </div>
        <div className='grid grid-cols-5 gap-2'>
          {colors.map((color) => (
            <button
              key={color.value}
              onClick={() => handleColorClick(color.value)}
              className={`
                w-6 h-6 rounded-full transition-all duration-200 hover:scale-110 focus:scale-110 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800
                ${color.class}
                ${
                  currentColor === color.value
                    ? 'ring-2 ring-gray-400 dark:ring-gray-300 scale-105'
                    : ''
                }
              `}
              title={color.name}
              aria-label={`Select ${color.name} color`}
            />
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className='border-t border-gray-200 dark:border-gray-700' />

      {/* Actions Section */}
      <div className='p-1'>
        <button
          onClick={handleRenameClick}
          className='w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors rounded'
        >
          <Edit3 className='w-4 h-4' />
          <span>Rename</span>
        </button>

        <button
          onClick={handleDeleteClick}
          className='w-full flex items-center space-x-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors rounded'
        >
          <Trash2 className='w-4 h-4' />
          <span>Delete</span>
        </button>
      </div>
    </div>
  )
}

export default ContextMenu

