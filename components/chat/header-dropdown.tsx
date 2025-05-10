"use client"

import { useState, useRef } from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { useOnClickOutside } from "@/hooks/use-click-outside"

export type Challenge = {
  id: string
  name: string
}

interface HeaderDropdownProps {
  challenges: Challenge[]
  selectedChallenge: Challenge
  onSelect: (challenge: Challenge) => void
  className?: string
}

export function HeaderDropdown({ challenges, selectedChallenge, onSelect, className }: HeaderDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useOnClickOutside(dropdownRef, () => setIsOpen(false))

  const toggleDropdown = () => setIsOpen(!isOpen)

  const handleSelect = (challenge: Challenge) => {
    onSelect(challenge)
    setIsOpen(false)
  }

  return (
    <div ref={dropdownRef} className={cn("relative", className)}>
      <button onClick={toggleDropdown} className="dropdown-button group" aria-expanded={isOpen} aria-haspopup="true">
        <span className="flex items-center">
          <span className="mr-2">{selectedChallenge.name}</span>
          <ChevronDown
            className={cn("w-4 h-4 transition-transform duration-200", isOpen ? "rotate-180" : "rotate-0")}
          />
        </span>
      </button>

      {isOpen && (
        <div className="dropdown-menu animate-[fadeIn_0.2s_ease-in-out]">
          <ul className="py-1">
            {challenges.map((challenge) => (
              <li key={challenge.id}>
                <button
                  onClick={() => handleSelect(challenge)}
                  className={cn("dropdown-item", challenge.id === selectedChallenge.id ? "dropdown-item-active" : "")}
                >
                  {challenge.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
