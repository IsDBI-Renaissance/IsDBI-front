"use client"

import { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'

const ReverseEngineeringResponse = dynamic(() => import('./reverse-engineering-response').then(mod => mod.ReverseEngineeringResponse), { ssr: false })
const StandardsResponse = dynamic(() => import('./standards-response').then(mod => mod.StandardsResponse), { ssr: false })

interface AnimatedResponseProps {
  content: string
  isUser: boolean
  timestamp?: string
  shouldAnimate?: boolean
  type?: string
}

// Helper to sanitize JSON string (removes trailing undefined, whitespace, or junk)
function sanitizeJson(input: string) {
  // Remove any trailing undefined, whitespace, or junk after the last closing brace
  const lastBrace = input.lastIndexOf('}')
  if (lastBrace !== -1) {
    const sanitized = input.slice(0, lastBrace + 1).trim()
    // Debug log
    console.log("Sanitized JSON string:", sanitized)
    return sanitized
  }
  // Debug log
  console.log("No closing brace found, returning input as is:", input)
  return input.trim()
}

// Auto-detect response type based on JSON structure
function detectType(content: string): string | undefined {
  try {
    const sanitized = sanitizeJson(content)
    const data = JSON.parse(sanitized)
    if (data.most_likely_standard && data.standard_probabilities) {
      return "reverse_engineering"
    }
    if (data.audit_trail && data.pipeline_stages && data.enhanced_standard) {
      return "standards_enhancement"
    }
    // Add more detection as needed
  } catch {}
  return undefined
}

export function AnimatedResponse({ content, isUser, timestamp, shouldAnimate = false, type }: AnimatedResponseProps) {
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

  // Use provided type or auto-detect
  const actualType = type || detectType(content)

  const renderContent = () => {
    if (!actualType) {
      return (
        <div className="prose prose-sm max-w-none dark:prose-invert">
          <ReactMarkdown>{displayedContent}</ReactMarkdown>
          {isAnimating && !isUser && (
            <span className="inline-block w-2 h-4 ml-1 bg-primary animate-pulse" />
          )}
        </div>
      )
    }

    try {
      switch (actualType) {
        case "standards_enhancement":
          return <StandardsResponse content={content} />
        case "reverse_engineering": {
          const sanitized = sanitizeJson(content)
          const parsedResponse = JSON.parse(sanitized)
          return <ReverseEngineeringResponse response={parsedResponse} />
        }
        default:
          return (
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <ReactMarkdown>{displayedContent}</ReactMarkdown>
              {isAnimating && !isUser && (
                <span className="inline-block w-2 h-4 ml-1 bg-primary animate-pulse" />
              )}
            </div>
          )
      }
    } catch (error) {
      console.error("Failed to parse response:", error, "Sanitized content:", sanitizeJson(content))
      return (
        <div className="text-red-600">
          Failed to parse response. Please check the console for details.
        </div>
      )
    }
  }

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
        {renderContent()}
        {timestamp && (
          <div className={`text-xs mt-2 ${isUser ? "text-white/70" : "text-neutral"}`}>
            {timestamp}
          </div>
        )}
      </div>
    </motion.div>
  )
} 