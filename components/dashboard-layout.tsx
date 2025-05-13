"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import { LayoutDashboard, Users, ShoppingBag, FileText, HelpCircle, Bell, LogOut, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [user, setUser] = useState<{ fullName?: string } | null>(null)
  const pathname = usePathname()
  const router = useRouter()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    const storedUser = localStorage.getItem("adminUser")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    } else {
      router.push("/login")
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("adminToken")
    localStorage.removeItem("adminUser")
    router.push("/login")
  }

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Users", href: "/dashboard/users", icon: Users },
    { name: "Products", href: "/dashboard/products", icon: ShoppingBag },
    { name: "Articles", href: "/dashboard/articles", icon: FileText },
    { name: "FAQs", href: "/dashboard/faqs", icon: HelpCircle },
  ]

  if (!isMounted) {
    return null
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Mobile Header */}
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="shrink-0">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="flex flex-col p-0">
            <div className="flex items-center border-b px-4 py-3">
              <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
                <ShoppingBag className="h-6 w-6" />
                <span>Freeshopps Admin</span>
              </Link>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="ml-auto">
                  <X className="h-5 w-5" />
                </Button>
              </SheetTrigger>
            </div>
            <nav className="grid gap-1 px-2 py-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`sidebar-item ${pathname === item.href ? "active" : ""}`}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              ))}
              <Button variant="ghost" className="sidebar-item justify-start" onClick={handleLogout}>
                <LogOut className="h-5 w-5" />
                Logout
              </Button>
            </nav>
          </SheetContent>
        </Sheet>
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
          <ShoppingBag className="h-6 w-6" />
          <span>Freeshopps Admin</span>
        </Link>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          <Avatar>
            <AvatarFallback>{user?.fullName?.charAt(0) || "A"}</AvatarFallback>
          </Avatar>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar (desktop) */}
        <aside className="hidden w-64 shrink-0 border-r md:block">
          <div className="flex h-16 items-center gap-2 border-b px-4 font-semibold">
            <ShoppingBag className="h-6 w-6" />
            <span>Freeshopps Admin</span>
          </div>
          <nav className="grid gap-1 p-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`sidebar-item ${pathname === item.href ? "active" : ""}`}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            ))}
            <Button variant="ghost" className="sidebar-item justify-start" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
              Logout
            </Button>
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1">
          {/* Desktop header */}
          <header className="sticky top-0 z-30 hidden h-16 items-center gap-4 border-b bg-background px-6 md:flex">
            <div className="ml-auto flex items-center gap-4">
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              <div className="flex items-center gap-2">
                <Avatar>
                  <AvatarFallback>{user?.fullName?.charAt(0) || "A"}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{user?.fullName || "Admin User"}</p>
                </div>
              </div>
            </div>
          </header>

          <div className="p-4 md:p-6">{children}</div>
        </main>
      </div>
    </div>
  )
}
