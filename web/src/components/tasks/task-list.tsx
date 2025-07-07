"use client"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Edit2, Trash2 } from "lucide-react"
import type { Task, User } from "@/types"

interface TaskListProps {
  tasks: Task[]
  users: User[]
  onToggleComplete: (taskId: string) => void
  onEditTask: (task: Task) => void
  onDeleteTask: (taskId: string) => void
}

export function TaskList({ tasks, users, onToggleComplete, onEditTask, onDeleteTask }: TaskListProps) {
  // Get user by ID
  const getUserById = (userId: string): User | undefined => {
    return users.find((user) => user.id === userId)
  }

  // Format time range
  const formatTimeRange = (startTime?: string, endTime?: string): string => {
    if (!startTime) return ""
    if (!endTime) return startTime
    return `${startTime} - ${endTime}`
  }

  return (
    <div className="space-y-3">
      {tasks.length > 0 ? (
        tasks.map((task) => {
          const assignee = task.assigneeId ? getUserById(task.assigneeId) : undefined
          const timeRange = formatTimeRange(task.startTime, task.endTime)

          return (
            <div
              key={task.id}
              className="border-b border-gray-100 py-4 group hover:bg-gray-50 rounded-lg transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <Checkbox
                    checked={task.completed}
                    onCheckedChange={() => onToggleComplete(task.id)}
                    className="mt-1"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className={`font-medium ${task.completed ? "text-gray-400 line-through" : ""}`}>
                      {task.title} {task.emoji && <span>{task.emoji}</span>}
                    </h4>
                    {task.description && <p className="text-sm text-blue-500 mt-1 truncate">{task.description}</p>}
                    {task.invitedEmails && task.invitedEmails.length > 0 && (
                      <p className="text-xs text-gray-400 mt-1">Invited: {task.invitedEmails.join(", ")}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {/* Show assignees if available */}
                  {task.assignees && task.assignees.length > 0 && (
                    <div className="flex -space-x-2">
                      {task.assignees.slice(0, 3).map((user) => (
                        <Avatar key={user.id} className="h-6 w-6 border-2 border-white">
                          <AvatarImage src={user.avatarUrl || "/placeholder.svg?height=24&width=24"} alt={user.name} />
                          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                      ))}
                    </div>
                  )}

                  {/* Time range */}
                  {timeRange && (
                    <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full whitespace-nowrap">
                      {timeRange}
                    </div>
                  )}

                  {/* Edit and Delete Icons */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-gray-500 hover:text-blue-600"
                      onClick={() => onEditTask(task)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-gray-500 hover:text-red-600"
                      onClick={() => onDeleteTask(task.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )
        })
      ) : (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-500">No tasks found</h3>
          <p className="text-gray-400 mt-1">Create a new task to get started</p>
        </div>
      )}
    </div>
  )
}
