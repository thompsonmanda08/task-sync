"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { X, Plus, Users } from "lucide-react"
import type { Group, UserRole } from "@/types"

interface GroupEditModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  group: Group | null
  onSave: (groupData: Partial<Group>) => void
  onInviteUsers: (emails: string[], role: UserRole) => void
}

export function GroupEditModal({ isOpen, onOpenChange, group, onSave, onInviteUsers }: GroupEditModalProps) {
  const [name, setName] = useState(group?.name || "")
  const [newEmail, setNewEmail] = useState("")
  const [inviteEmails, setInviteEmails] = useState<string[]>([])
  const [selectedRole, setSelectedRole] = useState<UserRole>("Contributor")

  // Reset form when group changes
  useState(() => {
    if (group) {
      setName(group.name)
    }
  })

  const handleSaveDetails = () => {
    if (!name.trim()) return

    onSave({
      name: name.trim(),
    })
  }

  const handleInviteUsers = () => {
    if (inviteEmails.length === 0) return

    onInviteUsers(inviteEmails, selectedRole)
    setInviteEmails([])
  }

  const handleAddEmail = () => {
    if (newEmail.trim() && !inviteEmails.includes(newEmail.trim())) {
      setInviteEmails([...inviteEmails, newEmail.trim()])
      setNewEmail("")
    }
  }

  const handleRemoveEmail = (emailToRemove: string) => {
    setInviteEmails(inviteEmails.filter((email) => email !== emailToRemove))
  }

  const handleEmailKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAddEmail()
    }
  }

  if (!group) return null

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Group Settings</DialogTitle>
          <DialogDescription>Manage your group settings and invite team members.</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="details" className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Group Details</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4 mt-4">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Group Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter group name"
                />
              </div>
            </div>

            <DialogFooter>
              <Button onClick={handleSaveDetails}>Save Changes</Button>
            </DialogFooter>
          </TabsContent>

          <TabsContent value="members" className="space-y-4 mt-4">
            <div className="flex items-center gap-2 mb-4">
              <Users className="h-5 w-5 text-gray-500" />
              <h3 className="text-sm font-medium">Current Members ({group.peopleCount || 1})</h3>
            </div>

            <div className="border rounded-md p-4 space-y-4">
              <h4 className="text-sm font-medium mb-2">Invite New Members</h4>

              <div className="grid gap-4">
                <div className="flex gap-2">
                  <Input
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

                {inviteEmails.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {inviteEmails.map((email) => (
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

                <div className="grid gap-2">
                  <Label htmlFor="role">Role</Label>
                  <Select value={selectedRole} onValueChange={(value) => setSelectedRole(value as UserRole)}>
                    <SelectTrigger id="role">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Admin">Admin</SelectItem>
                      <SelectItem value="Contributor">Contributor</SelectItem>
                      <SelectItem value="Viewer">Viewer</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500">
                    {selectedRole === "Admin" && "Can edit group settings and manage members"}
                    {selectedRole === "Contributor" && "Can create and edit tasks"}
                    {selectedRole === "Viewer" && "Can only view tasks"}
                  </p>
                </div>
              </div>

              <Button onClick={handleInviteUsers} disabled={inviteEmails.length === 0} className="w-full">
                Invite Members
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
