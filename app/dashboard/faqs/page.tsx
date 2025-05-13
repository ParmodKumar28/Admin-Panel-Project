"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Search, Plus, Edit, Trash } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

interface FAQ {
  _id: string
  question: string
  answer: string
}

export default function FAQsPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredFaqs, setFilteredFaqs] = useState<FAQ[]>([])
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [faqToDelete, setFaqToDelete] = useState<string | null>(null)

  // Form states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [currentFaq, setCurrentFaq] = useState<FAQ | null>(null)
  const [question, setQuestion] = useState("")
  const [answer, setAnswer] = useState("")

  const fetchFaqs = async () => {
    setLoading(true)
    try {
      const response = await fetch("https://mamun-reza-freeshops-backend.vercel.app/api/v1/faq/all")

      if (!response.ok) {
        throw new Error("Failed to fetch FAQs")
      }

      const data = await response.json()
      setFaqs(data.data || [])
      setFilteredFaqs(data.data || [])
    } catch (error) {
      console.error("Error fetching FAQs:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load FAQs. Please try again.",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFaqs()
  }, [])

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredFaqs(faqs)
    } else {
      const filtered = faqs.filter(
        (faq) =>
          faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
          faq.answer.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      setFilteredFaqs(filtered)
    }
  }, [searchTerm, faqs])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Search is already handled by the useEffect
  }

  const handleAddFaq = async () => {
    try {
      const token = localStorage.getItem("adminToken")
      if (!token) {
        throw new Error("Authentication token not found")
      }

      const response = await fetch("https://mamun-reza-freeshops-backend.vercel.app/api/v1/faq/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ question, answer }),
      })

      if (!response.ok) {
        throw new Error("Failed to add FAQ")
      }

      toast({
        title: "Success",
        description: "FAQ added successfully",
      })

      // Reset form and close dialog
      setQuestion("")
      setAnswer("")
      setIsAddDialogOpen(false)

      // Refresh FAQs
      fetchFaqs()
    } catch (error) {
      console.error("Error adding FAQ:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add FAQ. Please try again.",
      })
    }
  }

  const handleEditFaq = async () => {
    if (!currentFaq) return

    try {
      const token = localStorage.getItem("adminToken")
      if (!token) {
        throw new Error("Authentication token not found")
      }

      const response = await fetch(
        `https://mamun-reza-freeshops-backend.vercel.app/api/v1/faq/update/${currentFaq._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ question, answer }),
        },
      )

      if (!response.ok) {
        throw new Error("Failed to update FAQ")
      }

      toast({
        title: "Success",
        description: "FAQ updated successfully",
      })

      // Reset form and close dialog
      setQuestion("")
      setAnswer("")
      setCurrentFaq(null)
      setIsEditDialogOpen(false)

      // Refresh FAQs
      fetchFaqs()
    } catch (error) {
      console.error("Error updating FAQ:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update FAQ. Please try again.",
      })
    }
  }

  const confirmDelete = (faqId: string) => {
    setFaqToDelete(faqId)
    setDeleteDialogOpen(true)
  }

  const handleDelete = async () => {
    if (!faqToDelete) return

    try {
      const token = localStorage.getItem("adminToken")
      if (!token) {
        throw new Error("Authentication token not found")
      }

      const response = await fetch(`https://mamun-reza-freeshops-backend.vercel.app/api/v1/faq/delete/${faqToDelete}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to delete FAQ")
      }

      toast({
        title: "Success",
        description: "FAQ deleted successfully",
      })

      // Refresh FAQs
      fetchFaqs()
    } catch (error) {
      console.error("Error deleting FAQ:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete FAQ. Please try again.",
      })
    } finally {
      setDeleteDialogOpen(false)
      setFaqToDelete(null)
    }
  }

  const openEditDialog = (faq: FAQ) => {
    setCurrentFaq(faq)
    setQuestion(faq.question)
    setAnswer(faq.answer)
    setIsEditDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold">FAQs</h1>
          <p className="text-muted-foreground">Manage your platform FAQs</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="shrink-0">
              <Plus className="mr-2 h-4 w-4" />
              Add FAQ
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New FAQ</DialogTitle>
              <DialogDescription>Create a new frequently asked question for your platform.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="question" className="text-sm font-medium">
                  Question
                </label>
                <Input
                  id="question"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Enter the question"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="answer" className="text-sm font-medium">
                  Answer
                </label>
                <Textarea
                  id="answer"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Enter the answer"
                  rows={5}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddFaq}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search FAQs..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button type="submit">Search</Button>
      </form>

      {loading ? (
        <div className="flex h-[300px] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      ) : filteredFaqs.length === 0 ? (
        <div className="flex h-[300px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
          <h3 className="text-lg font-medium">No FAQs Found</h3>
          <p className="text-sm text-muted-foreground">
            {searchTerm ? "No FAQs match your search criteria." : "Start by adding your first FAQ."}
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {filteredFaqs.map((faq) => (
            <Card key={faq._id}>
              <CardHeader>
                <CardTitle className="text-lg">{faq.question}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-foreground">{faq.answer}</CardDescription>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={() => openEditDialog(faq)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
                <Button variant="destructive" size="sm" onClick={() => confirmDelete(faq._id)}>
                  <Trash className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit FAQ</DialogTitle>
            <DialogDescription>Update this frequently asked question.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="edit-question" className="text-sm font-medium">
                Question
              </label>
              <Input
                id="edit-question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Enter the question"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="edit-answer" className="text-sm font-medium">
                Answer
              </label>
              <Textarea
                id="edit-answer"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Enter the answer"
                rows={5}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditFaq}>Update</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the FAQ.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Toaster />
    </div>
  )
}
