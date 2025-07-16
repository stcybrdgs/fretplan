import React, { useEffect, useRef } from 'react'

interface BaseContextMenuProps {
  isOpen: boolean
  position: { x: number; y: number }
  onClose: () => void
  children: React.ReactNode
  className?: string
}

export const BaseContextMenu: React.FC<BaseContextMenuProps> = ({
  isOpen,
  position,
  onClose,
  children,
  className = '',
}) => {
  const menuRef = useRef<HTMLDivElement>(null)

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

  return (
    <div
      ref={menuRef}
      className={`fixed z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden ${className}`}
      style={{
        left: adjustedPosition.x,
        top: adjustedPosition.y,
        minWidth: '180px',
      }}
    >
      {children}
    </div>
  )
}
