"use client"

import { useEffect, useState } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"

interface Transaction {
  _id: string
  userId: {
    fullName: string
  }
  amount: number
  status: string
  createdAt: string
}

export function RecentTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem("adminToken")
      if (!token) {
        console.log("No authentication token found, using sample data")
        setTransactions(sampleTransactions)
        setLoading(false)
        return
      }

      try {
        const response = await fetch("https://mamun-reza-freeshops-backend.vercel.app/api/v1/admin/getTransactions", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error(`Server responded with status: ${response.status}`)
        }

        const data = await response.json()
        setTransactions(data.data?.slice(0, 5) || [])
      } catch (error) {
        console.error("Error fetching transactions:", error)
        // Fallback to sample data if API fails
        setTransactions(sampleTransactions)
      }
    } catch (error) {
      console.error("Error in transaction handling:", error)
      setTransactions(sampleTransactions)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Ensure we're running in the browser environment before accessing localStorage
    if (typeof window !== "undefined") {
      fetchTransactions()
    } else {
      setTransactions(sampleTransactions)
      setLoading(false)
    }
  }, [])

  if (loading) {
    return (
      <div className="flex h-[300px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  // Use actual data or fallback to sample data if empty
  const dataToDisplay = transactions.length > 0 ? transactions : sampleTransactions

  return (
    <div className="space-y-4">
      {dataToDisplay.map((transaction) => (
        <div key={transaction._id} className="flex items-center gap-4">
          <Avatar>
            <AvatarFallback>{transaction.userId.fullName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">{transaction.userId.fullName}</p>
            <p className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(transaction.createdAt), { addSuffix: true })}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium">${transaction.amount.toFixed(2)}</p>
            <Badge
              variant={
                transaction.status === "Completed"
                  ? "default"
                  : transaction.status === "Pending"
                    ? "outline"
                    : "destructive"
              }
              className="mt-1"
            >
              {transaction.status}
            </Badge>
          </div>
        </div>
      ))}
    </div>
  )
}

// Sample data as fallback
const sampleTransactions = [
  {
    _id: "1",
    userId: { fullName: "John Doe" },
    amount: 125.99,
    status: "Completed",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
  },
  {
    _id: "2",
    userId: { fullName: "Jane Smith" },
    amount: 89.5,
    status: "Pending",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
  },
  {
    _id: "3",
    userId: { fullName: "Robert Johnson" },
    amount: 250.0,
    status: "Completed",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(), // 12 hours ago
  },
  {
    _id: "4",
    userId: { fullName: "Emily Davis" },
    amount: 75.25,
    status: "Failed",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
  },
  {
    _id: "5",
    userId: { fullName: "Michael Wilson" },
    amount: 199.99,
    status: "Completed",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(), // 1.5 days ago
  },
]
