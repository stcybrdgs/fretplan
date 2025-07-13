// Store state and actions interface
import { PracticeArea } from './practice'
import { ProjectArea } from './project'
import { ViewType, AreaType } from './ui'
import { TimerDayRecord, ActiveTimer } from './timer' // Import timer types

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

  // Timer state
  // Timer state (from TimerState interface)
  activeTimer: ActiveTimer | null
  timers: { [date: string]: TimerDayRecord[] }
  midnightFlag: 0 | 1

  // Navigation actions
  setActivePracticeArea: (id: string) => void
  setActiveProject: (id: string) => void
  setActiveView: (view: ViewType) => void
  setSidebarOpen: (isOpen: boolean) => void
  toggleTheme: () => void

  // CRUD operations
  addPracticeArea: (name: string, color: PracticeArea['color']) => void
  addProject: (name: string, color: ProjectArea['color']) => void
  addTaskCard: (areaId: string, name: string, areaType: AreaType) => void
  addTodo: (
    areaId: string,
    taskCardId: string,
    name: string,
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
  getTodaysTotalForTodo: (todoId: string) => number
  getTimersForDate: (date: string) => TimerDayRecord[]
  handleMidnightTransition: () => void
}
