"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, ShoppingBag, FileText, DollarSign } from "lucide-react"
import { BarChart } from "@/components/dashboard/bar-chart"
import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { RecentTransactions } from "@/components/dashboard/recent-transactions"

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("adminToken")
      if (!token) {
        console.log("No authentication token found")
        setLoading(false)
        setDashboardData({
          data: {
            totalUsers: 0,
            totalProducts: 0,
            totalArticles: 0,
            totalTransactions: 0,
          },
        })
        return
      }

      try {
        const response = await fetch("https://mamun-reza-freeshops-backend.vercel.app/api/v1/admin/getDashboard", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error(`Server responded with status: ${response.status}`)
        }

        const data = await response.json()
        setDashboardData(data)
      } catch (err) {
        console.error("Error fetching dashboard data:", err)
        setDashboardData({
          data: {
            totalUsers: 0,
            totalProducts: 0,
            totalArticles: 0,
            totalTransactions: 0,
          },
        })
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Ensure we're running in the browser environment before accessing localStorage
    if (typeof window !== "undefined") {
      fetchDashboardData()
    } else {
      setLoading(false)
    }
  }, [])

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-destructive">Error</h2>
          <p>{error}</p>
        </div>
      </div>
    )
  }

  // Fallback data if API doesn't return expected structure
  const stats = dashboardData?.data || {
    totalUsers: 0,
    totalProducts: 0,
    totalArticles: 0,
    totalTransactions: 0,
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your admin panel</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <DashboardStats
          title="Total Users"
          value={stats.totalUsers || 0}
          icon={<Users className="h-5 w-5" />}
          description="Total registered users"
          trend={5}
        />
        <DashboardStats
          title="Products"
          value={stats.totalProducts || 0}
          icon={<ShoppingBag className="h-5 w-5" />}
          description="Active products"
          trend={12}
        />
        <DashboardStats
          title="Articles"
          value={stats.totalArticles || 0}
          icon={<FileText className="h-5 w-5" />}
          description="Published articles"
          trend={-3}
        />
        <DashboardStats
          title="Transactions"
          value={stats.totalTransactions || 0}
          icon={<DollarSign className="h-5 w-5" />}
          description="Completed transactions"
          trend={8}
          isCurrency
        />
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Revenue Overview</CardTitle>
                <CardDescription>Monthly revenue for the current year</CardDescription>
              </CardHeader>
              <CardContent>
                <BarChart />
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>Latest platform transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <RecentTransactions />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Analytics</CardTitle>
              <CardDescription>Detailed analytics will be displayed here</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] rounded-md border border-dashed p-6 text-center">
                <h3 className="text-lg font-medium">Analytics Dashboard</h3>
                <p className="text-sm text-muted-foreground">
                  Detailed analytics will be implemented in the next phase
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Reports</CardTitle>
              <CardDescription>Generate and view reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] rounded-md border border-dashed p-6 text-center">
                <h3 className="text-lg font-medium">Reports Dashboard</h3>
                <p className="text-sm text-muted-foreground">Report generation will be implemented in the next phase</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
