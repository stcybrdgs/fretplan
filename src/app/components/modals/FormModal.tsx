import React, { useState } from 'react'
import { BaseModal } from './BaseModal'

interface FormModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: any) => void
  title: string
  saveButtonText?: string
  cancelButtonText?: string
  isLoading?: boolean
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

export const FormModal: React.FC<FormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  title,
  saveButtonText = 'Save',
  cancelButtonText = 'Cancel',
  isLoading = false,
  children,
  size = 'md',
}) => {
  const [formData, setFormData] = useState<any>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  const handleClose = () => {
    setFormData({}) // Reset form data
    onClose()
  }

  return (
    <BaseModal isOpen={isOpen} onClose={handleClose} title={title} size={size}>
      <form onSubmit={handleSubmit} className='space-y-4'>
        {/* Pass form data and setter to children */}
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, {
              formData,
              setFormData,
            } as any)
          }
          return child
        })}

        {/* Footer buttons */}
        <div className='flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700'>
          <button
            type='button'
            onClick={handleClose}
            className='px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors'
          >
            {cancelButtonText}
          </button>
          <button
            type='submit'
            disabled={isLoading}
            className='px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
          >
            {isLoading ? 'Saving...' : saveButtonText}
          </button>
        </div>
      </form>
    </BaseModal>
  )
}
