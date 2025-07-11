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

export interface ProjectArea {
  id: string
  name: string
  color: 'green' | 'purple' | 'orange' | 'blue' | 'red'
  taskCards: TaskCard[]
  createdAt: Date
}

// UI state types
export type ViewType = 'practice-area' | 'project-area' | 'dashboard' | 'tags'
export type AreaType = 'practice' | 'project'

export interface AppState {
  // Navigation state
  activePracticeAreaId: string | null
  activeProjectId: string | null
  activeView: ViewType
  isSidebarOpen: boolean

  // Theme state
  isDarkMode: boolean

  // Data state
  practiceAreas: PracticeArea[]
  projects: ProjectArea[]

  // Actions
  setActivePracticeArea: (id: string) => void
  setActiveProject: (id: string) => void
  setActiveView: (view: ViewType) => void
  setSidebarOpen: (isOpen: boolean) => void
  toggleTheme: () => void

  // CRUD operations
  addPracticeArea: (name: string, color: PracticeArea['color']) => void
  addProject: (name: string, color: ProjectArea['color']) => void
  addTaskCard: (areaId: string, title: string, areaType: AreaType) => void
  addTodo: (
    areaId: string,
    taskCardId: string,
    text: string,
    areaType: AreaType
  ) => void
  toggleTodo: (
    areaId: string,
    taskCardId: string,
    todoId: string,
    areaType: AreaType
  ) => void
  toggleTaskCard: (
    areaId: string,
    taskCardId: string,
    areaType: AreaType
  ) => void
}

