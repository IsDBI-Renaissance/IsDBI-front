import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface SidebarProps {
  position: "left" | "right"
  children: ReactNode
  className?: string
}

export function Sidebar({ position, children, className }: SidebarProps) {
  return (
    <div
      className={cn("h-screen flex-shrink-0 border-gray-200", position === "left" ? "border-r" : "border-l", className)}
    >
      {children}
    </div>
  )
}

interface SidebarHeaderProps {
  children: ReactNode
  className?: string
}

export function SidebarHeader({ children, className }: SidebarHeaderProps) {
  return <div className={cn("p-4 border-b border-gray-200", className)}>{children}</div>
}

interface SidebarContentProps {
  children: ReactNode
  className?: string
}

export function SidebarContent({ children, className }: SidebarContentProps) {
  return <div className={cn("flex-1 overflow-y-auto", className)}>{children}</div>
}

interface SidebarFooterProps {
  children: ReactNode
  className?: string
}

export function SidebarFooter({ children, className }: SidebarFooterProps) {
  return <div className={cn("p-4 border-t border-gray-200", className)}>{children}</div>
}
