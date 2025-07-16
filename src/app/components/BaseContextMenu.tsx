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

  // Smart positioning to avoid viewport edges
  const menuWidth = 200
  const menuHeight = 200 // Approximate height
  const padding = 16 // Minimum distance from edges

  let adjustedX = position.x
  let adjustedY = position.y

  // Horizontal positioning
  if (position.x + menuWidth + padding > window.innerWidth) {
    // If menu would overflow right edge, position to the left of click
    adjustedX = position.x - menuWidth - padding
    // Ensure we don't go off the left edge
    adjustedX = Math.max(padding, adjustedX)
  } else {
    // Normal positioning, but ensure minimum padding from right edge
    adjustedX = Math.min(position.x, window.innerWidth - menuWidth - padding)
  }

  // Vertical positioning
  if (position.y + menuHeight + padding > window.innerHeight) {
    // If menu would overflow bottom edge, position above click
    adjustedY = position.y - menuHeight - padding
    // Ensure we don't go off the top edge
    adjustedY = Math.max(padding, adjustedY)
  } else {
    // Normal positioning, but ensure minimum padding from bottom edge
    adjustedY = Math.min(position.y, window.innerHeight - menuHeight - padding)
  }
  const adjustedPosition = {
    x: adjustedX,
    y: adjustedY,
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

