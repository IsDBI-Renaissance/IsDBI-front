"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      if (!loading) {
        if (!user) {
          router.push("/login")
        }
        setIsChecking(false)
      }
    }

    checkAuth()
  }, [user, loading, router])

  if (loading || isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-light">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect in the useEffect
  }

  return <>{children}</>
}
