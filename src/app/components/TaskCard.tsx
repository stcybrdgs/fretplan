import {
  ChevronDown,
  ChevronRight,
  Play,
  Square,
  MoreVertical,
} from 'lucide-react'
import { TaskCard as TaskCardType, Todo, AreaType } from '@/types'
import ScrollableText from './ScrollableText'
import { getColorClass } from '@/utils/colorUtils'

interface TaskCardProps {
  card: TaskCardType
  areaId: string
  areaName: string
  areaType: AreaType
  isSelected?: boolean // prop to indicate if this card's context menu is open
  isTimerActiveForTodo: (todoId: string) => boolean
  formatTime: (milliseconds: number) => string
  getDisplayTimeForTodo: (todoId: string) => number
  onToggleCard: () => void
  onAddTodo: (name: string) => void
  onToggleTodo: (todoId: string) => void
  onStartTimer: (
    areaId: string,
    areaName: string,
    areaType: AreaType,
    taskCardId: string,
    taskCardName: string,
    todoId: string,
    todoName: string
  ) => void
  onStopTimer: () => void
  onOpenContextMenu: (
    e: React.MouseEvent,
    targetId: string,
    targetType: 'task-card',
    targetName: string,
    currentColor: string,
    areaId: string,
    areaType: AreaType
  ) => void
  editingAreaId: string | null
  editingName: string
  setEditingName: (name: string) => void
  onFinishRename: (id: string, itemType: 'task-card') => void
  onCancelRename: () => void
}

const TaskCard: React.FC<TaskCardProps> = ({
  card,
  areaId,
  areaName,
  areaType,
  isSelected = false, // Default to false
  isTimerActiveForTodo,
  formatTime,
  getDisplayTimeForTodo,
  onToggleCard,
  onAddTodo,
  onToggleTodo,
  onStartTimer,
  onStopTimer,
  onOpenContextMenu,
  editingAreaId,
  editingName,
  setEditingName,
  onFinishRename,
  onCancelRename,
}) => {
  return (
    <div
      className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm transition-all duration-300 ease-in-out ${
        isSelected
          ? 'ring-1 ring-purple-500 dark:ring-purple-400 shadow-lg border-purple-300 dark:border-purple-600'
          : 'hover:shadow-md hover:border-purple-200 dark:hover:border-purple-700'
      }`}
    >
      {/* Task Card Header */}
      <div
        // className={`p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 flex items-center justify-between transition-all duration-200 ease-in-out ${
        className={`p-4 cursor-pointer flex items-center justify-between transition-all duration-200 ease-in-out ${
          card.isExpanded
            ? 'border-b border-gray-200 dark:border-gray-700 rounded-t-lg'
            : 'rounded-lg'
        } ${
          isSelected
            ? 'bg-purple-50 dark:bg-purple-900/20'
            : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
        }`}
        onClick={onToggleCard}
      >
        <div className='flex items-center space-x-3'>
          {/* color dot */}
          <span
            className={`w-3 h-3 ${getColorClass(
              card.color
            )} rounded-full transition-transform duration-200 ${
              card.isExpanded ? 'scale-110' : 'scale-100'
            }`}
          ></span>

          {/* Inline editing or display name for task card */}
          {editingAreaId === card.id ? (
            <input
              type='text'
              value={editingName}
              onChange={(e) => setEditingName(e.target.value)}
              onBlur={() => onFinishRename(card.id, 'task-card')}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  onFinishRename(card.id, 'task-card')
                } else if (e.key === 'Escape') {
                  onCancelRename()
                }
              }}
              className='flex-1 bg-transparent border-b border-purple-500 outline-none text-gray-900 dark:text-white text-lg font-medium'
              autoFocus
              onFocus={(e) => e.target.select()}
            />
          ) : (
            <ScrollableText>
              <h3 className='text-lg font-medium text-gray-900 dark:text-white transition-colors duration-200'>
                {card.name}
              </h3>
            </ScrollableText>
          )}
        </div>
        <div className='flex'>
          {/* context menu button */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              onOpenContextMenu(
                e,
                card.id,
                'task-card',
                card.name,
                card.color,
                areaId,
                areaType
              )
            }}
            className='group mr-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors flex-shrink-0'
            title='More options'
          >
            <MoreVertical className='w-4 h-4 group-hover:scale-125 transition-all duration-300' />
          </button>

          {/* chevron */}
          <button
            className={`group text-gray-500 dark:text-gray-400  hover:text-gray-900 dark:hover:text-white  transition-transform duration-300 ease-in-out ${
              card.isExpanded ? 'rotate-0' : 'rotate-0'
            }`}
          >
            {card.isExpanded ? (
              <ChevronDown className='w-5 h-5 group-hover:scale-125 transition-all duration-300' />
            ) : (
              <ChevronRight className='w-5 h-5 group-hover:scale-125 transition-all duration-300' />
            )}
          </button>
        </div>
      </div>

      {/* Card content with smooth expand/collapse */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          card.isExpanded ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className='p-4 space-y-3'>
          {/* Todos */}
          {card.todos.length === 0 ? (
            <div className='text-gray-500 dark:text-gray-400 italic text-sm py-2'>
              No tasks yet...
            </div>
          ) : (
            card.todos.map((todo: Todo) => (
              <div
                key={todo.id}
                className={`flex items-center space-x-3 transition-all duration-300 ease-in-out rounded-lg p-2 -mx-2 ${
                  isTimerActiveForTodo(todo.id)
                    ? 'bg-purple-50 dark:bg-purple-900/10 ring-2 ring-purple-200 dark:ring-purple-800 shadow-sm'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                }`}
              >
                <input
                  type='checkbox'
                  checked={todo.completed}
                  onChange={() => {
                    // If this todo has an active timer and is being completed, stop the timer
                    if (!todo.completed && isTimerActiveForTodo(todo.id)) {
                      onStopTimer()
                    }
                    onToggleTodo(todo.id)
                  }}
                  className='w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500'
                />

                {/* Todo content with timer */}
                <div className='flex-1 flex items-center justify-between min-w-0'>
                  <ScrollableText className='flex-shrink-0 cursor-pointer'>
                    <span
                      className={`transition-all duration-300 ${
                        todo.completed
                          ? 'text-gray-500 dark:text-gray-400 line-through'
                          : 'text-gray-900 dark:text-white'
                      }`}
                    >
                      {todo.name}
                    </span>
                  </ScrollableText>

                  {/* Timer display and controls */}
                  <div className='flex items-center space-x-2 sm:space-x-3 flex-shrink-0'>
                    {/* Timer display - show time if this todo has active timer, grayed out if completed */}
                    <span
                      className={`font-mono text-xs sm:text-sm transition-all duration-300 ${
                        todo.completed
                          ? 'text-gray-400 dark:text-gray-500'
                          : isTimerActiveForTodo(todo.id)
                          ? 'text-purple-600 dark:text-purple-400 font-semibold animate-pulse'
                          : 'text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      {formatTime(getDisplayTimeForTodo(todo.id))}
                    </span>

                    {/* Timer control - single icon toggle, disabled if completed */}
                    <button
                      onClick={() => {
                        if (todo.completed) return // Don't allow timer actions on completed todos

                        if (isTimerActiveForTodo(todo.id)) {
                          onStopTimer()
                        } else {
                          onStartTimer(
                            areaId,
                            areaName,
                            areaType,
                            card.id,
                            card.name,
                            todo.id,
                            todo.name
                          )
                        }
                      }}
                      disabled={todo.completed}
                      className={`p-2 rounded-lg transition-all duration-200 transform touch-manipulation ${
                        todo.completed
                          ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed scale-95 opacity-50'
                          : isTimerActiveForTodo(todo.id)
                          ? 'text-red-600 bg-red-300/30 dark:bg-red-900/20 hover:bg-red-600/20 dark:hover:bg-red-900/40 cursor-pointer hover:scale-105 active:scale-95 shadow-sm'
                          : 'text-green-600 hover:bg-green-600/20 dark:hover:bg-green-900/60 cursor-pointer hover:scale-105 active:scale-95 shadow-sm'
                      }`}
                      title={
                        todo.completed
                          ? 'Timer disabled for completed tasks'
                          : isTimerActiveForTodo(todo.id)
                          ? 'Stop timer'
                          : 'Start timer'
                      }
                    >
                      <div
                        className={`transition-transform duration-200 ${
                          isTimerActiveForTodo(todo.id) ? 'animate-pulse' : ''
                        }`}
                      >
                        {isTimerActiveForTodo(todo.id) ? (
                          <Square className='w-3 h-3 sm:w-4 sm:h-4' />
                        ) : (
                          <Play className='w-4 h-4' />
                        )}
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}

          {/* Add new todo */}
          <div className='flex items-center space-x-2 mt-4 pt-3 border-t border-gray-200 dark:border-gray-700'>
            <input
              type='text'
              placeholder='Add new task...'
              className='flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent'
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  const input = e.target as HTMLInputElement
                  onAddTodo(input.value)
                  input.value = ''
                }
              }}
            />
            <button
              onClick={(e) => {
                const input = (e.target as HTMLElement)
                  .previousElementSibling as HTMLInputElement
                onAddTodo(input.value)
                input.value = ''
              }}
              className='bg-primary hover:bg-primary-hover text-white px-3 py-2 rounded text-sm transition-colors'
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TaskCard

