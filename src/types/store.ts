// Store state and actions interface
import { PracticeArea } from './practice'
import { ProjectArea } from './project'
import { ViewType, AreaType } from './ui'

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
