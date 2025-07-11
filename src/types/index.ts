// Core data models for FretPlan
export interface Todo {
  id: string
  text: string
  completed: boolean
  createdAt: Date
}

export interface TaskCard {
  id: string
  title: string
  isExpanded: boolean
  color: 'green' | 'purple' | 'orange' | 'blue' | 'red'
  todos: Todo[]
  createdAt: Date
}

export interface PracticeArea {
  id: string
  name: string
  color: 'green' | 'purple' | 'orange' | 'blue' | 'red'
  taskCards: TaskCard[]
  createdAt: Date
}

// UI state types
export type ViewType = 'practice-area' | 'dashboard' | 'tags'

export interface AppState {
  // Navigation state
  activePracticeAreaId: string | null
  activeView: ViewType
  isSidebarOpen: boolean

  // Data state
  practiceAreas: PracticeArea[]

  // Actions
  setActivePracticeArea: (id: string) => void
  setActiveView: (view: ViewType) => void
  setSidebarOpen: (isOpen: boolean) => void

  // CRUD operations
  addPracticeArea: (name: string, color: PracticeArea['color']) => void
  addTaskCard: (practiceAreaId: string, title: string) => void
  addTodo: (practiceAreaId: string, taskCardId: string, text: string) => void
  toggleTodo: (
    practiceAreaId: string,
    taskCardId: string,
    todoId: string
  ) => void
  toggleTaskCard: (practiceAreaId: string, taskCardId: string) => void
}
