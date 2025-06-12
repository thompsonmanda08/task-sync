"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search } from "lucide-react"
import type { TodoList, Group } from "@/types"

interface TodoListPanelProps {
  group: Group | null
  todoLists: TodoList[]
  selectedTodoListId: string | null
  onSelectTodoList: (todoListId: string) => void
  onCreateTodoList: (name: string) => void
}

export function TodoListPanel({
  group,
  todoLists,
  selectedTodoListId,
  onSelectTodoList,
  onCreateTodoList,
}: TodoListPanelProps) {
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
    <div className="p-4 md:p-6 h-full flex flex-col">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-2">{group ? `${group.name} Lists` : "Home Lists"}</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search lists..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 w-full"
          />
        </div>
      </div>

      {/* Create New List Form */}
      {isCreating ? (
        <form onSubmit={handleCreateList} className="mb-4">
          <div className="flex items-center gap-2">
            <Input
              ref={inputRef}
              type="text"
              placeholder="Enter list name..."
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              className="flex-1"
              autoFocus
            />
            <Button type="submit" disabled={!newListName.trim()}>
              Create
            </Button>
            <Button type="button" variant="outline" onClick={() => setIsCreating(false)}>
              Cancel
            </Button>
          </div>
        </form>
      ) : (
        <Button onClick={() => setIsCreating(true)} className="mb-4 w-full justify-start" variant="outline">
          <Plus className="mr-2 h-4 w-4" />
          Create New List
        </Button>
      )}

      {/* Todo Lists */}
      <div className="space-y-2 overflow-y-auto flex-1">
        {filteredTodoLists.length > 0 ? (
          filteredTodoLists.map((todoList) => (
            <button
              key={todoList.id}
              className={`w-full p-3 text-left flex items-center justify-between rounded-lg border ${
                selectedTodoListId === todoList.id
                  ? "border-blue-200 bg-blue-50"
                  : "border-gray-200 hover:border-blue-100 hover:bg-blue-50"
              } transition-colors`}
              onClick={() => onSelectTodoList(todoList.id)}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{todoList.emoji || "📋"}</span>
                <div>
                  <h3 className="font-medium">{todoList.name}</h3>
                  <p className="text-xs text-gray-500">
                    {todoList.count || 0} {todoList.count === 1 ? "task" : "tasks"}
                  </p>
                </div>
              </div>
            </button>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No lists found</p>
            {searchQuery ? (
              <p className="text-sm text-gray-400 mt-1">Try a different search term</p>
            ) : (
              <p className="text-sm text-gray-400 mt-1">Create your first list to get started</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
