// Practice-related types
export interface Todo {
  id: string
  text: string
  completed: boolean
  createdAt: Date
}

export interface TaskCard {
  id: string
  title: string
  isExpanded: boolean
  color: 'green' | 'purple' | 'orange' | 'blue' | 'red'
  todos: Todo[]
  createdAt: Date
}

export interface PracticeArea {
  id: string
  name: string
  color: 'green' | 'purple' | 'orange' | 'blue' | 'red'
  taskCards: TaskCard[]
  createdAt: Date
}
