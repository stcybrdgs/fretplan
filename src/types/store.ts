// Store state and actions interface
import { PracticeArea, TaskCard } from './practice'
import { ProjectArea } from './project'
import { ViewType, AreaType } from './ui'
import { TimerDayRecord, ActiveTimer } from './timer'

export interface AppState {
  // Navigation state
  activePracticeAreaId: string | null
  activeProjectId: string | null
  activeView: ViewType
  isSidebarOpen: boolean

  // Data state
  practiceAreas: PracticeArea[]
  projects: ProjectArea[]

  // Timer state
  activeTimer: ActiveTimer | null
  timers: { [date: string]: TimerDayRecord[] }

  _hasHydrated: boolean
  setHasHydrated: (state: boolean) => void

  // Color update actions
  updatePracticeAreaColor: (
    areaId: string,
    newColor: PracticeArea['color']
  ) => void

  updateProjectColor: (
    projectId: string,
    newColor: ProjectArea['color']
  ) => void

  updateTaskCardColor: (
    areaId: string,
    taskCardId: string,
    newColor: TaskCard['color'],
    areaType: AreaType
  ) => void

  // Navigation actions
  setActivePracticeArea: (id: string) => void
  setActiveProject: (id: string) => void
  setActiveView: (view: ViewType) => void
  setSidebarOpen: (isOpen: boolean) => void

  // CRUD operations
  addPracticeArea: (name: string, color: PracticeArea['color']) => void
  addProject: (name: string, color: ProjectArea['color']) => void
  addTaskCard: (
    areaId: string,
    name: string,
    areaType: AreaType,
    color?: TaskCard['color']
  ) => void
  addTodo: (
    areaId: string,
    taskCardId: string,
    name: string,
    areaType: AreaType
  ) => void

  renamePracticeArea: (areaId: string, newName: string) => void
  renameProject: (projectId: string, newName: string) => void
  renameTaskCard: (
    areaId: string,
    taskCardId: string,
    newName: string,
    areaType: AreaType
  ) => void
  deletePracticeArea: (areaId: string) => void
  deleteProject: (projectId: string) => void
  deleteTaskCard: (
    areaId: string,
    taskCardId: string,
    areaType: AreaType
  ) => void

  renameTodo: (
    areaId: string,
    taskCardId: string,
    todoId: string,
    newName: string,
    areaType: AreaType
  ) => void

  deleteTodo: (
    areaId: string,
    taskCardId: string,
    todoId: string,
    areaType: AreaType
  ) => void

  // Toggle actions
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

  // Timer actions (from TimerState interface)
  startTimer: (
    areaId: string,
    areaName: string,
    areaType: 'practice' | 'project',
    taskCardId: string,
    taskCardName: string,
    todoId: string,
    todoName: string
  ) => void
  stopTimer: () => void
  handleMidnightTransition: () => void
}

