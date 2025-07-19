import React from 'react'
import { Square, ArrowRight } from 'lucide-react'
import { ActiveTimer } from '@/types'

interface GlobalTimerBarProps {
  activeTimer: ActiveTimer | null
  currentTime: string
  onStopTimer: () => void
  onGoToTimer: () => void
}

export const GlobalTimerBar: React.FC<GlobalTimerBarProps> = ({
  activeTimer,
  currentTime,
  onStopTimer,
  onGoToTimer,
}) => {
  if (!activeTimer) {
    return null
  }

  return (
    <div className='fixed bottom-0 left-0 right-0 z-50 bg-red-400 text-white'>
      <div className='flex items-center justify-between px-4 py-1 max-w-7xl mx-auto'>
        {/* Timer Info */}
        <div className='flex items-center space-x-3 min-w-0 flex-1 mr-3'>
          {/* Pulsing indicator */}
          <div className='w-3 h-3 bg-red-600 rounded-full animate-pulse flex-shrink-0'></div>

          {/* Timer details */}
          <div className='min-w-0 flex-1'>
            <div className='flex flex-col sm:flex-row sm:items-center sm:space-x-2'>
              <div className='font-mono text-md font-semibold'>
                {currentTime}
              </div>
              <div className='text-sm text-gray-100 truncate'>
                <span className='font-medium'>{activeTimer?.todoName}</span>
                <span className='hidden sm:inline'>
                  {' '}
                  in {activeTimer?.areaName}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className='flex items-center space-x-2 flex-shrink-0'>
          {/* Go To Button */}
          <button
            onClick={onGoToTimer}
            className='flex items-center space-x-1 px-2 py-1.5 border border-transparent hover:border-white rounded-md transition-colors text-sm font-medium'
            title='Go to active timer'
          >
            <ArrowRight className='w-4 h-4' />
            <span className='hidden sm:inline'>Go To</span>
          </button>

          {/* Stop Button */}
          <button
            onClick={onStopTimer}
            className='flex items-center space-x-1 px-2 py-1.5 border border-transparent bg-white text-red-400 hover:border-red-400 hover:bg-[#ffdfdf] hover:text-red-500 rounded-md transition-colors text-sm font-medium'
            title='Stop timer'
          >
            <Square className='w-4 h-4' />
            <span className='hidden sm:inline'>Stop</span>
          </button>
        </div>
      </div>
    </div>
  )
}

