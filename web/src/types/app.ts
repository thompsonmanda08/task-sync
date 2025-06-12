import { User } from "./auth"

export type UserRole = "Owner" | "Admin" | "Contributor" | "Viewer"
export type Permissions = "create" | "Admin" | "Contributor" | "Viewer"

export type GroupMember =  {
  userId: string
  role: {
    name: UserRole,
    permissions: Partial<Permissions[]>
  }
}

export type Group =  {
  id: string
  name: string
  type: "personal" | "shared"
  ownerId: string
  members?: GroupMember[]
  peopleCount?: number
  count?: number
  emoji?: string
  isDefault?: boolean
}

export type TodoList = {
  id: string
  groupId: string
  name: string
  emoji?: string
  count?: number
  createdAt: string
}

export type Task = {
  id: string
  todoListId: string
  title: string
  description?: string
  completed: boolean
  createdAt: string
  dueDate?: string
  startTime?: string
  endTime?: string
  assigneeId?: string
  assignees?: User[]
  emoji?: string
  invitedEmails?: string[]
}

