import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { AppState, PracticeArea, TaskCard, Todo } from '@/types'

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

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      activePracticeAreaId: 'daily-practice',
      activeView: 'practice-area',
      isSidebarOpen: false,
      practiceAreas: initialPracticeAreas,

      // Navigation actions
      setActivePracticeArea: (id: string) =>
        set({ activePracticeAreaId: id, activeView: 'practice-area' }),

      setActiveView: (view) => set({ activeView: view }),

      setSidebarOpen: (isOpen: boolean) => set({ isSidebarOpen: isOpen }),

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

      addTaskCard: (practiceAreaId: string, title: string) =>
        set((state) => ({
          practiceAreas: state.practiceAreas.map((area) =>
            area.id === practiceAreaId
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
        })),

      addTodo: (practiceAreaId: string, taskCardId: string, text: string) =>
        set((state) => ({
          practiceAreas: state.practiceAreas.map((area) =>
            area.id === practiceAreaId
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
        })),

      toggleTodo: (
        practiceAreaId: string,
        taskCardId: string,
        todoId: string
      ) =>
        set((state) => ({
          practiceAreas: state.practiceAreas.map((area) =>
            area.id === practiceAreaId
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
        })),

      toggleTaskCard: (practiceAreaId: string, taskCardId: string) =>
        set((state) => ({
          practiceAreas: state.practiceAreas.map((area) =>
            area.id === practiceAreaId
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
        })),
    }),
    {
      name: 'fretplan-storage', // localStorage key
      partialize: (state) => ({
        practiceAreas: state.practiceAreas,
        activePracticeAreaId: state.activePracticeAreaId,
      }),
    }
  )
)

