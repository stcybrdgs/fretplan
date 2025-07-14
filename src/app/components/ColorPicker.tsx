import React, { useEffect, useRef } from 'react'
import { ColorPickerProps } from '@/types'

const ColorPicker: React.FC<ColorPickerProps> = ({
  isOpen,
  position,
  currentColor,
  onColorSelect,
  onClose,
}) => {
  const pickerRef = useRef<HTMLDivElement>(null)

  // Available colors (same as your existing color system)
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
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node)
      ) {
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

  // Calculate position to keep picker in viewport
  const adjustedPosition = {
    x: Math.min(position.x, window.innerWidth - 200), // 200px picker width
    y: Math.min(position.y, window.innerHeight - 120), // 120px picker height
  }

  return (
    <div
      ref={pickerRef}
      className='fixed z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3'
      style={{
        left: adjustedPosition.x,
        top: adjustedPosition.y,
        minWidth: '180px',
      }}
    >
      {/* Color Grid */}
      <div className='grid grid-cols-5 gap-2'>
        {colors.map((color) => (
          <button
            key={color.value}
            onClick={() => {
              onColorSelect(color.value)
              onClose()
            }}
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
  )
}

export default ColorPicker
