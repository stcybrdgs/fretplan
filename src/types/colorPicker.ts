// Color picker component types
export interface ColorPickerState {
  isOpen: boolean
  position: { x: number; y: number }
  targetId: string
  targetType: 'practice-area' | 'project' | 'task-card'
  targetName: string
  currentColor: string
  areaId?: string // For task cards, we need to know which area they belong to
  areaType?: 'practice' | 'project' // For task cards
}

export interface ColorPickerProps {
  isOpen: boolean
  position: { x: number; y: number }
  currentColor: string
  onColorSelect: (color: string) => void
  onClose: () => void
}

