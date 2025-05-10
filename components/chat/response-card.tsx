"use client"

import type { ReactNode } from "react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface ResponseCardProps {
  isUser?: boolean
  content: ReactNode
  timestamp?: string
  className?: string
  animationDelay?: number
}

export function ResponseCard({ isUser = false, content, timestamp, className, animationDelay = 0 }: ResponseCardProps) {
  return (
    <motion.div
      className={cn("flex w-full", isUser ? "justify-end" : "justify-start", className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: animationDelay }}
    >
      <div className={cn("chat-message", isUser ? "chat-message-user" : "chat-message-ai")}>
        <div className="prose prose-sm max-w-none">{content}</div>
        {timestamp && <div className={cn("text-xs mt-2", isUser ? "text-white/70" : "text-neutral")}>{timestamp}</div>}
      </div>
    </motion.div>
  )
}
