import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  getLocalDateString,
  getMillisecondsSinceLocalMidnight,
} from '@/utils/dateUtils'
import {
  AppState,
  PracticeArea,
  ProjectArea,
  TaskCard,
  AreaType,
  ActiveTimer,
  TimerDayRecord,
} from '@/types'

// Helper function to generate IDs
const generateId = () => Math.random().toString(36).substr(2, 9)

// Helper function to check if session crossed midnight and split if needed
const handlePotentialMidnightCrossing = (
  state: AppState,
  timer: ActiveTimer,
  endTime: Date
): AppState => {
  const startTime = new Date(timer.startTime)
  const totalDurationMs = endTime.getTime() - startTime.getTime()
  const elapsedSinceLocalMidnightMs = getMillisecondsSinceLocalMidnight(endTime)

  // Use local dates for comparison (what the user perceives as "days")
  const startLocalDate = getLocalDateString(startTime)
  const endLocalDate = getLocalDateString(endTime)
  const crossedDayBoundary = startLocalDate !== endLocalDate

  if (crossedDayBoundary && totalDurationMs > elapsedSinceLocalMidnightMs) {
    // Calculate split durations
    const afterMidnightMs = elapsedSinceLocalMidnightMs
    const beforeMidnightMs = totalDurationMs - elapsedSinceLocalMidnightMs

    // Validate split makes sense
    if (beforeMidnightMs <= 0 || afterMidnightMs <= 0) {
      // Keep this log for debugging real issues in production
      console.error(
        'Timer midnight crossing calculation error - using fallback'
      )

      return addToTodaysTotal(state, timer.todoId, totalDurationMs, {
        areaId: timer.areaId,
        areaName: timer.areaName,
        areaType: timer.areaType,
        taskCardId: timer.taskCardId,
        taskCardName: timer.taskCardName,
        todoName: timer.todoName,
      })
    }

    // Add time to first day (before midnight) - use local date
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
      startLocalDate // Use local date string
    )

    // Add time to second day (after midnight) - use local date
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
      endLocalDate // Use local date string
    )

    return newState
  } else {
    // Normal single-day session - use local date
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
  targetDate?: string // Optional: specify which local date to add to
) => {
  // Use local date if not specified
  const dateToUse = targetDate || getLocalDateString(new Date())
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
      createdAtUTC: new Date(), // UTC timestamp for data consistency
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
    createdAtUTC: new Date(),
    taskCards: [
      {
        id: 'card-1',
        name: 'G Dominant Scale Ideas',
        isExpanded: true,
        color: 'green',
        createdAtUTC: new Date(),
        todos: [
          {
            id: 'todo-1',
            name: 'Practice Dm - F - Bb - A progression',
            completed: false,
            createdAtUTC: new Date(),
          },
          {
            id: 'todo-2',
            name: 'Review tritone substitutions',
            completed: true,
            createdAtUTC: new Date(),
          },
          {
            id: 'todo-3',
            name: 'Apply to "Autumn Leaves" in Bb',
            completed: false,
            createdAtUTC: new Date(),
          },
        ],
      },
      {
        id: 'card-2',
        name: 'Autumn Leaves - Bb & G Major',
        isExpanded: false,
        color: 'purple',
        createdAtUTC: new Date(),
        todos: [],
      },
    ],
  },
  {
    id: 'scales-theory',
    name: 'Scales & Theory',
    color: 'green',
    createdAtUTC: new Date(),
    taskCards: [],
  },
  {
    id: 'songs-repertoire',
    name: 'Songs & Repertoire',
    color: 'purple',
    createdAtUTC: new Date(),
    taskCards: [],
  },
  {
    id: 'technique',
    name: 'Technique',
    color: 'orange',
    createdAtUTC: new Date(),
    taskCards: [],
  },
]

const initialProjects: ProjectArea[] = [
  {
    id: 'original-1',
    name: 'Original #1',
    color: 'purple',
    createdAtUTC: new Date(),
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
        // isDarkMode: true,
        practiceAreas: initialPracticeAreas,
        projects: initialProjects,

        // Timer state
        activeTimer: null,
        timers: {}, // Daily timer records organized by date

        _hasHydrated: false,
        setHasHydrated: (state: boolean) => set({ _hasHydrated: state }),

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
                createdAtUTC: new Date(),
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
                createdAtUTC: new Date(),
              },
            ],
          })),

        addTaskCard: (
          areaId: string,
          name: string,
          areaType: AreaType,
          color: TaskCard['color'] = 'gray'
        ) =>
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
                          color,
                          todos: [],
                          createdAtUTC: new Date(),
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
                                  createdAtUTC: new Date(),
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

        // Rename operations
        renamePracticeArea: (areaId: string, newName: string) =>
          set((state) => ({
            practiceAreas: state.practiceAreas.map((area) =>
              area.id === areaId ? { ...area, name: newName.trim() } : area
            ),
          })),

        renameProject: (projectId: string, newName: string) =>
          set((state) => ({
            projects: state.projects.map((project) =>
              project.id === projectId
                ? { ...project, name: newName.trim() }
                : project
            ),
          })),

        renameTaskCard: (
          areaId: string,
          taskCardId: string,
          newName: string,
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
                          ? { ...card, name: newName.trim() }
                          : card
                      ),
                    }
                  : area
              ),
            }
          }),

        // Delete operations
        deletePracticeArea: (areaId: string) =>
          set((state) => {
            const updatedAreas = state.practiceAreas.filter(
              (area) => area.id !== areaId
            )

            // If we're deleting the active area, switch to first available area or null
            let newActivePracticeAreaId = state.activePracticeAreaId
            if (state.activePracticeAreaId === areaId) {
              newActivePracticeAreaId =
                updatedAreas.length > 0 ? updatedAreas[0].id : null
            }

            return {
              practiceAreas: updatedAreas,
              activePracticeAreaId: newActivePracticeAreaId,
              // If no practice areas left and no projects, default to dashboard
              activeView:
                newActivePracticeAreaId === null && state.projects.length === 0
                  ? 'dashboard'
                  : state.activeView,
            }
          }),

        deleteProject: (projectId: string) =>
          set((state) => {
            const updatedProjects = state.projects.filter(
              (project) => project.id !== projectId
            )

            // If we're deleting the active project, switch to first available project or null
            let newActiveProjectId = state.activeProjectId
            if (state.activeProjectId === projectId) {
              newActiveProjectId =
                updatedProjects.length > 0 ? updatedProjects[0].id : null
            }

            return {
              projects: updatedProjects,
              activeProjectId: newActiveProjectId,
              // If no projects left and no practice areas, default to dashboard
              activeView:
                newActiveProjectId === null && state.practiceAreas.length === 0
                  ? 'dashboard'
                  : state.activeView,
            }
          }),

        deleteTaskCard: (
          areaId: string,
          taskCardId: string,
          areaType: AreaType
        ) =>
          set((state) => {
            const targetArray =
              areaType === 'practice' ? 'practiceAreas' : 'projects'

            // Get all todo IDs from the task card being deleted for timer cleanup
            const area = state[targetArray].find((a) => a.id === areaId)
            const taskCard = area?.taskCards.find((c) => c.id === taskCardId)
            const todoIdsToDelete = taskCard?.todos.map((todo) => todo.id) || []

            // Remove task card
            const updatedState = {
              [targetArray]: state[targetArray].map((area) =>
                area.id === areaId
                  ? {
                      ...area,
                      taskCards: area.taskCards.filter(
                        (card) => card.id !== taskCardId
                      ),
                    }
                  : area
              ),
            }

            // Clean up timers for deleted todos
            const cleanedTimers: { [date: string]: TimerDayRecord[] } = {}
            Object.entries(state.timers).forEach(([date, dayRecords]) => {
              cleanedTimers[date] = dayRecords.filter(
                (record) => !todoIdsToDelete.includes(record.todoId)
              )
            })

            // Stop active timer if it belongs to a deleted todo
            let newActiveTimer = state.activeTimer
            if (
              state.activeTimer &&
              todoIdsToDelete.includes(state.activeTimer.todoId)
            ) {
              newActiveTimer = null
            }

            return {
              ...state,
              ...updatedState,
              timers: cleanedTimers,
              activeTimer: newActiveTimer,
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
        timers: state.timers,
      }),
      onRehydrateStorage: () => (state) => {
        // This runs when Zustand finishes loading from localStorage
        state?.setHasHydrated(true)
      },
    }
  )
)

export const useStoreHydration = () => {
  return useAppStore((state) => state._hasHydrated)
}

