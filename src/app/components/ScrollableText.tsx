import React from 'react'

interface ScrollableTextProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
}

const ScrollableText: React.FC<ScrollableTextProps> = ({
  children,
  className = '',
  onClick,
}) => {
  return (
    <div
      className={`
        overflow-x-auto overflow-y-hidden whitespace-nowrap
        w-32 sm:w-44 md:w-52 lg:w-60
        ${className}
      `}
      style={{
        scrollbarWidth: 'thin' /* Firefox - thin scrollbar */,
        scrollbarColor:
          '#9CA3AF transparent' /* Firefox - thumb and track colors */,
      }}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

export default ScrollableText

