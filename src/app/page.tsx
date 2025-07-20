'use client'
import { useTheme } from 'next-themes'
import { useState, useEffect } from 'react'
import { Menu, Sun, Moon, Mail, Plus } from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'
import {
  PracticeArea,
  ProjectArea,
  TaskCard,
  ColorPickerState,
  AreaType,
} from '@/types'
import ConfirmationModal from '@/app/components/ConfirmationModal'
import { ItemContextMenu } from '@/app/components/ItemContextMenu'
import { TodoContextMenu } from '@/app/components/TodoContextMenu'
import TaskCardComponent from '@/app/components/TaskCard'
import Sidebar from '@/app/components/Sidebar'
import { CreatePracticeAreaModal } from '@/app/components/modals/CreatePracticeAreaModal'
import { CreateProjectModal } from '@/app/components/modals/CreateProjectModal'
import { CreateTaskCardModal } from '@/app/components/modals/CreateTaskCardModal'
import { ContactModal } from '@/app/components/modals/ContactModal'
import { useStoreHydration } from '@/store/useAppStore'
import { getLocalDateString } from '@/utils/dateUtils'
import Image from 'next/image'
import { GlobalTimerBar } from '@/app/components/GlobalTimerBar'
import ScrollableText from '@/app/components/ScrollableText'
// import DigitalClock from '@/app/components/DigitalClock' // test-only clock component

const useViewportHeight = () => {
  const [height, setHeight] = useState('100vh')

  useEffect(() => {
    const updateHeight = () => {
      // Get the actual viewport height
      const vh = window.innerHeight
      setHeight(`${vh}px`)
    }

    // Set initial height
    updateHeight()

    // Update on resize (handles mobile orientation changes and address bar)
    window.addEventListener('resize', updateHeight)
    window.addEventListener('orientationchange', updateHeight)

    return () => {
      window.removeEventListener('resize', updateHeight)
      window.removeEventListener('orientationchange', updateHeight)
    }
  }, [])

  return height
}

export default function Home() {
  const { theme, setTheme } = useTheme()
  const [themeMounted, setThemeMounted] = useState(false)
  const storeHydrated = useStoreHydration()
  const viewportHeight = useViewportHeight()
  const {
    practiceAreas,
    projects,
    activePracticeAreaId,
    activeProjectId,
    activeView,
    isSidebarOpen,
    activeTimer,
    timers,
    setActivePracticeArea,
    setActiveProject,
    setActiveView,
    setSidebarOpen,
    addPracticeArea,
    addProject,
    addTaskCard,
    addTodo,
    toggleTodo,
    toggleTaskCard,
    startTimer,
    stopTimer,
    updatePracticeAreaColor,
    updateProjectColor,
    updateTaskCardColor,
    renamePracticeArea,
    renameProject,
    renameTaskCard,
    renameTodo,
    deleteTodo,
    deletePracticeArea,
    deleteProject,
    deleteTaskCard,
  } = useAppStore()

  // Force re-render every second for timer display updates
  const [, forceUpdate] = useState({})
  const [colorPickerState, setColorPickerState] = useState<ColorPickerState>({
    isOpen: false,
    position: { x: 0, y: 0 },
    targetId: '',
    targetType: 'practice-area',
    targetName: '',
    currentColor: 'gray',
  })
  const [confirmationModal, setConfirmationModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  })
  const [editingAreaId, setEditingAreaId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState('')
  const [selectedTaskCardId, setSelectedTaskCardId] = useState<string | null>(
    null
  )
  const [selectedSidebarItemId, setSelectedSidebarItemId] = useState<
    string | null
  >(null)
  const [showCreatePracticeAreaModal, setShowCreatePracticeAreaModal] =
    useState(false)
  const [showCreateProjectModal, setShowCreateProjectModal] = useState(false)
  const [showCreateTaskCardModal, setShowCreateTaskCardModal] = useState(false)
  const [showContactModal, setShowContactModal] = useState(false)
  const [selectedTodoId, setSelectedTodoId] = useState<string | null>(null)
  const [todoContextMenu, setTodoContextMenu] = useState({
    isOpen: false,
    position: { x: 0, y: 0 },
    todoId: '',
    todoName: '',
  })

  useEffect(() => {
    setThemeMounted(true)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      forceUpdate({}) // Trigger re-render for timer display
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  // Show loading until both are ready
  if (!themeMounted || !storeHydrated) {
    return (
      <div className='min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center'>
        <div className='text-center'>
          <div className='w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-2'></div>
          <p className='text-sm text-gray-600 dark:text-gray-400'>
            Loading FretTime...
          </p>
        </div>
      </div>
    )
  }

  // Color picker handlers
  const openColorPicker = (
    e: React.MouseEvent,
    targetId: string,
    targetType: ColorPickerState['targetType'],
    targetName: string,
    currentColor: string,
    areaId?: string,
    areaType?: 'practice' | 'project'
  ) => {
    e.preventDefault() // Prevent browser context menu
    e.stopPropagation()

    // Set selected TaskCard if this is a task-card context menu
    if (targetType === 'task-card') {
      setSelectedTaskCardId(targetId)
      setSelectedSidebarItemId(null) // Clear sidebar selection
    } else if (targetType === 'practice-area' || targetType === 'project') {
      setSelectedSidebarItemId(targetId)
      setSelectedTaskCardId(null) // Clear task card selection
    }

    setColorPickerState({
      isOpen: true,
      position: { x: e.clientX, y: e.clientY },
      targetId,
      targetType,
      targetName,
      currentColor,
      areaId,
      areaType,
    })
  }

  const closeColorPicker = () => {
    setColorPickerState((prev) => ({ ...prev, isOpen: false }))
    setSelectedTaskCardId(null) // Clear selected state when menu closes
    setSelectedSidebarItemId(null) // Clear both selections
  }

  const handleColorSelect = (newColor: string) => {
    const { targetId, targetType, areaId, areaType } = colorPickerState

    switch (targetType) {
      case 'practice-area':
        updatePracticeAreaColor(targetId, newColor as PracticeArea['color'])
        break
      case 'project':
        updateProjectColor(targetId, newColor as ProjectArea['color'])
        break
      case 'task-card':
        if (areaId && areaType) {
          updateTaskCardColor(
            areaId,
            targetId,
            newColor as TaskCard['color'],
            areaType
          )
        }
        break
    }

    closeColorPicker()
  }

  // Handler for active timer
  const handleGoToActiveTimer = () => {
    if (!activeTimer) return

    // Navigate to the area containing the active timer
    if (activeTimer.areaType === 'practice') {
      setActivePracticeArea(activeTimer.areaId)
    } else {
      setActiveProject(activeTimer.areaId)
    }

    // Expand the task card containing the active timer
    const targetArea =
      activeTimer.areaType === 'practice'
        ? practiceAreas.find((area) => area.id === activeTimer.areaId)
        : projects.find((project) => project.id === activeTimer.areaId)

    if (targetArea) {
      const taskCard = targetArea.taskCards.find(
        (card) => card.id === activeTimer.taskCardId
      )
      if (taskCard && !taskCard.isExpanded) {
        toggleTaskCard(
          activeTimer.areaId,
          activeTimer.taskCardId,
          activeTimer.areaType
        )
      }
    }
  }

  // Handlers for rename operations
  const handleStartRename = () => {
    setEditingAreaId(colorPickerState.targetId)
    setEditingName(colorPickerState.targetName)
    closeColorPicker()
  }

  const handleFinishRename = (
    id: string,
    itemType: 'practice' | 'project' | 'task-card' | 'todo'
  ) => {
    if (
      editingName.trim() &&
      editingName.trim() !== colorPickerState.targetName
    ) {
      if (itemType === 'practice') {
        renamePracticeArea(id, editingName.trim())
      } else if (itemType === 'project') {
        renameProject(id, editingName.trim())
      } else if (itemType === 'task-card') {
        // For task cards, we need areaId and areaType from colorPickerState
        const { areaId, areaType } = colorPickerState
        if (areaId && areaType) {
          renameTaskCard(areaId, id, editingName.trim(), areaType)
        }
      } else if (itemType === 'todo') {
        const activeAreaId = activePracticeAreaId || activeProjectId
        if (activeAreaId) {
          const activeAreaData = activePracticeArea || activeProject
          const taskCard = activeAreaData?.taskCards.find((card) =>
            card.todos.some((todo) => todo.id === id)
          )

          if (taskCard) {
            renameTodo(
              activeAreaId,
              taskCard.id,
              id,
              editingName.trim(),
              activeAreaType as 'practice' | 'project'
            )
          }
        }
      }
    }
    setEditingAreaId(null)
    setEditingName('')
  }

  const handleCancelRename = () => {
    setEditingAreaId(null)
    setEditingName('')
  }

  // Handlers for delete operations
  const handleDelete = () => {
    const { targetType, targetName, targetId, areaId, areaType } =
      colorPickerState

    if (targetType === 'practice-area') {
      setConfirmationModal({
        isOpen: true,
        title: 'Delete Practice Area',
        message: `Are you sure you want to delete "${targetName}"? This will permanently remove all task cards and todos within this practice area.`,
        onConfirm: () => {
          deletePracticeArea(targetId)
          setConfirmationModal({ ...confirmationModal, isOpen: false })
        },
      })
    } else if (targetType === 'project') {
      setConfirmationModal({
        isOpen: true,
        title: 'Delete Project',
        message: `Are you sure you want to delete "${targetName}"? This will permanently remove all task cards and todos within this project.`,
        onConfirm: () => {
          deleteProject(targetId)
          setConfirmationModal({ ...confirmationModal, isOpen: false })
        },
      })
    } else if (targetType === 'task-card') {
      setConfirmationModal({
        isOpen: true,
        title: 'Delete Task Card',
        message: `Are you sure you want to delete "${targetName}"? This will permanently remove all todos and associated timer data within this task card.`,
        onConfirm: () => {
          if (areaId && areaType) {
            deleteTaskCard(areaId, targetId, areaType)
          }
          setConfirmationModal({ ...confirmationModal, isOpen: false })
        },
      })
    }
    closeColorPicker() // Close the context menu when opening delete modal
  }

  // Todo context menu handlers
  const openTodoContextMenu = (
    e: React.MouseEvent,
    todoId: string,
    todoName: string
  ) => {
    e.preventDefault()
    e.stopPropagation()

    setSelectedTodoId(todoId)
    setSelectedTaskCardId(null) // Clear task card selection
    setSelectedSidebarItemId(null) // Clear sidebar selection

    setTodoContextMenu({
      isOpen: true,
      position: { x: e.clientX, y: e.clientY },
      todoId,
      todoName,
    })
  }

  const closeTodoContextMenu = () => {
    setTodoContextMenu((prev) => ({ ...prev, isOpen: false }))
    setSelectedTodoId(null) // Clear selected state when menu closes
  }

  const handleTodoRename = () => {
    console.log(
      'Todo rename clicked:',
      todoContextMenu.todoId,
      todoContextMenu.todoName
    )
    setEditingAreaId(todoContextMenu.todoId)
    setEditingName(todoContextMenu.todoName)
    closeTodoContextMenu()
  }

  const handleTodoDelete = () => {
    setConfirmationModal({
      isOpen: true,
      title: 'Delete Task',
      message: `Are you sure you want to delete "${todoContextMenu.todoName}"? This will permanently remove all timer data for this task.`,
      onConfirm: () => {
        const activeAreaId = activePracticeAreaId || activeProjectId
        if (activeAreaId) {
          // Find the task card containing this todo
          const activeAreaData = activePracticeArea || activeProject
          const taskCard = activeAreaData?.taskCards.find((card) =>
            card.todos.some((todo) => todo.id === todoContextMenu.todoId)
          )

          if (taskCard) {
            deleteTodo(
              activeAreaId,
              taskCard.id,
              todoContextMenu.todoId,
              activeAreaType as 'practice' | 'project'
            )
          }
        }
        setConfirmationModal({ ...confirmationModal, isOpen: false })
      },
    })
    closeTodoContextMenu()
  }

  // Timer helper functions
  const formatTime = (milliseconds: number) => {
    // Ensure we never have negative time
    const safeMilliseconds = Math.max(0, milliseconds)
    const totalSeconds = Math.floor(safeMilliseconds / 1000)
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60

    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }

  const getTimerDuration = (timer: typeof activeTimer) => {
    if (!timer) return 0
    // Always use fresh current time, not state-dependent currentTime
    const now = new Date().getTime()
    return Math.max(0, now - timer.startTime.getTime())
  }

  const getDisplayTimeForTodo = (todoId: string) => {
    // Get today's accumulated time for this todo using LOCAL date
    const today = getLocalDateString(new Date()) // Use local date helper
    const todaysTimers = timers[today] || []
    const todoTimer = todaysTimers.find((timer) => timer.todoId === todoId)
    const todaysTotal = todoTimer ? todoTimer.totalDuration : 0

    // If this todo has an active timer, add the current session time
    if (isTimerActiveForTodo(todoId) && activeTimer) {
      const currentSessionTime = getTimerDuration(activeTimer)
      return todaysTotal + currentSessionTime
    }

    // Otherwise, just show today's total
    return todaysTotal
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
    (area: PracticeArea) => area.id === activePracticeAreaId
  )
  const activeProject = projects.find(
    (project: ProjectArea) => project.id === activeProjectId
  )
  const activeArea = activePracticeArea || activeProject
  const activeAreaType = activePracticeArea ? 'practice' : 'project'

  // Handle adding new practice area
  const handleAddPracticeArea = () => {
    setShowCreatePracticeAreaModal(true)
  }

  // Handle adding new project
  const handleAddProject = () => {
    setShowCreateProjectModal(true)
  }

  // Handle adding new task card
  const handleAddTaskCard = () => {
    setShowCreateTaskCardModal(true)
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

  // Handle modal save actions
  const handleSavePracticeArea = (
    name: string,
    color: PracticeArea['color']
  ) => {
    addPracticeArea(name, color)
    setShowCreatePracticeAreaModal(false)
  }

  const handleSaveProject = (name: string, color: ProjectArea['color']) => {
    addProject(name, color)
    setShowCreateProjectModal(false)
  }

  const handleSaveTaskCard = (name: string, color: TaskCard['color']) => {
    const currentAreaId = activePracticeAreaId || activeProjectId
    if (!currentAreaId) return

    // Update the store to accept color parameter
    addTaskCard(
      currentAreaId,
      name,
      activeAreaType as 'practice' | 'project',
      color
    )
    setShowCreateTaskCardModal(false)
  }

  return (
    // <div className='bg-gray-50 dark:bg-gray-900 transition-colors duration-300 min-h-screen'>
    <div
      className='bg-gray-50 dark:bg-gray-900 transition-colors duration-300 flex flex-col'
      style={{ height: viewportHeight }}
    >
      {/* Banner / Top Navigation */}
      <nav className='bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 fixed w-full top-0 h-[var(--banner-height)] z-50'>
        <div className='flex justify-between h-[var(--banner-height)] max-w-7xl mx-auto'>
          {/* Logo & Sidebar Toggle */}
          <div className='flex items-center space-x-2'>
            <button
              onClick={toggleSidebar}
              className='w-7 h-7 bg-primary rounded-lg flex items-center justify-center text-white hover:bg-primary-hover transition-colors xl:hidden'
            >
              <Menu className='w-4 h-4' />
            </button>

            {/* Logo and Brand */}
            <div className='flex space-x-2'>
              <h1 className='text-xl font-semibold text-primary-custom'>
                FretTime
              </h1>
              {/* Logo - hidden on small screens to save space */}
              <Image
                src='/logo.svg'
                alt='FretTime Logo'
                width={38}
                height={38}
                className='hidden sm:block'
                priority // Since it's above the fold
              />
            </div>
          </div>

          {/* Right side controls */}
          <div className='flex items-center space-x-4'>
            {/* Theme toggle - simplified bc we now wait for hydration */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className='flex items-center space-x-2 p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors'
            >
              {theme === 'dark' ? (
                <Sun className='w-4 h-4' />
              ) : (
                <Moon className='w-4 h-4' />
              )}
              <span className='text-sm font-medium hidden md:block'>
                {theme === 'dark' ? 'Light' : 'Dark'}
              </span>
            </button>

            {/* Contact button */}
            <button
              onClick={() => setShowContactModal(true)}
              className='flex items-center space-x-2 p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors'
            >
              <Mail className='w-4 h-4' />
              <span className='text-sm font-medium hidden md:block'>
                Contact
              </span>
            </button>
          </div>
        </div>
      </nav>
      {/* Content Wrapper - Sidebar + Main Content */}
      <div className='flex flex-1 relative top-[var(--banner-height)]'>
        {/* Sidebar */}
        <Sidebar
          isSidebarOpen={isSidebarOpen}
          practiceAreas={practiceAreas}
          projects={projects}
          activePracticeAreaId={activePracticeAreaId}
          activeProjectId={activeProjectId}
          activeView={activeView}
          selectedSidebarItemId={selectedSidebarItemId}
          editingAreaId={editingAreaId}
          editingName={editingName}
          setEditingName={setEditingName}
          onSetActivePracticeArea={setActivePracticeArea}
          onSetActiveProject={setActiveProject}
          onSetActiveView={setActiveView}
          onAddPracticeArea={handleAddPracticeArea}
          onAddProject={handleAddProject}
          onOpenContextMenu={openColorPicker}
          onFinishRename={handleFinishRename}
          onCancelRename={handleCancelRename}
        />

        {/* Global Timer Bar - slides down when active */}
        <GlobalTimerBar
          activeTimer={activeTimer}
          currentTime={
            activeTimer
              ? formatTime(getDisplayTimeForTodo(activeTimer.todoId))
              : '00:00:00'
          }
          onStopTimer={handleStopTimer}
          onGoToTimer={handleGoToActiveTimer}
        />

        {/* Main Content */}
        <main className='flex-1 xl:ml-64'>
          <div
            className='overflow-y-auto p-6 bg-gray-50 dark:bg-gray-900'
            style={{
              height: `calc(${viewportHeight})`, // Subtract nav height if needed
              maxHeight: `calc(${viewportHeight})`,
            }}
          >
            <div className='max-w-4xl mx-auto'>
              {(activeView === 'practice-area' ||
                activeView === 'project-area') &&
                activeArea && (
                  <>
                    {/* Page Header */}
                    <div className='flex-1 mb-6 flex items-center justify-between min-w-0'>
                      <ScrollableText className='flex-1 cursor-pointer'>
                        <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-2'>
                          {activeArea.name}
                        </h2>
                      </ScrollableText>
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
                    <div className='space-y-4 pb-8'>
                      {activeArea.taskCards.map((card: TaskCard) => (
                        <TaskCardComponent
                          key={card.id}
                          card={card}
                          areaId={activeArea.id}
                          areaName={activeArea.name}
                          areaType={activeAreaType as AreaType}
                          isSelected={selectedTaskCardId === card.id}
                          selectedTodoId={selectedTodoId}
                          isTimerActiveForTodo={isTimerActiveForTodo}
                          formatTime={formatTime}
                          getDisplayTimeForTodo={getDisplayTimeForTodo}
                          onToggleCard={() =>
                            toggleTaskCard(
                              activeArea.id,
                              card.id,
                              activeAreaType as 'practice' | 'project'
                            )
                          }
                          onAddTodo={(name) =>
                            handleAddTodo(activeArea.id, card.id, name)
                          }
                          onToggleTodo={(todoId) =>
                            toggleTodo(
                              activeArea.id,
                              card.id,
                              todoId,
                              activeAreaType as 'practice' | 'project'
                            )
                          }
                          onStartTimer={handleStartTimer}
                          onStopTimer={handleStopTimer}
                          onOpenContextMenu={openColorPicker}
                          onOpenTodoContextMenu={openTodoContextMenu}
                          editingAreaId={editingAreaId}
                          editingName={editingName}
                          setEditingName={setEditingName}
                          onFinishRename={handleFinishRename}
                          onCancelRename={handleCancelRename}
                        />
                      ))}
                    </div>
                  </>
                )}

              {/* Other views */}
              {activeView === 'dashboard' && (
                <div className='text-center py-12 pb-8'>
                  <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>
                    Dashboard
                  </h2>
                  <p className='text-gray-600 dark:text-gray-400'>
                    Coming soon...
                  </p>
                </div>
              )}

              {activeView === 'tags' && (
                <div className='text-center py-12 pb-8'>
                  <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>
                    Tags
                  </h2>
                  <p className='text-gray-600 dark:text-gray-400'>
                    Coming soon...
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className='fixed inset-0 bg-black bg-opacity-50 z-30 xl:hidden'
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Context Menu (replaces old ColorPicker) */}
      <ItemContextMenu
        isOpen={colorPickerState.isOpen}
        position={colorPickerState.position}
        currentColor={colorPickerState.currentColor}
        onColorSelect={handleColorSelect}
        onRename={handleStartRename}
        onDelete={handleDelete}
        onClose={closeColorPicker}
      />

      <TodoContextMenu
        isOpen={todoContextMenu.isOpen}
        position={todoContextMenu.position}
        onRename={handleTodoRename}
        onDelete={handleTodoDelete}
        onClose={closeTodoContextMenu}
      />

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmationModal.isOpen}
        title={confirmationModal.title}
        message={confirmationModal.message}
        confirmText='Delete'
        cancelText='Cancel'
        confirmButtonStyle='danger'
        onConfirm={confirmationModal.onConfirm}
        onCancel={() =>
          setConfirmationModal({ ...confirmationModal, isOpen: false })
        }
      />

      {/* Create Practice Area Modal */}
      <CreatePracticeAreaModal
        isOpen={showCreatePracticeAreaModal}
        onClose={() => setShowCreatePracticeAreaModal(false)}
        onSave={handleSavePracticeArea}
      />

      {/* Create Project Modal */}
      <CreateProjectModal
        isOpen={showCreateProjectModal}
        onClose={() => setShowCreateProjectModal(false)}
        onSave={handleSaveProject}
      />

      {/* Create Task Card Modal */}
      <CreateTaskCardModal
        isOpen={showCreateTaskCardModal}
        onClose={() => setShowCreateTaskCardModal(false)}
        onSave={handleSaveTaskCard}
        areaType={activeAreaType as 'practice' | 'project'}
      />

      {/* Contact Modal */}
      <ContactModal
        isOpen={showContactModal}
        onClose={() => setShowContactModal(false)}
      />
    </div>
  )
}

