import React from 'react'
import { X, AlertTriangle } from 'lucide-react'

interface ConfirmationModalProps {
  isOpen: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  confirmButtonStyle?: 'danger' | 'primary'
  onConfirm: () => void
  onCancel: () => void
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmButtonStyle = 'primary',
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null

  const confirmButtonClasses =
    confirmButtonStyle === 'danger'
      ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
      : 'bg-purple-600 hover:bg-purple-700 focus:ring-purple-500'

  return (
    <div className='fixed inset-0 z-50 overflow-y-auto'>
      {/* Backdrop */}
      <div
        className='fixed inset-0 bg-black bg-opacity-50 transition-opacity'
        onClick={onCancel}
      />

      {/* Modal */}
      <div className='flex min-h-full items-center justify-center p-4 text-center sm:p-0'>
        <div className='relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg'>
          {/* Header */}
          <div className='bg-white dark:bg-gray-800 px-4 pb-4 pt-5 sm:p-6 sm:pb-4'>
            <div className='sm:flex sm:items-start'>
              {/* Icon */}
              <div className='mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20 sm:mx-0 sm:h-10 sm:w-10'>
                <AlertTriangle className='h-6 w-6 text-red-600 dark:text-red-400' />
              </div>

              {/* Content */}
              <div className='mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left flex-1'>
                <h3 className='text-base font-semibold leading-6 text-gray-900 dark:text-white'>
                  {title}
                </h3>
                <div className='mt-2'>
                  <p className='text-sm text-gray-500 dark:text-gray-400'>
                    {message}
                  </p>
                </div>
              </div>

              {/* Close button */}
              <button
                onClick={onCancel}
                className='absolute right-4 top-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
              >
                <X className='h-5 w-5' />
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className='bg-gray-50 dark:bg-gray-700/50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6'>
            <button
              type='button'
              onClick={onConfirm}
              className={`inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm sm:ml-3 sm:w-auto focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${confirmButtonClasses}`}
            >
              {confirmText}
            </button>
            <button
              type='button'
              onClick={onCancel}
              className='mt-3 inline-flex w-full justify-center rounded-md bg-white dark:bg-gray-600 px-3 py-2 text-sm font-semibold text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-500 hover:bg-gray-50 dark:hover:bg-gray-500 sm:mt-0 sm:w-auto transition-colors'
            >
              {cancelText}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConfirmationModal
