"use client"

import type React from "react"

import { useState } from "react"
import { useCreateTodoMutation } from "@/lib/todosApi"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Loader2 } from "lucide-react"
import { toast } from "sonner"

export default function CreateTodo() {
  const [title, setTitle] = useState("")
  const [createTodo, { isLoading }] = useCreateTodoMutation()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    try {
      await createTodo({
        title: title.trim(),
        userId: 1, // Mock user ID
      }).unwrap()

      setTitle("")
      toast.success("Todo created successfully!")
    } catch (error) {
      toast.error("Failed to create todo")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Create New Todo
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            type="text"
            placeholder="What needs to be done?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isLoading}
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading || !title.trim()}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
