// Central re-export of all types
// This allows consumers to import from '@/types' without knowing internal structure

// Practice domain types
export type { Todo, TaskCard, PracticeArea } from './practice'

// Project domain types
export type { ProjectArea } from './project'

// UI types
export type { ViewType, AreaType } from './ui'

// Color picker types
export type { ColorPickerState, ColorPickerProps } from './colorPicker'

// Timer types
export type {
  TimerStatus,
  ActiveTimer,
  TimerDayRecord,
  TimerState,
} from './timer'

// Store types
export type { AppState } from './store'

