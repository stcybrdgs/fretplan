import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  AppState,
  PracticeArea,
  ProjectArea,
  AreaType,
  ActiveTimer,
  TimerDayRecord,
} from '@/types'

// Helper function to generate IDs
const generateId = () => Math.random().toString(36).substr(2, 9)

// Helper function to get today's date string
const getTodayDateString = () => new Date().toISOString().split('T')[0]

// Helper function to get milliseconds elapsed since midnight
const getMillisecondsSinceMidnight = (date: Date): number => {
  const hours = date.getHours()
  const minutes = date.getMinutes()
  const seconds = date.getSeconds()
  const milliseconds = date.getMilliseconds()

  return (hours * 3600 + minutes * 60 + seconds) * 1000 + milliseconds
}

// Helper function to check if session crossed midnight and split if needed
const handlePotentialMidnightCrossing = (
  state: AppState,
  timer: ActiveTimer,
  endTime: Date
): AppState => {
  const startTime = new Date(timer.startTime)
  const totalDurationMs = endTime.getTime() - startTime.getTime()
  const elapsedSinceMidnightMs = getMillisecondsSinceMidnight(endTime)

  console.log('🕐 Checking for midnight crossing:', {
    startTime: startTime.toLocaleString(),
    endTime: endTime.toLocaleString(),
    totalDurationMs,
    totalDurationMinutes: Math.round(totalDurationMs / 60000),
    elapsedSinceMidnightMs,
    elapsedSinceMidnightMinutes: Math.round(elapsedSinceMidnightMs / 60000),
    startDay: startTime.toISOString().split('T')[0],
    endDay: endTime.toISOString().split('T')[0],
  })

  // Check if we're on different days AND if timer duration exceeds elapsed time since midnight
  const startDay =
    startTime.getFullYear() +
    '-' +
    String(startTime.getMonth() + 1).padStart(2, '0') +
    '-' +
    String(startTime.getDate()).padStart(2, '0')
  const endDay =
    endTime.getFullYear() +
    '-' +
    String(endTime.getMonth() + 1).padStart(2, '0') +
    '-' +
    String(endTime.getDate()).padStart(2, '0')
  const crossedDayBoundary = startDay !== endDay

  if (crossedDayBoundary && totalDurationMs > elapsedSinceMidnightMs) {
    console.log('🌙 MIDNIGHT CROSSING DETECTED!')

    // Calculate split durations
    const afterMidnightMs = elapsedSinceMidnightMs
    const beforeMidnightMs = totalDurationMs - elapsedSinceMidnightMs

    console.log('⏱️ Split calculation:', {
      beforeMidnightMs,
      beforeMidnightMinutes: Math.round(beforeMidnightMs / 60000),
      afterMidnightMs,
      afterMidnightMinutes: Math.round(afterMidnightMs / 60000),
      verification: `${Math.round(beforeMidnightMs / 60000)} + ${Math.round(
        afterMidnightMs / 60000
      )} = ${Math.round(
        (beforeMidnightMs + afterMidnightMs) / 60000
      )} (should equal ${Math.round(totalDurationMs / 60000)})`,
    })

    // Validate split makes sense
    if (beforeMidnightMs <= 0 || afterMidnightMs <= 0) {
      console.error('❌ Invalid split durations, using normal handling')
      return addToTodaysTotal(state, timer.todoId, totalDurationMs, {
        areaId: timer.areaId,
        areaName: timer.areaName,
        areaType: timer.areaType,
        taskCardId: timer.taskCardId,
        taskCardName: timer.taskCardName,
        todoName: timer.todoName,
      })
    }

    // Add time to first day (before midnight)
    console.log(
      `💾 Adding ${Math.round(beforeMidnightMs / 60000)} minutes to ${startDay}`
    )
    let newState = addToTodaysTotal(
      state,
      timer.todoId,
      beforeMidnightMs,
      {
        areaId: timer.areaId,
        areaName: timer.areaName,
        areaType: timer.areaType,
        taskCardId: timer.taskCardId,
        taskCardName: timer.taskCardName,
        todoName: timer.todoName,
      },
      startDay
    )

    // Add time to second day (after midnight)
    console.log(
      `💾 Adding ${Math.round(afterMidnightMs / 60000)} minutes to ${endDay}`
    )
    newState = addToTodaysTotal(
      newState,
      timer.todoId,
      afterMidnightMs,
      {
        areaId: timer.areaId,
        areaName: timer.areaName,
        areaType: timer.areaType,
        taskCardId: timer.taskCardId,
        taskCardName: timer.taskCardName,
        todoName: timer.todoName,
      },
      endDay
    )

    console.log('✅ Midnight crossing handled successfully')
    return newState
  } else {
    console.log('📝 Normal session - no midnight crossing')
    // Normal single-day session
    return addToTodaysTotal(state, timer.todoId, totalDurationMs, {
      areaId: timer.areaId,
      areaName: timer.areaName,
      areaType: timer.areaType,
      taskCardId: timer.taskCardId,
      taskCardName: timer.taskCardName,
      todoName: timer.todoName,
    })
  }
}

// Helper function to add duration to today's total for a todo
const addToTodaysTotal = (
  state: AppState,
  todoId: string,
  duration: number,
  todoInfo: {
    areaId: string
    areaName: string
    areaType: 'practice' | 'project'
    taskCardId: string
    taskCardName: string
    todoName: string
  },
  targetDate?: string // Optional: specify which date to add to
) => {
  const dateToUse = targetDate || getTodayDateString()
  const todaysTimers = state.timers[dateToUse] || []

  // Find existing timer record for this todo on target date
  const existingTimerIndex = todaysTimers.findIndex(
    (timer: TimerDayRecord) => timer.todoId === todoId
  )

  if (existingTimerIndex >= 0) {
    // Update existing record
    const updatedTimers = [...todaysTimers]
    updatedTimers[existingTimerIndex] = {
      ...updatedTimers[existingTimerIndex],
      totalDuration: updatedTimers[existingTimerIndex].totalDuration + duration,
    }

    return {
      ...state,
      timers: {
        ...state.timers,
        [dateToUse]: updatedTimers,
      },
    }
  } else {
    // Create new record for this todo on target date
    const newTimerRecord = {
      id: generateId(),
      createdAt: new Date(),
      areaId: todoInfo.areaId,
      areaName: todoInfo.areaName,
      areaType: todoInfo.areaType,
      taskCardId: todoInfo.taskCardId,
      taskCardName: todoInfo.taskCardName,
      todoId: todoId,
      todoName: todoInfo.todoName,
      totalDuration: duration,
    }

    return {
      ...state,
      timers: {
        ...state.timers,
        [dateToUse]: [...todaysTimers, newTimerRecord],
      },
    }
  }
}

// Initial mock data with updated interface
const initialPracticeAreas: PracticeArea[] = [
  {
    id: 'daily-practice',
    name: 'Daily Practice',
    color: 'purple',
    createdAt: new Date(),
    taskCards: [
      {
        id: 'card-1',
        name: 'G Dominant Scale Ideas',
        isExpanded: true,
        color: 'green',
        createdAt: new Date(),
        todos: [
          {
            id: 'todo-1',
            name: 'Practice Dm - F - Bb - A progression',
            completed: false,
            createdAt: new Date(),
          },
          {
            id: 'todo-2',
            name: 'Review tritone substitutions',
            completed: true,
            createdAt: new Date(),
          },
          {
            id: 'todo-3',
            name: 'Apply to "Autumn Leaves" in Bb',
            completed: false,
            createdAt: new Date(),
          },
        ],
      },
      {
        id: 'card-2',
        name: 'Autumn Leaves - Bb & G Major',
        isExpanded: false,
        color: 'purple',
        createdAt: new Date(),
        todos: [],
      },
    ],
  },
  {
    id: 'scales-theory',
    name: 'Scales & Theory',
    color: 'green',
    createdAt: new Date(),
    taskCards: [],
  },
  {
    id: 'songs-repertoire',
    name: 'Songs & Repertoire',
    color: 'purple',
    createdAt: new Date(),
    taskCards: [],
  },
  {
    id: 'technique',
    name: 'Technique',
    color: 'orange',
    createdAt: new Date(),
    taskCards: [],
  },
]

const initialProjects: ProjectArea[] = [
  {
    id: 'original-1',
    name: 'Original #1',
    color: 'purple',
    createdAt: new Date(),
    taskCards: [],
  },
]

export const useAppStore = create<AppState>()(
  persist(
    (set) =>
      ({
        // Initial state
        activePracticeAreaId: 'daily-practice',
        activeProjectId: null,
        activeView: 'practice-area',
        isSidebarOpen: false,
        isDarkMode: false,
        practiceAreas: initialPracticeAreas,
        projects: initialProjects,

        // Timer state
        activeTimer: null,
        timers: {}, // Daily timer records organized by date

        // Navigation actions
        setActivePracticeArea: (id: string) =>
          set({
            activePracticeAreaId: id,
            activeProjectId: null,
            activeView: 'practice-area',
          }),

        setActiveProject: (id: string) =>
          set({
            activeProjectId: id,
            activePracticeAreaId: null,
            activeView: 'project-area',
          }),

        setActiveView: (view) => set({ activeView: view }),

        setSidebarOpen: (isOpen: boolean) => set({ isSidebarOpen: isOpen }),

        // Color update actions
        updatePracticeAreaColor: (
          areaId: string,
          newColor: PracticeArea['color']
        ) =>
          set((state) => ({
            practiceAreas: state.practiceAreas.map((area) =>
              area.id === areaId ? { ...area, color: newColor } : area
            ),
          })),

        updateProjectColor: (
          projectId: string,
          newColor: ProjectArea['color']
        ) =>
          set((state) => ({
            projects: state.projects.map((project) =>
              project.id === projectId
                ? { ...project, color: newColor }
                : project
            ),
          })),

        updateTaskCardColor: (
          areaId: string,
          taskCardId: string,
          newColor: TaskCard['color'],
          areaType: AreaType
        ) =>
          set((state) => {
            const targetArray =
              areaType === 'practice' ? 'practiceAreas' : 'projects'
            return {
              [targetArray]: state[targetArray].map((area) =>
                area.id === areaId
                  ? {
                      ...area,
                      taskCards: area.taskCards.map((card) =>
                        card.id === taskCardId
                          ? { ...card, color: newColor }
                          : card
                      ),
                    }
                  : area
              ),
            }
          }),

        // Theme action
        // TODO: Implement flash-free dark mode to prevent hydration mismatch
        // Consider: blocking script in <head> or next-themes library for production
        // Current implementation may cause brief light->dark flash on page load
        toggleTheme: () =>
          set((state) => {
            const newDarkMode = !state.isDarkMode

            // Update DOM immediately
            if (newDarkMode) {
              document.documentElement.classList.add('dark')
            } else {
              document.documentElement.classList.remove('dark')
            }

            return { isDarkMode: newDarkMode }
          }),

        // Timer actions
        startTimer: (
          areaId,
          areaName,
          areaType,
          taskCardId,
          taskCardName,
          todoId,
          todoName
        ) =>
          set((state) => {
            // If there's already an active timer, auto-stop it first
            if (state.activeTimer && state.activeTimer.status === 'running') {
              const now = new Date()
              // Use the new midnight crossing detection
              state = handlePotentialMidnightCrossing(
                state,
                state.activeTimer,
                now
              )
            }

            // Create new active timer (much simpler - no midnight snapshot needed!)
            const newActiveTimer: ActiveTimer = {
              id: generateId(),
              areaId,
              areaName,
              areaType,
              taskCardId,
              taskCardName,
              todoId,
              todoName,
              startTime: new Date(),
              status: 'running',
            }

            return {
              ...state,
              activeTimer: newActiveTimer,
            }
          }),

        stopTimer: () =>
          set((state) => {
            if (!state.activeTimer) return state

            const now = new Date()
            // Use the new midnight crossing detection
            state = handlePotentialMidnightCrossing(
              state,
              state.activeTimer,
              now
            )

            return {
              ...state,
              activeTimer: null,
            }
          }),

        // CRUD operations
        addPracticeArea: (name: string, color: PracticeArea['color']) =>
          set((state) => ({
            practiceAreas: [
              ...state.practiceAreas,
              {
                id: generateId(),
                name,
                color,
                taskCards: [],
                createdAt: new Date(),
              },
            ],
          })),

        addProject: (name: string, color: ProjectArea['color']) =>
          set((state) => ({
            projects: [
              ...state.projects,
              {
                id: generateId(),
                name,
                color,
                taskCards: [],
                createdAt: new Date(),
              },
            ],
          })),

        addTaskCard: (areaId: string, name: string, areaType: AreaType) =>
          set((state) => {
            const targetArray =
              areaType === 'practice' ? 'practiceAreas' : 'projects'
            return {
              [targetArray]: state[targetArray].map((area) =>
                area.id === areaId
                  ? {
                      ...area,
                      taskCards: [
                        ...area.taskCards,
                        {
                          id: generateId(),
                          name,
                          isExpanded: true,
                          color: 'gray',
                          todos: [],
                          createdAt: new Date(),
                        },
                      ],
                    }
                  : area
              ),
            }
          }),

        addTodo: (
          areaId: string,
          taskCardId: string,
          name: string,
          areaType: AreaType
        ) =>
          set((state) => {
            const targetArray =
              areaType === 'practice' ? 'practiceAreas' : 'projects'
            return {
              [targetArray]: state[targetArray].map((area) =>
                area.id === areaId
                  ? {
                      ...area,
                      taskCards: area.taskCards.map((card) =>
                        card.id === taskCardId
                          ? {
                              ...card,
                              todos: [
                                ...card.todos,
                                {
                                  id: generateId(),
                                  name,
                                  completed: false,
                                  createdAt: new Date(),
                                },
                              ],
                            }
                          : card
                      ),
                    }
                  : area
              ),
            }
          }),

        toggleTodo: (
          areaId: string,
          taskCardId: string,
          todoId: string,
          areaType: AreaType
        ) =>
          set((state) => {
            const targetArray =
              areaType === 'practice' ? 'practiceAreas' : 'projects'
            return {
              [targetArray]: state[targetArray].map((area) =>
                area.id === areaId
                  ? {
                      ...area,
                      taskCards: area.taskCards.map((card) =>
                        card.id === taskCardId
                          ? {
                              ...card,
                              todos: card.todos.map((todo) =>
                                todo.id === todoId
                                  ? { ...todo, completed: !todo.completed }
                                  : todo
                              ),
                            }
                          : card
                      ),
                    }
                  : area
              ),
            }
          }),

        toggleTaskCard: (
          areaId: string,
          taskCardId: string,
          areaType: AreaType
        ) =>
          set((state) => {
            const targetArray =
              areaType === 'practice' ? 'practiceAreas' : 'projects'
            return {
              [targetArray]: state[targetArray].map((area) =>
                area.id === areaId
                  ? {
                      ...area,
                      taskCards: area.taskCards.map((card) =>
                        card.id === taskCardId
                          ? { ...card, isExpanded: !card.isExpanded }
                          : card
                      ),
                    }
                  : area
              ),
            }
          }),
      } as AppState),
    {
      name: 'frettime-storage', // localStorage key
      partialize: (state) => ({
        practiceAreas: state.practiceAreas,
        projects: state.projects,
        activePracticeAreaId: state.activePracticeAreaId,
        activeProjectId: state.activeProjectId,
        isDarkMode: state.isDarkMode,
        timers: state.timers,
        // Note: activeTimer is not persisted - timers don't survive page refresh
        // TODO: Fix hydration flicker - theme resets to light on page refresh
        // Plan: Integrate next-themes library or implement blocking script in <head>
        // For now, accepting UX tradeoff to maintain centralized state architecture
      }),
      onRehydrateStorage: () => (state) => {
        // Apply theme to DOM when store rehydrates
        // TODO: This causes hydration mismatch - investigate next-themes integration
        if (state?.isDarkMode) {
          document.documentElement.classList.add('dark')
        } else {
          document.documentElement.classList.remove('dark')
        }
      },
    }
  )
)

