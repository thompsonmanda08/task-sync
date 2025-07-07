"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { X, Plus } from "lucide-react"
import type { Task } from "@/types"

interface TaskFormProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (taskData: Partial<Task>) => void
  task: Task | null
}

export function TaskForm({ isOpen, onOpenChange, onSubmit, task }: TaskFormProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [completed, setCompleted] = useState(false)
  const [sharedEmails, setSharedEmails] = useState<string[]>([])
  const [newEmail, setNewEmail] = useState("")

  // Reset form when task changes
  useEffect(() => {
    if (task) {
      setTitle(task.title || "")
      setDescription(task.description || "")
      setStartTime(task.startTime || "")
      setEndTime(task.endTime || "")
      setCompleted(task.completed || false)
      setSharedEmails(task.invitedEmails || [])
    } else {
      setTitle("")
      setDescription("")
      setStartTime("")
      setEndTime("")
      setCompleted(false)
      setSharedEmails([])
    }
    setNewEmail("")
  }, [task, isOpen])

  const handleAddEmail = () => {
    if (newEmail.trim() && !sharedEmails.includes(newEmail.trim())) {
      setSharedEmails([...sharedEmails, newEmail.trim()])
      setNewEmail("")
    }
  }

  const handleRemoveEmail = (emailToRemove: string) => {
    setSharedEmails(sharedEmails.filter((email) => email !== emailToRemove))
  }

  const handleEmailKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAddEmail()
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const taskData: Partial<Task> = {
      title,
      description: description || undefined,
      startTime: startTime || undefined,
      endTime: endTime || undefined,
      completed,
      invitedEmails: sharedEmails.length > 0 ? sharedEmails : undefined,
    }

    onSubmit(taskData)
    onOpenChange(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{task ? "Edit Task" : "Create New Task"}</DialogTitle>
          <DialogDescription>
            {task ? "Make changes to your task here." : "Add the details for your new task."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Task Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter task title"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add more details about this task"
                className="resize-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="startTime">Start Time</Label>
                <Input id="startTime" type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="endTime">End Time</Label>
                <Input id="endTime" type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
              </div>
            </div>

            {/* Invite Users Section */}
            <div className="grid gap-2">
              <Label htmlFor="shareEmail">Share with Users</Label>
              <div className="flex gap-2">
                <Input
                  id="shareEmail"
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  onKeyPress={handleEmailKeyPress}
                  placeholder="Enter email address"
                />
                <Button type="button" onClick={handleAddEmail} size="icon" variant="outline">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {sharedEmails.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {sharedEmails.map((email) => (
                    <Badge key={email} variant="secondary" className="flex items-center gap-1">
                      {email}
                      <button
                        type="button"
                        onClick={() => handleRemoveEmail(email)}
                        className="ml-1 hover:text-red-500"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="completed"
                checked={completed}
                onCheckedChange={(checked) => setCompleted(checked as boolean)}
              />
              <Label htmlFor="completed">Mark as completed</Label>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{task ? "Save Changes" : "Create Task"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
