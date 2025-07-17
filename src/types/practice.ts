// Practice-related types
export interface Todo {
  id: string
  name: string
  completed: boolean
  createdAtUTC: Date
}

export interface TaskCard {
  id: string
  name: string
  isExpanded: boolean
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
  todos: Todo[]
  createdAtUTC: Date
}

export interface PracticeArea {
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
  createdAtUTC: Date
}

