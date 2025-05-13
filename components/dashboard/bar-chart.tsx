"use client"

import { useEffect, useState } from "react"
import { Bar, BarChart as RechartsBarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

export function BarChart() {
  const [graphData, setGraphData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchGraphData = async () => {
    try {
      const token = localStorage.getItem("adminToken")
      if (!token) {
        console.log("No authentication token found, using sample data")
        setGraphData(sampleData)
        setLoading(false)
        return
      }

      try {
        const currentYear = new Date().getFullYear()
        const response = await fetch(
          `https://mamun-reza-freeshops-backend.vercel.app/api/v1/admin/getGraphData?filterType=year&value=${currentYear}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )

        if (!response.ok) {
          throw new Error(`Server responded with status: ${response.status}`)
        }

        const data = await response.json()

        // Transform API data to chart format
        const chartData =
          data.data?.map((item: any) => ({
            name: item.month,
            total: item.count,
          })) || []

        setGraphData(chartData.length > 0 ? chartData : sampleData)
      } catch (error) {
        console.error("Error fetching graph data:", error)
        // Fallback to sample data if API fails
        setGraphData(sampleData)
      }
    } catch (error) {
      console.error("Error in graph data handling:", error)
      setGraphData(sampleData)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Ensure we're running in the browser environment before accessing localStorage
    if (typeof window !== "undefined") {
      fetchGraphData()
    } else {
      setGraphData(sampleData)
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
  const dataToDisplay = graphData.length > 0 ? graphData : sampleData

  return (
    <ResponsiveContainer width="100%" height={350}>
      <RechartsBarChart data={dataToDisplay}>
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
        />
        <Tooltip formatter={(value: number) => [`$${value}`, "Revenue"]} cursor={{ fill: "rgba(0, 0, 0, 0.05)" }} />
        <Bar dataKey="total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
      </RechartsBarChart>
    </ResponsiveContainer>
  )
}

// Sample data as fallback
const sampleData = [
  { name: "Jan", total: 1200 },
  { name: "Feb", total: 2100 },
  { name: "Mar", total: 1800 },
  { name: "Apr", total: 2400 },
  { name: "May", total: 1900 },
  { name: "Jun", total: 2800 },
  { name: "Jul", total: 3100 },
  { name: "Aug", total: 2700 },
  { name: "Sep", total: 3500 },
  { name: "Oct", total: 3000 },
  { name: "Nov", total: 2500 },
  { name: "Dec", total: 3700 },
]
