import React from 'react'

interface ColorPickerSectionProps {
  currentColor: string
  onColorSelect: (color: string) => void
}

export const ColorPickerSection: React.FC<ColorPickerSectionProps> = ({
  currentColor,
  onColorSelect,
}) => {
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

  return (
    <div className='p-3'>
      <div className='text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2'>
        Color
      </div>
      <div className='grid grid-cols-5 gap-2'>
        {colors.map((color) => (
          <button
            key={color.value}
            onClick={() => onColorSelect(color.value)}
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
