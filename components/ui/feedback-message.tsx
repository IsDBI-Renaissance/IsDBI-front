import { CheckCircle, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface FeedbackMessageProps {
  type: "success" | "error"
  message: string
  className?: string
}

export function FeedbackMessage({ type, message, className }: FeedbackMessageProps) {
  // Split the message by the slash to separate English and Arabic
  const messageParts = message.split(" / ")
  const englishMessage = messageParts[0]
  const arabicMessage = messageParts.length > 1 ? messageParts[1] : ""

  return (
    <div
      className={cn(
        "flex flex-col p-4 rounded-lg text-sm",
        type === "success" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800",
        className,
      )}
    >
      <div className="flex items-center">
        {type === "success" ? (
          <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0" />
        ) : (
          <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
        )}
        <span>{englishMessage}</span>
      </div>
      {arabicMessage && (
        <div className="flex items-center justify-end mt-1">
          <span className="font-tajawal" dir="rtl">
            {arabicMessage}
          </span>
          {type === "success" ? (
            <CheckCircle className="h-5 w-5 ml-2 flex-shrink-0" />
          ) : (
            <AlertCircle className="h-5 w-5 ml-2 flex-shrink-0" />
          )}
        </div>
      )}
    </div>
  )
}
