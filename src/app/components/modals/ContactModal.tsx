// components/modals/ContactModal.tsx
import React, { useState } from 'react'
import { BaseModal } from './BaseModal'
import { Mail, Send, Check, AlertCircle } from 'lucide-react'

interface ContactModalProps {
  isOpen: boolean
  onClose: () => void
}

type SubmissionStatus = 'idle' | 'submitting' | 'success' | 'error'

export const ContactModal: React.FC<ContactModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [status, setStatus] = useState<SubmissionStatus>('idle')

  const FORMSPREE_ENDPOINT = 'https://formspree.io/f/meozqngo'

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required'
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required'
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setStatus('submitting')

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
          _replyto: formData.email, // Formspree will use this for reply-to
        }),
      })

      if (response.ok) {
        setStatus('success')
        // Reset form after 2 seconds and close modal
        setTimeout(() => {
          handleClose()
        }, 2000)
      } else {
        setStatus('error')
      }
    } catch (error) {
      console.error('Form submission error:', error)
      setStatus('error')
    }
  }

  const handleClose = () => {
    setFormData({ name: '', email: '', subject: '', message: '' })
    setErrors({})
    setStatus('idle')
    onClose()
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }))
    }
  }

  // Success state
  if (status === 'success') {
    return (
      <BaseModal
        isOpen={isOpen}
        onClose={handleClose}
        title='Message Sent!'
        size='md'
      >
        <div className='text-center py-6'>
          <div className='mx-auto flex items-center justify-center w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/20 mb-4'>
            <Check className='w-6 h-6 text-green-600 dark:text-green-400' />
          </div>
          <h3 className='text-lg font-medium text-gray-900 dark:text-white mb-2'>
            Thanks for reaching out!
          </h3>
          <p className='text-gray-600 dark:text-gray-400'>
            I&apos;ll get back to you as soon as possible at{' '}
            <strong>{formData.email}</strong>
          </p>
        </div>
      </BaseModal>
    )
  }

  // Error state
  if (status === 'error') {
    return (
      <BaseModal
        isOpen={isOpen}
        onClose={handleClose}
        title='Message Failed'
        size='md'
      >
        <div className='text-center py-6'>
          <div className='mx-auto flex items-center justify-center w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/20 mb-4'>
            <AlertCircle className='w-6 h-6 text-red-600 dark:text-red-400' />
          </div>
          <h3 className='text-lg font-medium text-gray-900 dark:text-white mb-2'>
            Something went wrong
          </h3>
          <p className='text-gray-600 dark:text-gray-400 mb-4'>
            Please try again or email me directly at{' '}
            <a
              href='mailto:stacy@frettime.com'
              className='text-purple-600 dark:text-purple-400 hover:underline'
            >
              stacy@frettime.com
            </a>
          </p>
          <button
            onClick={() => setStatus('idle')}
            className='px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-lg hover:bg-purple-700 transition-colors'
          >
            Try Again
          </button>
        </div>
      </BaseModal>
    )
  }

  // Main form
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleClose}
      title='Get in Touch'
      size='lg'
    >
      <div className='mb-4'>
        <div className='flex items-center space-x-2 text-gray-600 dark:text-gray-400'>
          <Mail className='w-4 h-4' />
          <span className='text-sm'>
            Send me a message and I&apos;ll get back to you soon!
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className='space-y-4'>
        {/* Name and Email row */}
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
          <div>
            <label
              htmlFor='contact-name'
              className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
            >
              Name *
            </label>
            <input
              id='contact-name'
              type='text'
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors ${
                errors.name
                  ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                  : 'border-gray-300 dark:border-gray-600 focus:ring-purple-500 focus:border-purple-500'
              }`}
              placeholder='Your name'
              autoFocus
            />
            {errors.name && (
              <p className='mt-1 text-sm text-red-600 dark:text-red-400'>
                {errors.name}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor='contact-email'
              className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
            >
              Email *
            </label>
            <input
              id='contact-email'
              type='email'
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors ${
                errors.email
                  ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                  : 'border-gray-300 dark:border-gray-600 focus:ring-purple-500 focus:border-purple-500'
              }`}
              placeholder='your@email.com'
            />
            {errors.email && (
              <p className='mt-1 text-sm text-red-600 dark:text-red-400'>
                {errors.email}
              </p>
            )}
          </div>
        </div>

        {/* Subject */}
        <div>
          <label
            htmlFor='contact-subject'
            className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
          >
            Subject *
          </label>
          <input
            id='contact-subject'
            type='text'
            value={formData.subject}
            onChange={(e) => handleInputChange('subject', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors ${
              errors.subject
                ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                : 'border-gray-300 dark:border-gray-600 focus:ring-purple-500 focus:border-purple-500'
            }`}
            placeholder="What's this about?"
          />
          {errors.subject && (
            <p className='mt-1 text-sm text-red-600 dark:text-red-400'>
              {errors.subject}
            </p>
          )}
        </div>

        {/* Message */}
        <div>
          <label
            htmlFor='contact-message'
            className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
          >
            Message *
          </label>
          <textarea
            id='contact-message'
            rows={4}
            value={formData.message}
            onChange={(e) => handleInputChange('message', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors resize-vertical ${
              errors.message
                ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                : 'border-gray-300 dark:border-gray-600 focus:ring-purple-500 focus:border-purple-500'
            }`}
            placeholder='Tell me about your project, question, or just say hi!'
          />
          {errors.message && (
            <p className='mt-1 text-sm text-red-600 dark:text-red-400'>
              {errors.message}
            </p>
          )}
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
            disabled={status === 'submitting'}
            className='px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2'
          >
            {status === 'submitting' ? (
              <>
                <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin' />
                <span>Sending...</span>
              </>
            ) : (
              <>
                <Send className='w-4 h-4' />
                <span>Send Message</span>
              </>
            )}
          </button>
        </div>
      </form>
    </BaseModal>
  )
}

