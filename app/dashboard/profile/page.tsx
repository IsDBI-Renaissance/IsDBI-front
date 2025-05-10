"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { ArrowLeft, User, Mail, Calendar, LogOut, Lock } from "lucide-react"

export default function Profile() {
  const { user, updateProfile, logout } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [isEditingPassword, setIsEditingPassword] = useState(false)
  const [name, setName] = useState(user?.name || "")
  const [email, setEmail] = useState(user?.email || "")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  // Reset form when user changes
  useEffect(() => {
    if (user) {
      setName(user.name)
      setEmail(user.email)
    }
  }, [user])

  const validatePassword = (password: string) => {
    if (password.length < 8) {
      return "Password must be at least 8 characters long"
    }
    return ""
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (!name.trim()) {
      setError("Name cannot be empty")
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError("Invalid email format")
      return
    }

    setIsLoading(true)
    try {
      await updateProfile({ name, email })
      setSuccess("Profile updated successfully")
      setIsEditing(false)
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update profile")
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    const passwordError = validatePassword(newPassword)
    if (passwordError) {
      setError(passwordError)
      return
    }

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match")
      return
    }

    setIsLoading(true)
    try {
      await updateProfile({ currentPassword, newPassword })
      setSuccess("Password updated successfully")
      setIsEditingPassword(false)
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update password")
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-light">
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link href="/dashboard" className="inline-flex items-center text-primary hover:text-primary/80">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-8 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-dark">Profile</h1>
              <Button variant="outline" onClick={logout} className="text-red-600 border-red-600 hover:bg-red-50">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>

          {error && <div className="px-6 py-4 bg-red-50 text-red-700 text-sm">{error}</div>}
          {success && <div className="px-6 py-4 bg-green-50 text-green-700 text-sm">{success}</div>}

          <div className="px-6 py-6">
            {isEditing ? (
              <form onSubmit={handleUpdateProfile}>
                <div className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-dark">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-dark">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                    />
                  </div>

                  <div className="flex space-x-3">
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? "Saving..." : "Save Changes"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsEditing(false)
                        setName(user.name)
                        setEmail(user.email)
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </form>
            ) : isEditingPassword ? (
              <form onSubmit={handleUpdatePassword}>
                <div className="space-y-6">
                  <div>
                    <label htmlFor="currentPassword" className="block text-sm font-medium text-dark">
                      Current Password
                    </label>
                    <input
                      type="password"
                      id="currentPassword"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                    />
                  </div>

                  <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-dark">
                      New Password
                    </label>
                    <input
                      type="password"
                      id="newPassword"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                    />
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-dark">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                    />
                  </div>

                  <div className="flex space-x-3">
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? "Updating..." : "Update Password"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsEditingPassword(false)
                        setCurrentPassword("")
                        setNewPassword("")
                        setConfirmPassword("")
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-medium text-dark">Personal Information</h2>
                  <div className="space-x-3">
                    <Button variant="outline" onClick={() => setIsEditing(true)}>
                      Edit Profile
                    </Button>
                    <Button variant="outline" onClick={() => setIsEditingPassword(true)}>
                      Change Password
                    </Button>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <dl className="divide-y divide-gray-200">
                    <div className="py-4 flex items-center">
                      <dt className="text-sm font-medium text-neutral w-1/4 flex items-center">
                        <User className="w-5 h-5 mr-2 text-primary" />
                        Name
                      </dt>
                      <dd className="text-sm text-dark flex-1">{user.name}</dd>
                    </div>

                    <div className="py-4 flex items-center">
                      <dt className="text-sm font-medium text-neutral w-1/4 flex items-center">
                        <Mail className="w-5 h-5 mr-2 text-primary" />
                        Email
                      </dt>
                      <dd className="text-sm text-dark flex-1">{user.email}</dd>
                    </div>

                    <div className="py-4 flex items-center">
                      <dt className="text-sm font-medium text-neutral w-1/4 flex items-center">
                        <Calendar className="w-5 h-5 mr-2 text-primary" />
                        Joined
                      </dt>
                      <dd className="text-sm text-dark flex-1">
                        {new Date(user.createdAt).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </dd>
                    </div>

                    <div className="py-4 flex items-center">
                      <dt className="text-sm font-medium text-neutral w-1/4 flex items-center">
                        <Lock className="w-5 h-5 mr-2 text-primary" />
                        Login Method
                      </dt>
                      <dd className="text-sm text-dark flex-1">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-light/30 text-primary capitalize">
                          {user.method}
                        </span>
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
