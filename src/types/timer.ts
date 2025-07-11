// Timer and session tracking types
export type TimerStatus = 'idle' | 'running' | 'paused'

export interface ActiveTimer {
  id: string
  areaId: string
  areaName: string
  areaType: 'practice' | 'project'
  taskCardId: string
  taskCardTitle: string
  description: string // Always present, empty string if not provided
  startTime: Date
  pausedTime?: number // Total paused time in milliseconds
  status: TimerStatus
  pauseStartTime?: Date
}

export interface TimerSession {
  id: string
  areaId: string
  areaName: string
  areaType: 'practice' | 'project'
  taskCardId: string
  taskCardTitle: string
  description: string // Always present, empty string if not provided
  startTime: Date
  endTime: Date
  duration: number // Total duration in milliseconds
  pausedTime: number // Total paused time in milliseconds
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
    taskCardTitle: string,
    description?: string // Optional input, but stored as empty string if not provided
  ) => void

  stopTimer: () => void
  pauseTimer: () => void
  resumeTimer: () => void

  // Session management
  completeSession: () => void
  getSessionsForArea: (areaId: string) => TimerSession[]
  getSessionsForDateRange: (startDate: Date, endDate: Date) => TimerSession[]
}

