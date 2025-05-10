"use client"

import { Menu, X } from "lucide-react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface MobileSidebarToggleProps {
  onToggleLeft: () => void
  onToggleRight: () => void
  leftOpen: boolean
  rightOpen: boolean
}

export function MobileSidebarToggle({ onToggleLeft, onToggleRight, leftOpen, rightOpen }: MobileSidebarToggleProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const handleToggleLeft = () => {
    onToggleLeft()
    setIsMenuOpen(false)
  }

  const handleToggleRight = () => {
    onToggleRight()
    setIsMenuOpen(false)
  }

  return (
    <>
      <button onClick={toggleMenu} className="mobile-sidebar-toggle" aria-label="Toggle mobile menu">
        {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-16 right-4 z-50 bg-white rounded-lg shadow-lg p-2 border border-gray-200"
          >
            <div className="flex flex-col space-y-1">
              <button
                onClick={handleToggleLeft}
                className={`px-4 py-2 text-sm rounded-md text-left transition-colors ${
                  leftOpen ? "bg-primary-light/30 text-primary" : "hover:bg-gray-100"
                }`}
              >
                {leftOpen ? "Hide Chat History" : "Show Chat History"}
              </button>
              <button
                onClick={handleToggleRight}
                className={`px-4 py-2 text-sm rounded-md text-left transition-colors ${
                  rightOpen ? "bg-primary-light/30 text-primary" : "hover:bg-gray-100"
                }`}
              >
                {rightOpen ? "Hide File Upload" : "Show File Upload"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
