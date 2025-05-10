"use client"

import { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import { motion } from 'framer-motion'

interface AnimatedResponseProps {
  content: string
  isUser: boolean
  timestamp?: string
  shouldAnimate?: boolean
}

export function AnimatedResponse({ content, isUser, timestamp, shouldAnimate = false }: AnimatedResponseProps) {
  const [displayedContent, setDisplayedContent] = useState('')
  const [isAnimating, setIsAnimating] = useState(shouldAnimate)

  useEffect(() => {
    if (!isUser && shouldAnimate) {
      setIsAnimating(true)
      setDisplayedContent('')
      
      // Split content into chunks for smoother animation
      const chunks = content.split(/(\s+)/)
      let currentIndex = 0
      
      const interval = setInterval(() => {
        if (currentIndex < chunks.length) {
          setDisplayedContent(prev => prev + chunks[currentIndex])
          currentIndex++
        } else {
          clearInterval(interval)
          setIsAnimating(false)
        }
      }, 30) // Faster animation speed

      return () => clearInterval(interval)
    } else {
      setDisplayedContent(content)
      setIsAnimating(false)
    }
  }, [content, isUser, shouldAnimate])

  return (
    <motion.div
      className={`flex w-full ${isUser ? "justify-end" : "justify-start"}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div
        className={`chat-message ${
          isUser
            ? "chat-message-user bg-primary text-white"
            : "chat-message-ai bg-white dark:bg-dark-accent dark:border-gray-700"
        }`}
      >
        <div className="prose prose-sm max-w-none dark:prose-invert">
          <ReactMarkdown>{displayedContent}</ReactMarkdown>
          {isAnimating && !isUser && (
            <span className="inline-block w-2 h-4 ml-1 bg-primary animate-pulse" />
          )}
        </div>
        {timestamp && (
          <div className={`text-xs mt-2 ${isUser ? "text-white/70" : "text-neutral"}`}>
            {timestamp}
          </div>
        )}
      </div>
    </motion.div>
  )
} 