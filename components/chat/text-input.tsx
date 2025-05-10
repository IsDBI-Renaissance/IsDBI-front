"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Send, Paperclip } from "lucide-react"
import { cn } from "@/lib/utils"

interface TextInputProps {
  onSend: (message: string) => void
  onFileClick?: () => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

export function TextInput({
  onSend,
  onFileClick,
  placeholder = "Type your message...",
  disabled = false,
  className,
}: TextInputProps) {
  const [message, setMessage] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current
    if (!textarea) return

    textarea.style.height = "auto"
    textarea.style.height = `${Math.min(textarea.scrollHeight, 150)}px`
  }, [message])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim() || disabled) return

    onSend(message.trim())
    setMessage("")

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={cn("chat-input", className)}>
      {onFileClick && (
        <button
          type="button"
          onClick={onFileClick}
          className="p-2 rounded-full text-neutral hover:text-primary hover:bg-primary-light/30 transition-colors"
          title="Attach file"
        >
          <Paperclip className="w-5 h-5" />
        </button>
      )}
      <textarea
        ref={textareaRef}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        className="chat-textarea"
        rows={1}
      />
      <button type="submit" disabled={!message.trim() || disabled} className="chat-send-button" title="Send message">
        <Send className="w-5 h-5 transition-transform group-hover:rotate-45" />
      </button>
    </form>
  )
}
