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

// Daily timer record - one per todo per day with accumulated time
export interface TimerDayRecord {
  id: string
  createdAt: Date
  areaId: string
  areaName: string
  areaType: 'practice' | 'project'
  taskCardId: string
  taskCardName: string
  todoId: string
  todoName: string
  totalDuration: number // Accumulated milliseconds for this todo on this day
}

export interface TimerState {
  // Current active timer (only one can be running)
  activeTimer: ActiveTimer | null

  // Daily timer records organized by date
  timers: { [date: string]: TimerDayRecord[] }

  // Midnight detection flag (toggles between 0 and 1)
  midnightFlag: 0 | 1

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

  // Daily timer management
  getTodaysTotalForTodo: (todoId: string) => number
  getTimersForDate: (date: string) => TimerDayRecord[]
  handleMidnightTransition: () => void
}

