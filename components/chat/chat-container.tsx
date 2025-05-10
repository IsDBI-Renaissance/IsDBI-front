"use client"

import { useRef, useEffect } from "react"
import { TextInput } from "./text-input"
import { ResponseCard } from "./response-card"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

export interface Message {
  id: string
  content: string
  isUser: boolean
  timestamp: string
}

interface ChatContainerProps {
  messages: Message[]
  onSendMessage: (message: string) => void
  onFileClick?: () => void
  isLoading?: boolean
  className?: string
}

export function ChatContainer({
  messages,
  onSendMessage,
  onFileClick,
  isLoading = false,
  className,
}: ChatContainerProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isLoading])

  return (
    <div className={cn("chat-container", className)}>
      <div className="chat-messages dark:bg-dark">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary-light/30 text-primary mb-4">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-dark dark:text-white">Start a new conversation</h3>
              <p className="text-neutral mt-2">Type a message below to begin</p>
            </motion.div>
          </div>
        ) : (
          messages.map((message, index) => (
            <ResponseCard
              key={message.id}
              isUser={message.isUser}
              content={message.content}
              timestamp={message.timestamp}
              animationDelay={index * 0.1}
            />
          ))
        )}
        {isLoading && (
          <motion.div
            className="flex justify-start"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="chat-message-ai dark:bg-dark-accent dark:border-gray-700">
              <div className="loading-spinner">
                <div className="loading-dot loading-dot-1"></div>
                <div className="loading-dot loading-dot-2"></div>
                <div className="loading-dot loading-dot-3"></div>
              </div>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="chat-input-container dark:bg-dark-accent dark:border-gray-700">
        <TextInput
          onSend={onSendMessage}
          onFileClick={onFileClick}
          disabled={isLoading}
          placeholder="Type your message..."
        />
      </div>
    </div>
  )
}
