"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search } from "lucide-react"
import type { TodoList, Group } from "@/types"

interface TodoListGridProps {
  group: Group | null
  todoLists: TodoList[]
  onSelectTodoList: (todoListId: string) => void
  onCreateTodoList: (name: string) => void
}

export function TodoListGrid({ group, todoLists, onSelectTodoList, onCreateTodoList }: TodoListGridProps) {
  const [newListName, setNewListName] = useState("")
  const [isCreating, setIsCreating] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  const handleCreateList = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newListName.trim()) return

    onCreateTodoList(newListName.trim())
    setNewListName("")
    setIsCreating(false)
  }

  const filteredTodoLists = todoLists.filter((list) => list.name.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">{group ? `${group.name} Lists` : "Home Lists"}</h2>
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search lists..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-full"
            />
          </div>
          <Button onClick={() => setIsCreating(true)} variant="outline">
            <Plus className="mr-2 h-4 w-4" />
            Create New List
          </Button>
        </div>
      </div>

      {/* Create New List Form */}
      {isCreating && (
        <form onSubmit={handleCreateList} className="mb-6 p-4 border border-gray-200 rounded-lg">
          <h3 className="text-lg font-medium mb-4">Create New Todo List</h3>
          <div className="grid gap-4">
            <div>
              <label htmlFor="listName" className="block text-sm font-medium text-gray-700 mb-1">
                List Name
              </label>
              <Input
                ref={inputRef}
                id="listName"
                type="text"
                placeholder="Enter list name..."
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                className="w-full"
                autoFocus
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsCreating(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={!newListName.trim()}>
                Create List
              </Button>
            </div>
          </div>
        </form>
      )}

      {/* Todo Lists Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTodoLists.length > 0 ? (
          filteredTodoLists.map((todoList) => (
            <button
              key={todoList.id}
              className="p-6 rounded-lg border border-gray-200 hover:border-blue-200 hover:bg-blue-50 transition-colors text-left"
              onClick={() => onSelectTodoList(todoList.id)}
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{todoList.emoji || "📋"}</span>
                <h3 className="font-semibold text-lg">{todoList.name}</h3>
              </div>
              <p className="text-sm text-gray-500">
                {todoList.count || 0} {todoList.count === 1 ? "task" : "tasks"}
              </p>
            </button>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <h3 className="text-lg font-medium text-gray-500">No todo lists found</h3>
            <p className="text-gray-400 mt-1">
              {searchQuery ? "Try a different search term" : "Create your first todo list to get started"}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
