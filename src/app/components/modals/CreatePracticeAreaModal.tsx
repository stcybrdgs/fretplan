import React, { useState } from 'react'
import { BaseModal } from './BaseModal'
import { PracticeArea } from '@/types'

interface CreatePracticeAreaModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (name: string, color: PracticeArea['color']) => void
}

export const CreatePracticeAreaModal: React.FC<
  CreatePracticeAreaModalProps
> = ({ isOpen, onClose, onSave }) => {
  const [name, setName] = useState('')
  const [color, setColor] = useState<PracticeArea['color']>('purple')
  const [nameError, setNameError] = useState('')

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!name.trim()) {
      setNameError('Practice area name is required')
      return
    }

    if (name.trim().length > 50) {
      setNameError('Practice area name must be 50 characters or less')
      return
    }

    // Save and close
    onSave(name.trim(), color)
    handleClose()
  }

  const handleClose = () => {
    setName('')
    setColor('purple')
    setNameError('')
    onClose()
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value)
    if (nameError) setNameError('') // Clear error when user starts typing
  }

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleClose}
      title='Create Practice Area'
      size='md'
    >
      <form onSubmit={handleSubmit} className='space-y-4'>
        {/* Name input */}
        <div>
          <label
            htmlFor='practice-area-name'
            className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'
          >
            Name
          </label>
          <input
            id='practice-area-name'
            type='text'
            value={name}
            onChange={handleNameChange}
            placeholder='e.g., Daily Practice, Scales & Theory'
            className={`w-full px-3 py-2 border rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors ${
              nameError
                ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                : 'border-gray-300 dark:border-gray-600 focus:ring-purple-500 focus:border-purple-500'
            }`}
            autoFocus
          />
          {nameError && (
            <p className='mt-1 text-sm text-red-600 dark:text-red-400'>
              {nameError}
            </p>
          )}
        </div>

        {/* Color picker */}
        <div>
          <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
            Color
          </label>
          <div className='flex flex-wrap gap-2'>
            {colors.map((colorOption) => (
              <button
                key={colorOption.value}
                type='button'
                onClick={() =>
                  setColor(colorOption.value as PracticeArea['color'])
                }
                className={`w-8 h-8 rounded-full transition-all duration-200 hover:scale-110 focus:scale-110 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${
                  colorOption.class
                } ${
                  color === colorOption.value
                    ? 'ring-2 ring-gray-400 dark:ring-gray-300 scale-105'
                    : ''
                }`}
                title={colorOption.name}
                aria-label={`Select ${colorOption.name} color`}
              />
            ))}
          </div>
        </div>

        {/* Footer buttons */}
        <div className='flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700'>
          <button
            type='button'
            onClick={handleClose}
            className='px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors'
          >
            Cancel
          </button>
          <button
            type='submit'
            className='px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors'
          >
            Create Practice Area
          </button>
        </div>
      </form>
    </BaseModal>
  )
}

