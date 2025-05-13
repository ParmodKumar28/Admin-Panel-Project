import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowDown, ArrowUp } from "lucide-react"

interface DashboardStatsProps {
  title: string
  value: number
  description: string
  icon: React.ReactNode
  trend?: number
  isCurrency?: boolean
}

export function DashboardStats({
  title,
  value,
  description,
  icon,
  trend = 0,
  isCurrency = false,
}: DashboardStatsProps) {
  const formattedValue = isCurrency
    ? new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value)
    : new Intl.NumberFormat("en-US").format(value)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="rounded-full bg-secondary p-2">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{formattedValue}</div>
        <CardDescription className="flex items-center gap-1 pt-1">
          {trend !== 0 && (
            <>
              {trend > 0 ? (
                <ArrowUp className="h-4 w-4 text-green-500" />
              ) : (
                <ArrowDown className="h-4 w-4 text-red-500" />
              )}
              <span className={trend > 0 ? "text-green-500" : "text-red-500"}>{Math.abs(trend)}%</span>
            </>
          )}
          <span className="text-muted-foreground">{description}</span>
        </CardDescription>
      </CardContent>
    </Card>
  )
}
