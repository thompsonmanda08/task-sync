"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, ArrowLeft } from "lucide-react"
import { useState, useRef } from "react"
import type { TodoList, Group } from "@/types"

interface TodoListViewProps {
  group: Group
  todoLists: TodoList[]
  onSelectTodoList: (todoListId: string) => void
  onCreateTodoList: (name: string) => void
  onBack: () => void
}

export function TodoListView({ group, todoLists, onSelectTodoList, onCreateTodoList, onBack }: TodoListViewProps) {
  const [newListName, setNewListName] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  const handleCreateList = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newListName.trim()) return

    onCreateTodoList(newListName.trim())
    setNewListName("")
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            {group.emoji && <span>{group.emoji}</span>}
            {group.name}
          </h1>
          <p className="text-gray-500">Choose a todo list to view tasks</p>
        </div>
      </div>

      {/* Create New List Form */}
      <form onSubmit={handleCreateList} className="mb-6">
        <div className="flex items-center border border-gray-200 rounded-full overflow-hidden bg-white shadow-sm">
          <Input
            ref={inputRef}
            type="text"
            placeholder="Create new todo list..."
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
            className="flex-1 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-full"
          />
          <Button
            type="submit"
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-full text-gray-500"
            disabled={!newListName.trim()}
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>
      </form>

      {/* Todo Lists Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {todoLists.map((todoList) => (
          <button
            key={todoList.id}
            className="p-6 rounded-lg border border-gray-200 hover:border-blue-200 hover:bg-blue-50 transition-colors text-left"
            onClick={() => onSelectTodoList(todoList.id)}
          >
            <div className="flex items-center gap-3 mb-2">
              {todoList.emoji && <span className="text-2xl">{todoList.emoji}</span>}
              <h3 className="font-semibold text-lg">{todoList.name}</h3>
            </div>
            <p className="text-sm text-gray-500">
              {todoList.count || 0} {todoList.count === 1 ? "task" : "tasks"}
            </p>
          </button>
        ))}

        {todoLists.length === 0 && (
          <div className="col-span-full text-center py-12">
            <h3 className="text-lg font-medium text-gray-500">No todo lists found</h3>
            <p className="text-gray-400 mt-1">Create your first todo list to get started</p>
          </div>
        )}
      </div>
    </div>
  )
}
