"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Badge } from "@/components/ui/badge"
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
import { Search, UserPlus, MoreHorizontal, Check, X } from "lucide-react"
import { format } from "date-fns"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

interface User {
  _id: string
  fullName: string
  email: string
  phoneNumber: string
  userType: string
  city: string
  state: string
  isVerified: boolean
  userStatus: string
  createdAt: string
  updatedAt: string
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<string | null>(null)

  const fetchUsers = async (page = 1, keyword = "", status = "") => {
    setLoading(true)
    try {
      const token = localStorage.getItem("adminToken")
      if (!token) {
        throw new Error("Authentication token not found")
      }

      let url = `https://mamun-reza-freeshops-backend.vercel.app/api/v1/admin/getAllUsers?page=${page}&limit=10`

      if (keyword) {
        url += `&keyword=${encodeURIComponent(keyword)}`
      }

      if (status) {
        url += `&userStatus=${encodeURIComponent(status)}`
      }

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch users")
      }

      const data = await response.json()
      setUsers(data.data.docs || [])
      setTotalPages(data.data.totalPages || 1)
    } catch (error) {
      console.error("Error fetching users:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load users. Please try again.",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers(currentPage, searchTerm, statusFilter)
  }, [currentPage, searchTerm, statusFilter])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1)
    fetchUsers(1, searchTerm, statusFilter)
  }

  const handleStatusChange = (value: string) => {
    setStatusFilter(value)
    setCurrentPage(1)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const confirmDelete = (userId: string) => {
    setUserToDelete(userId)
    setDeleteDialogOpen(true)
  }

  const handleDelete = async () => {
    if (!userToDelete) return

    try {
      const token = localStorage.getItem("adminToken")
      if (!token) {
        throw new Error("Authentication token not found")
      }

      const response = await fetch(
        `https://mamun-reza-freeshops-backend.vercel.app/api/v1/admin/deleteUser/${userToDelete}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      if (!response.ok) {
        throw new Error("Failed to delete user")
      }

      toast({
        title: "Success",
        description: "User deleted successfully",
      })

      // Refresh the user list
      fetchUsers(currentPage, searchTerm, statusFilter)
    } catch (error) {
      console.error("Error deleting user:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete user. Please try again.",
      })
    } finally {
      setDeleteDialogOpen(false)
      setUserToDelete(null)
    }
  }

  const toggleUserStatus = async (userId: string) => {
    try {
      const token = localStorage.getItem("adminToken")
      if (!token) {
        throw new Error("Authentication token not found")
      }

      const response = await fetch(
        `https://mamun-reza-freeshops-backend.vercel.app/api/v1/admin/userActiveBlock/${userId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      if (!response.ok) {
        throw new Error("Failed to update user status")
      }

      toast({
        title: "Success",
        description: "User status updated successfully",
      })

      // Refresh the user list
      fetchUsers(currentPage, searchTerm, statusFilter)
    } catch (error) {
      console.error("Error updating user status:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update user status. Please try again.",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold">Users</h1>
          <p className="text-muted-foreground">Manage your platform users</p>
        </div>
        <Button className="shrink-0">
          <UserPlus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <form onSubmit={handleSearch} className="flex flex-1 gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by name, email or phone..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button type="submit">Search</Button>
        </form>
        <Select value={statusFilter} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Statuses</SelectItem>
            <SelectItem value="ACTIVE">Active</SelectItem>
            <SelectItem value="INACTIVE">Inactive</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="hidden md:table-cell">Phone</TableHead>
              <TableHead className="hidden md:table-cell">Location</TableHead>
              <TableHead className="hidden md:table-cell">Joined</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  <div className="flex items-center justify-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                  </div>
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No users found.
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user._id}>
                  <TableCell className="font-medium">{user.fullName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell className="hidden md:table-cell">{user.phoneNumber || "—"}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {user.city && user.state ? `${user.city}, ${user.state}` : "—"}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {user.createdAt ? format(new Date(user.createdAt), "MMM d, yyyy") : "—"}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        user.userStatus === "ACTIVE"
                          ? "default"
                          : user.userStatus === "INACTIVE"
                            ? "secondary"
                            : "outline"
                      }
                    >
                      {user.userStatus}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => toggleUserStatus(user._id)}>
                          {user.userStatus === "ACTIVE" ? (
                            <>
                              <X className="mr-2 h-4 w-4" />
                              <span>Deactivate</span>
                            </>
                          ) : (
                            <>
                              <Check className="mr-2 h-4 w-4" />
                              <span>Activate</span>
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => confirmDelete(user._id)}>Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            />
          </PaginationItem>
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const pageNumber =
              currentPage <= 3 ? i + 1 : currentPage >= totalPages - 2 ? totalPages - 4 + i : currentPage - 2 + i

            if (pageNumber <= 0 || pageNumber > totalPages) return null

            return (
              <PaginationItem key={pageNumber}>
                <PaginationLink isActive={currentPage === pageNumber} onClick={() => handlePageChange(pageNumber)}>
                  {pageNumber}
                </PaginationLink>
              </PaginationItem>
            )
          })}
          <PaginationItem>
            <PaginationNext
              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the user account and all associated data.
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
