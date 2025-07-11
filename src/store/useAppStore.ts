import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { AppState, PracticeArea, ProjectArea, AreaType } from '@/types'

// Helper function to generate IDs
const generateId = () => Math.random().toString(36).substr(2, 9)

// Initial mock data
const initialPracticeAreas: PracticeArea[] = [
  {
    id: 'daily-practice',
    name: 'Daily Practice',
    color: 'purple',
    createdAt: new Date(),
    taskCards: [
      {
        id: 'card-1',
        title: 'G Dominant Scale Ideas',
        isExpanded: true,
        color: 'green',
        createdAt: new Date(),
        todos: [
          {
            id: 'todo-1',
            text: 'Practice Dm - F - Bb - A progression',
            completed: false,
            createdAt: new Date(),
          },
          {
            id: 'todo-2',
            text: 'Review tritone substitutions',
            completed: true,
            createdAt: new Date(),
          },
          {
            id: 'todo-3',
            text: 'Apply to "Autumn Leaves" in Bb',
            completed: false,
            createdAt: new Date(),
          },
        ],
      },
      {
        id: 'card-2',
        title: 'Autumn Leaves - Bb & G Major',
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
    (set) => ({
      // Initial state
      activePracticeAreaId: 'daily-practice',
      activeProjectId: null,
      activeView: 'practice-area',
      isSidebarOpen: false,
      isDarkMode: false,
      practiceAreas: initialPracticeAreas,
      projects: initialProjects,

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

      addTaskCard: (areaId: string, title: string, areaType: AreaType) =>
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
                        title,
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
        text: string,
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
                                text,
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
    }),

    // Persist configuration
    {
      name: 'fretplan-storage', // localStorage key
      partialize: (state) => ({
        practiceAreas: state.practiceAreas,
        projects: state.projects,
        activePracticeAreaId: state.activePracticeAreaId,
        activeProjectId: state.activeProjectId,
        isDarkMode: state.isDarkMode,
      }),
      onRehydrateStorage: () => (state) => {
        // Apply theme to DOM when store rehydrates
        if (state?.isDarkMode) {
          document.documentElement.classList.add('dark')
        } else {
          document.documentElement.classList.remove('dark')
        }
      },
    }
  )
)

