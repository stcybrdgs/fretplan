// Project-related types (reuses TaskCard and Todo from practice)
import { TaskCard } from './practice'

export interface ProjectArea {
  id: string
  name: string
  color:
    | 'green'
    | 'purple'
    | 'orange'
    | 'blue'
    | 'red'
    | 'yellow'
    | 'teal'
    | 'indigo'
    | 'pink'
    | 'gray'
  taskCards: TaskCard[]
  createdAt: Date
}

