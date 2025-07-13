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
  }
) => {
  const today = getTodayDateString()
  const todaysTimers = state.timers[today] || []

  // Find existing timer record for this todo today
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
        [today]: updatedTimers,
      },
    }
  } else {
    // Create new record for this todo today
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
        [today]: [...todaysTimers, newTimerRecord],
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
        midnightFlag: 0 as 0 | 1, // Toggles between 0 and 1 at midnight

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
              const duration =
                now.getTime() - state.activeTimer.startTime.getTime()

              // Check if midnight occurred during this session
              if (state.activeTimer.midnightSnapshot !== state.midnightFlag) {
                // Handle cross-midnight session (TODO: implement splitSessionAcrossMidnight)
                console.log(
                  'Cross-midnight session detected - will implement splitting logic'
                )
              } else {
                // Normal single-day session - add to today's total
                state = addToTodaysTotal(
                  state,
                  state.activeTimer.todoId,
                  duration,
                  {
                    areaId: state.activeTimer.areaId,
                    areaName: state.activeTimer.areaName,
                    areaType: state.activeTimer.areaType,
                    taskCardId: state.activeTimer.taskCardId,
                    taskCardName: state.activeTimer.taskCardName,
                    todoName: state.activeTimer.todoName,
                  }
                )
              }
            }

            // Create new active timer with midnight snapshot
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
              midnightSnapshot: state.midnightFlag, // Capture current midnight flag
            }

            return {
              ...state,
              activeTimer: newActiveTimer,
            }
          }),

        stopTimer: () =>
          set((state) => {
            if (!state.activeTimer) {
              return state
            }

            const now = new Date()
            const duration =
              now.getTime() - state.activeTimer.startTime.getTime()

            // Check if midnight occurred during this session
            if (state.activeTimer.midnightSnapshot !== state.midnightFlag) {
              // Handle cross-midnight session (TODO: implement splitSessionAcrossMidnight)
              console.log(
                'Cross-midnight session detected - will implement splitting logic'
              )
            } else {
              // Normal single-day session - add to today's total
              state = addToTodaysTotal(
                state,
                state.activeTimer.todoId,
                duration,
                {
                  areaId: state.activeTimer.areaId,
                  areaName: state.activeTimer.areaName,
                  areaType: state.activeTimer.areaType,
                  taskCardId: state.activeTimer.taskCardId,
                  taskCardName: state.activeTimer.taskCardName,
                  todoName: state.activeTimer.todoName,
                }
              )
            }
            return {
              ...state,
              activeTimer: null,
            }
          }),

        // Daily timer management functions
        getTodaysTotalForTodo: (todoId) => {
          // This function will be called with the current state context
          // so we can access state directly without useAppStore.getState()
          return 0 // Will be implemented properly when called
        },

        getTimersForDate: (date) => {
          // This function will be called with the current state context
          return [] // Will be implemented properly when called
        },

        handleMidnightTransition: () =>
          set((state) => ({
            midnightFlag: state.midnightFlag === 0 ? 1 : 0, // Toggle between 0 and 1
          })),

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
                          color: 'purple',
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
      name: 'fretplan-storage', // localStorage key
      // select
      partialize: (state) => ({
        practiceAreas: state.practiceAreas,
        projects: state.projects,
        activePracticeAreaId: state.activePracticeAreaId,
        activeProjectId: state.activeProjectId,
        isDarkMode: state.isDarkMode,
        timers: state.timers,
        midnightFlag: state.midnightFlag,
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

