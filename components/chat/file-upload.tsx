"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, X, FileText, File, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"

export interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  progress: number
}

interface FileUploadProps {
  onUpload: (files: File[]) => void
  acceptedFileTypes?: string[]
  maxFileSize?: number // in bytes
  maxFiles?: number
  className?: string
  uploadedFiles?: UploadedFile[]
  onRemoveFile?: (fileId: string) => void
  disabled?: boolean
}

export function FileUpload({
  onUpload,
  acceptedFileTypes = [".pdf", ".docx", ".txt", ".csv", ".xlsx"],
  maxFileSize = 10 * 1024 * 1024, // 10MB
  maxFiles = 5,
  className,
  uploadedFiles = [],
  onRemoveFile,
  disabled = false,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [previewFile, setPreviewFile] = useState<File | null>(null)

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const validateFiles = (files: File[]): File[] => {
    setError(null)

    if (files.length + uploadedFiles.length > maxFiles) {
      setError(`You can only upload up to ${maxFiles} files`)
      return []
    }

    const validFiles = Array.from(files).filter((file) => {
      // Check file type
      const fileExtension = `.${file.name.split(".").pop()?.toLowerCase()}`

      if (!acceptedFileTypes.includes(fileExtension) && !acceptedFileTypes.includes(file.type)) {
        setError(`File type not supported. Please upload ${acceptedFileTypes.join(", ")} files.`)
        return false
      }

      // Check file size
      if (file.size > maxFileSize) {
        setError(`File size exceeds the limit of ${maxFileSize / (1024 * 1024)}MB.`)
        return false
      }

      return true
    })

    return validFiles
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    setPreviewFile(null)

    const files = Array.from(e.dataTransfer.files)
    const validFiles = validateFiles(files)

    if (validFiles.length > 0) {
      onUpload(validFiles)
    }
  }

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)

    // Preview the first file if available
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      const item = e.dataTransfer.items[0]
      if (item.kind === "file") {
        const file = item.getAsFile()
        if (file) {
          setPreviewFile(file)
        }
      }
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      onUpload(Array.from(e.target.files))
      // Reset the input
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleBrowseClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center ${
          disabled ? 'border-gray-300 bg-gray-100 dark:border-gray-700 dark:bg-gray-800' : 'border-primary/30 hover:border-primary/50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          accept={acceptedFileTypes.join(",")}
          onChange={handleFileChange}
          disabled={disabled}
        />

        <motion.div
          className="flex flex-col items-center justify-center space-y-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {isDragging && previewFile ? (
            <div className="text-center">
              <div className="p-3 rounded-full bg-primary-light/30 text-primary mb-2">
                <FileText className="w-6 h-6" />
              </div>
              <p className="text-sm font-medium truncate max-w-[200px] mx-auto">{previewFile.name}</p>
              <p className="text-xs text-neutral mt-1">{(previewFile.size / 1024).toFixed(1)} KB • Ready to drop</p>
            </div>
          ) : (
            <>
              <div className="p-3 rounded-full bg-primary-light/30 text-primary">
                <Upload className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium dark:text-white">Drag & drop files here</p>
                <p className="text-xs text-neutral mt-1">or</p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className={`mt-2 scale-up dark:border-gray-700 dark:text-white ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                  onClick={handleBrowseClick}
                  disabled={disabled}
                >
                  Browse files
                </Button>
              </div>
              <p className="text-xs text-neutral">
                Supported formats: {acceptedFileTypes.join(", ")} (Max {maxFileSize / (1024 * 1024)}MB)
              </p>
            </>
          )}
        </motion.div>
      </div>

      {error && (
        <motion.div
          className="text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 p-2 rounded"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
        >
          {error}
        </motion.div>
      )}

      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium dark:text-white">Uploaded files</p>
          <AnimatePresence>
            {uploadedFiles.map((file, index) => (
              <motion.div
                key={file.id}
                className="file-item dark:bg-dark-accent dark:border-gray-700"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
              >
                <div className="flex items-center space-x-3 overflow-hidden">
                  {file.type.includes("pdf") ? (
                    <FileText className="w-5 h-5 text-primary flex-shrink-0" />
                  ) : (
                    <File className="w-5 h-5 text-primary flex-shrink-0" />
                  )}
                  <div className="overflow-hidden">
                    <p className="text-sm font-medium truncate max-w-[150px] dark:text-white">{file.name}</p>
                    <p className="text-xs text-neutral">{(file.size / 1024).toFixed(1)} KB</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  {file.progress < 100 ? (
                    <div className="file-progress">
                      <div className="file-progress-bar" style={{ width: `${file.progress}%` }}></div>
                    </div>
                  ) : (
                    <span className="text-xs text-green-600 dark:text-green-400">Complete</span>
                  )}
                  {onRemoveFile && (
                    <button
                      type="button"
                      onClick={() => onRemoveFile(file.id)}
                      className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-neutral transition-colors flex-shrink-0"
                      disabled={disabled}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
