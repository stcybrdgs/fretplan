'use client'

import { useState, useEffect } from 'react'
import {
  Menu,
  Sun,
  Moon,
  Mail,
  Plus,
  ChevronDown,
  ChevronRight,
  Play,
  Square,
} from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'

export default function Home() {
  // State for current time (for timer display)
  const [currentTime, setCurrentTime] = useState(new Date())

  // Zustand store
  const {
    practiceAreas,
    projects,
    activePracticeAreaId,
    activeProjectId,
    activeView,
    isSidebarOpen,
    isDarkMode,
    activeTimer,
    setActivePracticeArea,
    setActiveProject,
    setActiveView,
    setSidebarOpen,
    toggleTheme,
    addPracticeArea,
    addProject,
    addTaskCard,
    addTodo,
    toggleTodo,
    toggleTaskCard,
    startTimer,
    stopTimer,
  } = useAppStore()

  // Update current time every second for timer display
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  // Apply theme on component mount (for initial load)
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDarkMode])

  // Timer helper functions
  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000)
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60

    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }

  const getTimerDuration = (timer: typeof activeTimer) => {
    if (!timer) return 0
    return currentTime.getTime() - timer.startTime.getTime()
  }

  const isTimerActiveForTodo = (todoId: string) => {
    return activeTimer?.todoId === todoId && activeTimer?.status === 'running'
  }

  const handleStartTimer = (
    areaId: string,
    areaName: string,
    areaType: 'practice' | 'project',
    taskCardId: string,
    taskCardName: string,
    todoId: string,
    todoName: string
  ) => {
    startTimer(
      areaId,
      areaName,
      areaType,
      taskCardId,
      taskCardName,
      todoId,
      todoName
    )
  }

  const handleStopTimer = () => {
    stopTimer()
  }

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen)
  }

  // Get active area data (either practice area or project)
  const activePracticeArea = practiceAreas.find(
    (area) => area.id === activePracticeAreaId
  )
  const activeProject = projects.find(
    (project) => project.id === activeProjectId
  )
  const activeArea = activePracticeArea || activeProject
  const activeAreaType = activePracticeArea ? 'practice' : 'project'

  // Get color class for practice area dots
  const getColorClass = (color: string) => {
    const colorMap = {
      purple: 'bg-purple-600',
      green: 'bg-green-600',
      orange: 'bg-orange-600',
      blue: 'bg-blue-600',
      red: 'bg-red-600',
    }
    return colorMap[color as keyof typeof colorMap] || 'bg-purple-600'
  }

  // Handle adding new practice area
  const handleAddPracticeArea = () => {
    const name = prompt('Enter practice area name:')
    if (name) {
      addPracticeArea(name, 'purple')
    }
  }

  // Handle adding new project
  const handleAddProject = () => {
    const name = prompt('Enter project name:')
    if (name) {
      addProject(name, 'purple')
    }
  }

  // Handle adding new task card
  const handleAddTaskCard = () => {
    const currentAreaId = activePracticeAreaId || activeProjectId
    if (!currentAreaId) return
    const name = prompt('Enter task card name:')
    if (name) {
      addTaskCard(currentAreaId, name, activeAreaType as 'practice' | 'project')
    }
  }

  // Handle adding new todo
  const handleAddTodo = (areaId: string, taskCardId: string, name: string) => {
    if (name.trim()) {
      addTodo(
        areaId,
        taskCardId,
        name,
        activeAreaType as 'practice' | 'project'
      )
    }
  }

  return (
    <div className='bg-gray-50 dark:bg-gray-900 transition-colors duration-300 min-h-screen'>
      {/* Top Navigation */}
      <nav className='bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 fixed w-full top-0 z-50'>
        <div className='flex items-center justify-between max-w-7xl mx-auto'>
          {/* Logo & Sidebar Toggle */}
          <div className='flex items-center space-x-3'>
            <button
              onClick={toggleSidebar}
              className='w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white hover:bg-primary-hover transition-colors md:hidden'
            >
              <Menu className='w-4 h-4' />
            </button>
            <h1 className='text-xl font-semibold text-primary-custom'>
              FretPlan
            </h1>
          </div>

          {/* Right side controls */}
          <div className='flex items-center space-x-4'>
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className='flex items-center space-x-2 p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors'
            >
              {isDarkMode ? (
                <Sun className='w-4 h-4' />
              ) : (
                <Moon className='w-4 h-4' />
              )}
              <span className='text-sm font-medium hidden md:block'>
                {isDarkMode ? 'Light' : 'Dark'}
              </span>
            </button>

            {/* Contact button */}
            <button className='flex items-center space-x-2 p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors'>
              <Mail className='w-4 h-4' />
              <span className='text-sm font-medium hidden md:block'>
                Contact
              </span>
            </button>
          </div>
        </div>
      </nav>

      <div className='flex pt-16'>
        {/* Sidebar */}
        <aside
          className={`w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-screen fixed left-0 transform transition-transform duration-300 ease-in-out z-40 ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } md:translate-x-0`}
        >
          <div className='p-4 space-y-2'>
            {/* Practice Areas Section */}
            <div className='text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-3 flex items-center justify-between'>
              <span>Practice Areas</span>
              <button
                onClick={handleAddPracticeArea}
                className='text-gray-900 dark:text-white p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors'
              >
                <Plus className='w-4 h-4' />
              </button>
            </div>

            {/* Dynamic Practice Areas */}
            {practiceAreas.map((area) => (
              <button
                key={area.id}
                onClick={() => setActivePracticeArea(area.id)}
                className={`flex items-center space-x-3 w-full text-left p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                  activePracticeAreaId === area.id
                    ? 'bg-purple-50 dark:bg-purple-900/20 text-gray-900 dark:text-white'
                    : 'text-gray-900 dark:text-white'
                }`}
              >
                <span
                  className={`w-2 h-2 ${getColorClass(
                    area.color
                  )} rounded-full`}
                ></span>
                <span>{area.name}</span>
              </button>
            ))}

            {/* Projects Section */}
            <div className='pt-4 mt-4 border-t border-gray-200 dark:border-gray-700'>
              <div className='text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-3 flex items-center justify-between'>
                Projects
                <button
                  onClick={handleAddProject}
                  className='text-gray-900 dark:text-white p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors'
                >
                  <Plus className='w-4 h-4' />
                </button>
              </div>

              {/* Dynamic Projects */}
              {projects.map((project) => (
                <button
                  key={project.id}
                  onClick={() => setActiveProject(project.id)}
                  className={`flex items-center space-x-3 w-full text-left p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                    activeProjectId === project.id
                      ? 'bg-purple-50 dark:bg-purple-900/20 text-gray-900 dark:text-white'
                      : 'text-gray-900 dark:text-white'
                  }`}
                >
                  <span
                    className={`w-2 h-2 ${getColorClass(
                      project.color
                    )} rounded-full`}
                  ></span>
                  <span>{project.name}</span>
                </button>
              ))}
            </div>

            {/* Analyze Section */}
            <div className='pt-4 mt-4 border-t border-gray-200 dark:border-gray-700'>
              <div className='text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-3'>
                Analyze
              </div>
              <button
                onClick={() => setActiveView('dashboard')}
                className='flex items-center space-x-3 w-full text-left text-gray-900 dark:text-white p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 bg-purple-50 dark:bg-purple-900/20 transition-colors'
              >
                <span className='w-2 h-2 bg-purple-600 rounded-full'></span>
                <span>Dashboard</span>
              </button>
            </div>

            {/* Manage Section */}
            <div className='pt-4 mt-4 border-t border-gray-200 dark:border-gray-700'>
              <div className='text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-3'>
                Manage
              </div>
              <button
                onClick={() => setActiveView('tags')}
                className='flex items-center space-x-3 w-full text-left text-gray-900 dark:text-white p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 bg-purple-50 dark:bg-purple-900/20 transition-colors'
              >
                <span className='w-2 h-2 bg-purple-600 rounded-full'></span>
                <span>Tags</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className='flex-1 md:ml-64 p-6 bg-gray-50 dark:bg-gray-900 min-h-screen'>
          <div className='max-w-4xl mx-auto'>
            {(activeView === 'practice-area' ||
              activeView === 'project-area') &&
              activeArea && (
                <>
                  {/* Page Header */}
                  <div className='mb-6'>
                    <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-2'>
                      {activeArea.name}
                    </h2>
                    <p className='text-gray-600 dark:text-gray-400'>
                      {activeView === 'practice-area'
                        ? 'Plan your practice, track your progress'
                        : 'Organize your creative projects'}
                    </p>
                  </div>

                  {/* Add New Card Button */}
                  <div className='mb-6'>
                    <button
                      onClick={handleAddTaskCard}
                      className='bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors'
                    >
                      <Plus className='w-4 h-4' />
                      <span>
                        {activeView === 'practice-area'
                          ? 'Add Practice Card'
                          : 'Add Project Card'}
                      </span>
                    </button>
                  </div>

                  {/* Task Cards */}
                  <div className='space-y-4'>
                    {activeArea.taskCards.map((card) => (
                      <div
                        key={card.id}
                        className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 ease-in-out hover:border-purple-200 dark:hover:border-purple-700'
                      >
                        {/* Task Card Header */}
                        <div
                          className='p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 flex items-center justify-between border-b border-gray-200 dark:border-gray-700 transition-all duration-200 ease-in-out'
                          onClick={() =>
                            toggleTaskCard(
                              activeArea.id,
                              card.id,
                              activeAreaType as 'practice' | 'project'
                            )
                          }
                        >
                          <div className='flex items-center space-x-3'>
                            <span
                              className={`w-3 h-3 ${getColorClass(
                                card.color
                              )} rounded-full transition-transform duration-200 ${
                                card.isExpanded ? 'scale-110' : 'scale-100'
                              }`}
                            ></span>
                            <h3 className='text-lg font-medium text-gray-900 dark:text-white transition-colors duration-200'>
                              {card.name}
                            </h3>
                          </div>
                          <div
                            className={`transition-transform duration-300 ease-in-out ${
                              card.isExpanded ? 'rotate-0' : 'rotate-0'
                            }`}
                          >
                            {card.isExpanded ? (
                              <ChevronDown className='w-5 h-5 text-gray-500 dark:text-gray-400 transition-colors duration-200' />
                            ) : (
                              <ChevronRight className='w-5 h-5 text-gray-500 dark:text-gray-400 transition-colors duration-200' />
                            )}
                          </div>
                        </div>

                        {card.isExpanded && (
                          <div className='p-4 space-y-3'>
                            {/* Todos */}
                            {card.todos.map((todo) => (
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
                                    if (
                                      !todo.completed &&
                                      isTimerActiveForTodo(todo.id)
                                    ) {
                                      handleStopTimer()
                                    }
                                    toggleTodo(
                                      activeArea.id,
                                      card.id,
                                      todo.id,
                                      activeAreaType as 'practice' | 'project'
                                    )
                                  }}
                                  className='w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500'
                                />

                                {/* Todo content with timer */}
                                <div className='flex-1 flex items-center justify-between min-w-0'>
                                  <span
                                    className={`transition-all duration-300 truncate pr-2 ${
                                      todo.completed
                                        ? 'text-gray-500 dark:text-gray-400 line-through'
                                        : 'text-gray-900 dark:text-white'
                                    }`}
                                  >
                                    {todo.name}
                                  </span>

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
                                      {isTimerActiveForTodo(todo.id) &&
                                      activeTimer
                                        ? formatTime(
                                            getTimerDuration(activeTimer)
                                          )
                                        : '00:00:00'}
                                    </span>

                                    {/* Timer control - single icon toggle, disabled if completed */}
                                    <button
                                      onClick={() => {
                                        if (todo.completed) return // Don't allow timer actions on completed todos

                                        if (isTimerActiveForTodo(todo.id)) {
                                          handleStopTimer()
                                        } else {
                                          handleStartTimer(
                                            activeArea.id,
                                            activeArea.name,
                                            activeAreaType as
                                              | 'practice'
                                              | 'project',
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
                                          ? 'text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer hover:scale-105 active:scale-95 shadow-sm bg-red-50/50 dark:bg-red-900/10'
                                          : 'text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 cursor-pointer hover:scale-105 active:scale-95 shadow-sm'
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
                                          isTimerActiveForTodo(todo.id)
                                            ? 'animate-pulse'
                                            : ''
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
                            ))}

                            {/* Add new todo */}
                            <div className='flex items-center space-x-2 mt-4 pt-3 border-t border-gray-200 dark:border-gray-700'>
                              <input
                                type='text'
                                placeholder='Add new task...'
                                className='flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent'
                                onKeyPress={(e) => {
                                  if (e.key === 'Enter') {
                                    const input = e.target as HTMLInputElement
                                    handleAddTodo(
                                      activeArea.id,
                                      card.id,
                                      input.value
                                    )
                                    input.value = ''
                                  }
                                }}
                              />
                              <button
                                onClick={(e) => {
                                  const input = (e.target as HTMLElement)
                                    .previousElementSibling as HTMLInputElement
                                  handleAddTodo(
                                    activeArea.id,
                                    card.id,
                                    input.value
                                  )
                                  input.value = ''
                                }}
                                className='bg-primary hover:bg-primary-hover text-white px-3 py-2 rounded text-sm transition-colors'
                              >
                                Add
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              )}

            {/* Other views */}
            {activeView === 'dashboard' && (
              <div className='text-center py-12'>
                <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>
                  Dashboard
                </h2>
                <p className='text-gray-600 dark:text-gray-400'>
                  Coming soon...
                </p>
              </div>
            )}

            {activeView === 'tags' && (
              <div className='text-center py-12'>
                <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>
                  Tags
                </h2>
                <p className='text-gray-600 dark:text-gray-400'>
                  Coming soon...
                </p>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className='fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden'
          onClick={toggleSidebar}
        ></div>
      )}
    </div>
  )
}
