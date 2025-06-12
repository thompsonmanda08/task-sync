"use client"

import { Button } from "@/components/ui/button"
import { ChevronDown, AlignJustify } from "lucide-react"
import type { Group, Task, User, TodoList } from "@/types"
import { format } from "date-fns"

interface TaskListHeaderProps {
  group: Group | null
  todoList: TodoList | null
  tasks: Task[]
  currentUser: User
}

export function TaskListHeader({ group, todoList, tasks, currentUser }: TaskListHeaderProps) {
  if (!todoList) {
    return null
  }

  const today = format(new Date(), "EEEE, d MMMM yyyy")
  const completedTasks = tasks.filter((task) => task.completed).length
  const totalTasks = tasks.length
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  return (
    <div className="mb-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            {todoList.emoji && <span>{todoList.emoji}</span>}
            {todoList.name}
          </h1>
          <p className="text-gray-500">
            {group?.name} • {completedTasks}/{totalTasks} tasks completed ({progress}%)
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-1">
            Today
            <ChevronDown className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <AlignJustify className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
