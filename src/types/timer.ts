// Timer and session tracking types
export type TimerStatus = 'idle' | 'running'

export interface ActiveTimer {
  id: string
  areaId: string
  areaName: string
  areaType: 'practice' | 'project'
  taskCardId: string
  taskCardName: string
  todoId: string
  todoName: string
  startTime: Date
  status: TimerStatus
}

export interface TimerSession {
  id: string
  areaId: string
  areaName: string
  areaType: 'practice' | 'project'
  taskCardId: string
  taskCardName: string
  todoId: string
  todoName: string
  startTime: Date
  endTime: Date
  duration: number // Total duration in milliseconds
  createdAt: Date
}

export interface TimerState {
  // Current active timer (only one can be running)
  activeTimer: ActiveTimer | null

  // Completed sessions for analytics
  sessions: TimerSession[]

  // Timer actions
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

  // Session management
  completeSession: () => void
  getSessionsForArea: (areaId: string) => TimerSession[]
  getSessionsForDateRange: (startDate: Date, endDate: Date) => TimerSession[]
}

