"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { TaskListHeader } from "@/components/tasks/task-list-header"
import { TaskList } from "@/components/tasks/task-list"
import { TaskForm } from "@/components/tasks/task-form"
import { TodoListPanel } from "@/components/todo-lists/todo-list-panel"
import { TodoListGrid } from "@/components/todo-lists/todo-list-grid"
import { GroupEditModal } from "@/components/groups/group-edit-modal"
import type { Group, Task,  UserRole, TodoList } from "@/types/app"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChevronLeft, ChevronRight, Plus, X, ListPlus, ArrowLeft, MoreVertical, List } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import { User } from "@/types/auth"
import { useIsMobile } from "@/hooks/use-mobile"
import { addToast } from "@heroui/react"

// Mock Data
const MOCK_USER: User = {
  id: "user-1",
  name: "Sullivan",
  email: "sullivan@example.com",
  avatarUrl: "https://placehold.co/100x100.png",
}

const MOCK_USERS: User[] = [
  MOCK_USER,
  { id: "user-2", name: "Maria Garcia", email: "maria.g@example.com", avatarUrl: "https://placehold.co/100x100.png" },
  { id: "user-3", name: "Kenji Tanaka", email: "kenji.t@example.com", avatarUrl: "https://placehold.co/100x100.png" },
]

type ViewState = "todoLists" | "tasks"

const App
: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>([])
  const [todoLists, setTodoLists] = useState<TodoList[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null)
  const [selectedTodoListId, setSelectedTodoListId] = useState<string | null>(null)
  const [viewState, setViewState] = useState<ViewState>("todoLists")
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false)
  const [isGroupEditModalOpen, setIsGroupEditModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [newTaskTitle, setNewTaskTitle] = useState("")
  const [newGroupName, setNewGroupName] = useState("")
  const [newListName, setNewListName] = useState("")
  
  const isMobile = useIsMobile()
  const newTaskInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Close sidebar on mobile by default
    if (isMobile) {
      setSidebarOpen(false)
    }
  }, [isMobile])

  useEffect(() => {
    const initialGroups: Group[] = [
      {
        id: "group-home",
        name: "HOME",
        type: "personal",
        ownerId: MOCK_USER.id,
        count: 8,
        emoji: "🏠",
        isDefault: true,
      },
      {
        id: "group-mobal-project",
        name: "Mobal Project",
        type: "shared",
        ownerId: "user-2",
        members: [{ userId: MOCK_USER.id, role: "Editor" }],
        peopleCount: 5,
      },
      {
        id: "group-futur-project",
        name: "Futur Project",
        type: "shared",
        ownerId: "user-3",
        members: [{ userId: MOCK_USER.id, role: "Viewer" }],
        peopleCount: 4,
      },
      {
        id: "group-design-team",
        name: "Design Team",
        type: "shared",
        ownerId: "user-2",
        members: [{ userId: MOCK_USER.id, role: "Editor" }],
        peopleCount: 7,
      },
      {
        id: "group-marketing",
        name: "Marketing",
        type: "shared",
        ownerId: "user-3",
        members: [{ userId: MOCK_USER.id, role: "Viewer" }],
        peopleCount: 3,
      },
      {
        id: "group-product",
        name: "Product",
        type: "shared",
        ownerId: "user-2",
        members: [{ userId: MOCK_USER.id, role: "Editor" }],
        peopleCount: 6,
      },
    ]
    setGroups(initialGroups)

    const initialTodoLists: TodoList[] = [
      {
        id: "list-home",
        groupId: "group-home",
        name: "HOME",
        emoji: "🏠",
        count: 3,
        createdAt: new Date().toISOString(),
      },
      {
        id: "list-2",
        groupId: "group-mobal-project",
        name: "Design Tasks",
        emoji: "🎨",
        count: 2,
        createdAt: new Date().toISOString(),
      },
      {
        id: "list-3",
        groupId: "group-mobal-project",
        name: "Development",
        emoji: "💻",
        count: 1,
        createdAt: new Date().toISOString(),
      },
      {
        id: "list-4",
        groupId: "group-futur-project",
        name: "Planning",
        emoji: "📝",
        count: 1,
        createdAt: new Date().toISOString(),
      },
    ]
    setTodoLists(initialTodoLists)

    const initialTasks: Task[] = [
      {
        id: "task-1",
        todoListId: "list-home",
        title: "Read a book",
        completed: false,
        createdAt: new Date().toISOString(),
        startTime: "06:00",
        endTime: "07:30",
        emoji: "📚",
      },
      {
        id: "task-2",
        todoListId: "list-home",
        title: "Morning exercise",
        completed: true,
        createdAt: new Date().toISOString(),
        startTime: "07:00",
        endTime: "08:00",
        emoji: "🏃",
      },
      {
        id: "task-3",
        todoListId: "list-2",
        title: "Wireframing new product",
        completed: false,
        createdAt: new Date().toISOString(),
        startTime: "08:00",
        endTime: "09:00",
        emoji: "🟦",
      },
      {
        id: "task-4",
        todoListId: "list-3",
        title: "Moodboard Landing Page",
        description: "# Mobal Project",
        completed: false,
        createdAt: new Date().toISOString(),
        startTime: "11:00",
        endTime: "13:00",
        assigneeId: "user-2",
        emoji: "🟦",
        invitedEmails: ["designer@example.com"],
      },
      {
        id: "task-5",
        todoListId: "list-4",
        title: "Weekly meeting",
        description: "Discuss project timeline",
        completed: false,
        createdAt: new Date().toISOString(),
        startTime: "13:00",
        endTime: "14:00",
        assignees: [MOCK_USERS[0], MOCK_USERS[1], MOCK_USERS[2]],
        emoji: "🟦",
      },
    ]
    setTasks(initialTasks)

    // Set default selections
    setSelectedGroupId("group-home")
    setSelectedTodoListId("list-home")
  }, [])

  const selectedGroup = groups.find((group) => group.id === selectedGroupId) || null
  const selectedTodoList = todoLists.find((list) => list.id === selectedTodoListId) || null
  const isPersonalGroup = selectedGroup?.type === "personal"

  // Get todo lists for the selected group or home group if none selected
  const todoListsForSelectedGroup = selectedGroupId
    ? todoLists.filter((list) => list.groupId === selectedGroupId)
    : todoLists.filter((list) => list.groupId === "group-home")

  // Get tasks for the selected todo list
  const tasksForSelectedTodoList = selectedTodoListId
    ? tasks.filter((task) => task.todoListId === selectedTodoListId)
    : []

  const currentUserRole: UserRole = selectedGroup
    ? selectedGroup.ownerId === MOCK_USER.id
      ? "Owner"
      : selectedGroup.members?.find((m) => m.userId === MOCK_USER.id)?.role || "Viewer"
    : "Viewer"

  const handleCreateGroup = (name: string, type: "personal" | "shared" = "personal") => {
    if (!name.trim()) return

    const newGroup: Group = {
      id: `group-${Date.now()}`,
      name,
      type,
      ownerId: MOCK_USER.id,
      peopleCount: type === "shared" ? 1 : undefined,
      count: 0,
    }
    setGroups((prev) => [...prev, newGroup])
    setSelectedGroupId(newGroup.id)
    setViewState("todoLists")
    addToast({ title: "Group Created!", description: `Group "${name}" has been successfully created.`, color: "success"
     })
  }

  const handleSubmitNewGroup = (e: React.FormEvent) => {
    e.preventDefault()
    if (newGroupName.trim()) {
      handleCreateGroup(newGroupName, "shared")
      setNewGroupName("")
    }
  }

  const handleSubmitNewList = (e: React.FormEvent) => {
    e.preventDefault()
    if (newListName.trim()) {
      handleCreateGroup(newListName, "personal")
      setNewListName("")
    }
  }

  const handleSelectGroup = (groupId: string) => {
    setSelectedGroupId(groupId)

    // Special case for HOME group
    if (groupId === "group-home") {
      const homeTodoList = todoLists.find((list) => list.groupId === "group-home")
      if (homeTodoList) {
        setSelectedTodoListId(homeTodoList.id)
      }
    } else {
      // For other groups, reset the selected todo list
      setSelectedTodoListId(null)
      setViewState("todoLists")
    }

    if (isMobile) {
      setSidebarOpen(false)
    }
  }

  const handleUpdateGroup = (groupData: Partial<Group>) => {
    if (!selectedGroupId) return

    setGroups((prevGroups) =>
      prevGroups.map((group) => (group.id === selectedGroupId ? { ...group, ...groupData } : group)),
    )

    addToast({
      title: "Group Updated!",
      description: `Group settings have been updated successfully.`,
    })

    setIsGroupEditModalOpen(false)
  }

  const handleInviteUsers = (emails: string[], role: UserRole) => {
    if (!selectedGroupId || emails.length === 0) return

    // In a real app, you would send invitations to these emails
    // For now, we'll just update the group's peopleCount
    setGroups((prevGroups) =>
      prevGroups.map((group) =>
        group.id === selectedGroupId
          ? {
              ...group,
              peopleCount: (group.peopleCount || 1) + emails.length,
            }
          : group,
      ),
    )

    addToast({
      title: "Invitations Sent!",
      description: `Invitations sent to ${emails.length} user${emails.length > 1 ? "s" : ""}.`,
    })
  }

  const handleCreateTodoList = (name: string) => {
    if (!selectedGroupId) return

    const newTodoList: TodoList = {
      id: `list-${Date.now()}`,
      groupId: selectedGroupId,
      name,
      count: 0,
      createdAt: new Date().toISOString(),
    }
    setTodoLists((prev) => [...prev, newTodoList])

    // For personal groups, automatically select the new list and show tasks
    if (isPersonalGroup) {
      setSelectedTodoListId(newTodoList.id)
      setViewState("tasks")
    }

    addToast({ title: "Todo List Created!", description: `"${name}" has been successfully created.` })
  }

  const handleSelectTodoList = (todoListId: string) => {
    setSelectedTodoListId(todoListId)

    // For personal groups, switch to tasks view
    if (isPersonalGroup) {
      setViewState("tasks")
    }

    // Focus the new task input when selecting a todo list
    setTimeout(() => {
      if (newTaskInputRef.current) {
        newTaskInputRef.current.focus()
      }
    }, 100)
  }

  const handleBackToTodoLists = () => {
    setSelectedTodoListId(null)
    setViewState("todoLists")
  }

  const handleToggleTaskComplete = (taskId: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === taskId ? { ...task, completed: !task.completed } : task)),
    )
    const task = tasks.find((t) => t.id === taskId)
    if (task) {
      addToast({
        title: task.completed ? "Task Marked Incomplete" : "Task Completed!",
        description: `"${task.title}" status updated.`,
      })
    }
  }

  const handleOpenTaskForm = (taskToEdit?: Task) => {
    setEditingTask(taskToEdit || null)
    setIsTaskFormOpen(true)
  }

  const handleTaskFormSubmit = (taskData: Partial<Task>) => {
    if (editingTask && editingTask.id) {
      setTasks((prevTasks) => prevTasks.map((t) => (t.id === editingTask.id ? { ...t, ...taskData } : t)))
      addToast({ title: "Task Updated!", description: `"${taskData.title || editingTask.title}" has been updated.` })
    } else {
      const newTask: Task = {
        id: `task-${Date.now()}`,
        todoListId: selectedTodoListId!,
        completed: false,
        createdAt: new Date().toISOString(),
        ...taskData,
      } as Task
      setTasks((prevTasks) => [newTask, ...prevTasks])

      // Update todo list count
      setTodoLists((prevLists) =>
        prevLists.map((list) => (list.id === selectedTodoListId ? { ...list, count: (list.count || 0) + 1 } : list)),
      )

      addToast({ title: "Task Created!", description: `"${taskData.title}" has been added.` })
    }
    setEditingTask(null)
  }

  const handleCreateQuickTask = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTaskTitle.trim() || !selectedTodoListId) return

    const newTask: Task = {
      id: `task-${Date.now()}`,
      todoListId: selectedTodoListId,
      title: newTaskTitle,
      completed: false,
      createdAt: new Date().toISOString(),
    } as Task

    setTasks((prevTasks) => [newTask, ...prevTasks])

    // Update todo list count
    setTodoLists((prevLists) =>
      prevLists.map((list) => (list.id === selectedTodoListId ? { ...list, count: (list.count || 0) + 1 } : list)),
    )

    addToast({ title: "Task Created!", description: `"${newTaskTitle}" has been added.` })
    setNewTaskTitle("")
  }

  const handleDeleteTask = (taskId: string) => {
    const taskToDelete = tasks.find((t) => t.id === taskId)
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId))

    // Update todo list count
    if (taskToDelete) {
      setTodoLists((prevLists) =>
        prevLists.map((list) =>
          list.id === taskToDelete.todoListId ? { ...list, count: Math.max(0, (list.count || 0) - 1) } : list,
        ),
      )
      addToast({ title: "Task Deleted", description: `"${taskToDelete.title}" has been removed.`, variant: "destructive" })
    }
  }



  // Sidebar component
  const Sidebar = () => {
    const personalGroups = groups.filter((group) => group.type === "personal")
    const sharedGroups = groups.filter((group) => group.type === "shared")

    return (
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0`}
      >
        <div className="flex flex-col h-full overflow-y-auto">
          {/* Logo and Avatar */}
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-blue-500 mr-2"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
              <span className="font-bold text-lg">TaskFlow</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
              >
                {sidebarOpen ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
              </button>
              <Avatar className="h-8 w-8">
                <AvatarImage src={MOCK_USER.avatarUrl || "/placeholder.svg"} alt={MOCK_USER.name} />
                <AvatarFallback>{MOCK_USER.name.charAt(0)}</AvatarFallback>
              </Avatar>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {/* My Lists Section */}
            <div className="p-4">
              <div className="sticky top-0 bg-white pb-2 z-10">
                <h2 className="text-lg font-bold mb-2">My Lists</h2>
                <form onSubmit={handleSubmitNewList} className="mb-3">
                  <div className="flex items-center border border-gray-200 rounded-md overflow-hidden">
                    <Input
                      type="text"
                      placeholder="Create new list..."
                      value={newListName}
                      onChange={(e) => setNewListName(e.target.value)}
                      className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                    <Button
                      type="submit"
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 text-gray-500"
                      disabled={!newListName.trim()}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </form>
              </div>

              <div className="space-y-1 overflow-y-auto">
                {personalGroups.map((group) => (
                  <button
                    key={group.id}
                    className={`w-full px-3 py-2 text-left text-sm flex items-center justify-between rounded-md ${
                      selectedGroupId === group.id ? "bg-gray-100 font-medium" : "text-gray-700 hover:bg-gray-50"
                    }`}
                    onClick={() => handleSelectGroup(group.id)}
                  >
                    <div className="flex items-center">
                      <span className="mr-2 text-base">{group.emoji || <List className="h-4 w-4" />}</span>
                      <span>{group.name}</span>
                    </div>
                    <span className="text-gray-500">{group.count}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Groups Section */}
            <div className="p-4 border-t border-gray-200 mt-2 flex flex-col">
              {/* Sticky header and input */}
              <div className="sticky top-0 bg-white pb-2 z-10">
                <h2 className="text-lg font-bold mb-2">Groups</h2>
                <form onSubmit={handleSubmitNewGroup} className="mb-3">
                  <div className="flex items-center border border-gray-200 rounded-md overflow-hidden">
                    <Input
                      type="text"
                      placeholder="Create new group..."
                      value={newGroupName}
                      onChange={(e) => setNewGroupName(e.target.value)}
                      className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                    <Button
                      type="submit"
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 text-gray-500"
                      disabled={!newGroupName.trim()}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </form>
              </div>

              {/* Scrollable groups */}
              <div className="overflow-y-auto max-h-60 pr-1">
                <div className="space-y-2">
                  {sharedGroups.map((group) => (
                    <button
                      key={group.id}
                      className={`p-3 rounded-lg border w-full ${
                        selectedGroupId === group.id
                          ? "border-blue-200 bg-blue-50"
                          : "border-gray-200 hover:border-blue-100 hover:bg-blue-50"
                      } flex flex-col items-start`}
                      onClick={() => handleSelectGroup(group.id)}
                    >
                      <div className="flex -space-x-2 mb-2">
                        {Array.from({ length: Math.min(3, group.peopleCount || 3) }).map((_, i) => (
                          <div
                            key={i}
                            className="w-7 h-7 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs border-2 border-white"
                          >
                            {String.fromCharCode(65 + i)}
                          </div>
                        ))}
                      </div>
                      <span className="font-medium text-sm truncate w-full">{group.name}</span>
                      <span className="text-xs text-gray-500">{group.peopleCount} People</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Group header with dots menu
  const GroupHeader = () => {
    if (!selectedGroup) return null

    return (
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">{selectedGroup.name}</h1>
          <p className="text-gray-500">
            {selectedGroup.type === "shared" ? `${selectedGroup.peopleCount || 1} members` : "Personal list"}
          </p>
        </div>

        {selectedGroup.type === "shared" && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setIsGroupEditModalOpen(true)}>Group Settings</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    )
  }

  // Render the main content based on group type and view state
  const renderMainContent = () => {
    // Special case for HOME group - directly show tasks
    if (selectedGroupId === "group-home") {
      // Find the default HOME todo list
      const homeTodoList = todoLists.find((list) => list.groupId === "group-home") || null

      if (homeTodoList) {
        // If we haven't selected a todo list yet, select the home list
        if (!selectedTodoListId) {
          setSelectedTodoListId(homeTodoList.id)
        }

        const currentTodoList = todoLists.find((list) => list.id === selectedTodoListId)
        const tasksToShow = tasks.filter((task) => task.todoListId === selectedTodoListId)

        return (
          <div className="p-4 md:p-8 relative">
            <TaskListHeader
              group={selectedGroup}
              todoList={currentTodoList}
              tasks={tasksToShow}
              currentUser={MOCK_USER}
            />

            <TaskList
              tasks={tasksToShow}
              users={MOCK_USERS}
              onToggleComplete={handleToggleTaskComplete}
              onEditTask={handleOpenTaskForm}
              onDeleteTask={handleDeleteTask}
            />

            {/* Floating New Task Input Form */}
            {selectedTodoListId && (
              <form
                onSubmit={handleCreateQuickTask}
                className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-40 w-full max-w-md px-4"
              >
                <div className="flex items-center bg-black rounded-full overflow-hidden shadow-xl">
                  <Input
                    ref={newTaskInputRef}
                    type="text"
                    placeholder="Create new task..."
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    className="flex-1 border-0 bg-transparent text-white placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                  <Button
                    type="submit"
                    variant="ghost"
                    size="icon"
                    className="h-12 w-12 rounded-full text-white"
                    disabled={!newTaskTitle.trim()}
                  >
                    <X className="h-5 w-5 transform rotate-45" />
                  </Button>
                </div>
              </form>
            )}
          </div>
        )
      }
    }

    // For other personal groups
    else if (isPersonalGroup) {
      if (viewState === "todoLists") {
        return (
          <div className="p-4 md:p-8">
            <GroupHeader />
            <TodoListGrid
              group={selectedGroup}
              todoLists={todoListsForSelectedGroup}
              onSelectTodoList={handleSelectTodoList}
              onCreateTodoList={handleCreateTodoList}
            />
          </div>
        )
      } else {
        // Tasks view for personal groups
        return (
          <div className="p-4 md:p-8 relative">
            <div className="mb-6">
              <Button variant="ghost" onClick={handleBackToTodoLists} className="mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Lists
              </Button>
              <TaskListHeader
                group={selectedGroup}
                todoList={selectedTodoList}
                tasks={tasksForSelectedTodoList}
                currentUser={MOCK_USER}
              />
            </div>

            <TaskList
              tasks={tasksForSelectedTodoList}
              users={MOCK_USERS}
              onToggleComplete={handleToggleTaskComplete}
              onEditTask={handleOpenTaskForm}
              onDeleteTask={handleDeleteTask}
            />

            {/* Floating New Task Input Form */}
            {selectedTodoListId && (
              <form
                onSubmit={handleCreateQuickTask}
                className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-40 w-full max-w-md px-4"
              >
                <div className="flex items-center bg-black rounded-full overflow-hidden shadow-xl">
                  <Input
                    ref={newTaskInputRef}
                    type="text"
                    placeholder="Create new task..."
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    className="flex-1 border-0 bg-transparent text-white placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                  <Button
                    type="submit"
                    variant="ghost"
                    size="icon"
                    className="h-12 w-12 rounded-full text-white"
                    disabled={!newTaskTitle.trim()}
                  >
                    <X className="h-5 w-5 transform rotate-45" />
                  </Button>
                </div>
              </form>
            )}
          </div>
        )
      }
    }
    // For shared groups - side by side view
    else if (selectedGroup) {
      return (
        <div className="flex flex-1 overflow-hidden">
          {/* Left side - Todo Lists */}
          <div className="w-1/3 border-r border-gray-200 overflow-y-auto">
            <div className="p-4 border-b border-gray-200">
              <GroupHeader />
            </div>
            <TodoListPanel
              group={selectedGroup}
              todoLists={todoListsForSelectedGroup}
              selectedTodoListId={selectedTodoListId}
              onSelectTodoList={handleSelectTodoList}
              onCreateTodoList={handleCreateTodoList}
            />
          </div>

          {/* Right side - Tasks */}
          <div className="w-2/3 overflow-y-auto pb-24 relative">
            {selectedTodoList ? (
              <div className="p-4 md:p-8">
                <TaskListHeader
                  group={selectedGroup}
                  todoList={selectedTodoList}
                  tasks={tasksForSelectedTodoList}
                  currentUser={MOCK_USER}
                />

                <TaskList
                  tasks={tasksForSelectedTodoList}
                  users={MOCK_USERS}
                  onToggleComplete={handleToggleTaskComplete}
                  onEditTask={handleOpenTaskForm}
                  onDeleteTask={handleDeleteTask}
                />
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-8 text-center">
                <div className="bg-gray-50 p-8 rounded-lg max-w-md">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ListPlus className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-medium text-gray-700 mb-2">No Todo List Selected</h3>
                  <p className="text-gray-500 mb-6">
                    Select a todo list from the left panel to view tasks or create a new list to get started.
                  </p>
                  <Button
                    onClick={() => {
                      const newName = `New List for ${selectedGroup.name}`
                      handleCreateTodoList(newName)
                    }}
                    className="w-full"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Create New Todo List
                  </Button>
                </div>
              </div>
            )}

            {/* Floating New Task Input Form */}
            {selectedTodoList && (
              <form
                onSubmit={handleCreateQuickTask}
                className="fixed bottom-8 right-1/4 transform translate-x-1/2 z-40 w-full max-w-md px-4"
              >
                <div className="flex items-center bg-black rounded-full overflow-hidden shadow-xl">
                  <Input
                    ref={newTaskInputRef}
                    type="text"
                    placeholder="Create new task..."
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    className="flex-1 border-0 bg-transparent text-white placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                  <Button
                    type="submit"
                    variant="ghost"
                    size="icon"
                    className="h-12 w-12 rounded-full text-white"
                    disabled={!newTaskTitle.trim()}
                  >
                    <X className="h-5 w-5 transform rotate-45" />
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )
    }
    // No group selected
    else {
      return (
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Good Morning, {MOCK_USER.name}! 👋</h1>
          <p className="text-gray-500">Select a group from the sidebar to get started</p>
        </div>
      )
    }
  }

  return (
    <div className="bg-white min-h-screen flex flex-col">
      

      <div className="flex flex-1 relative">
        {/* Left Panel - Sidebar */}
        <Sidebar />

        {/* Mobile sidebar toggle */}
        {!sidebarOpen && (
          <button
            className="fixed top-4 left-4 z-40 md:hidden bg-white rounded-full shadow-lg p-2"
            onClick={() => setSidebarOpen(true)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
        )}

        {/* Main Content Area */}
        <div className="flex-1 overflow-hidden">{renderMainContent()}</div>
      </div>

      {/* Task Form Modal */}
      <TaskForm
        isOpen={isTaskFormOpen}
        onOpenChange={setIsTaskFormOpen}
        onSubmit={handleTaskFormSubmit}
        task={editingTask}
      />

      {/* Group Edit Modal */}
      <GroupEditModal
        isOpen={isGroupEditModalOpen}
        onOpenChange={setIsGroupEditModalOpen}
        group={selectedGroup}
        onSave={handleUpdateGroup}
        onInviteUsers={handleInviteUsers}
      />
    </div>
  )
}

export default App

