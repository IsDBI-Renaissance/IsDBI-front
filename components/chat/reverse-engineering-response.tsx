"use client"

import React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface StandardProbability {
  standard: string
  probability: number
  reason: string
}

interface ReverseEngineeringResponseProps {
  response: {
    most_likely_standard: string
    standard_probabilities: StandardProbability[]
    key_features?: string[]
    detailed_explanation?: string
    timestamp?: string
  }
}

export function ReverseEngineeringResponse({ response }: ReverseEngineeringResponseProps) {
  if (!response) return null

  const {
    most_likely_standard,
    standard_probabilities,
    key_features,
    detailed_explanation,
    timestamp,
  } = response

  return (
    <div className="bg-white dark:bg-dark-accent rounded-xl shadow p-6 border border-gray-100 dark:border-gray-800 max-w-md mx-auto">
      <div className="mb-4">
        <div className="text-sm text-neutral font-medium mb-1">Most Likely Standard</div>
        <div className="text-2xl font-bold text-primary mb-2">{most_likely_standard}</div>
      </div>

      <div className="mb-4">
        <div className="text-sm text-neutral font-medium mb-2">Standard Probabilities</div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border rounded">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-900">
                <th className="px-3 py-2 text-left font-semibold">Standard</th>
                <th className="px-3 py-2 text-left font-semibold">Probability</th>
                <th className="px-3 py-2 text-left font-semibold">Reason</th>
              </tr>
            </thead>
            <tbody>
              {standard_probabilities.map((prob, idx) => (
                <tr key={prob.standard} className="border-t border-gray-100 dark:border-gray-800">
                  <td className="px-3 py-2 font-mono">{prob.standard}</td>
                  <td className="px-3 py-2">{(prob.probability * 100).toFixed(1)}%</td>
                  <td className="px-3 py-2">{prob.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {key_features && key_features.length > 0 && (
        <div className="mb-4">
          <div className="text-sm text-neutral font-medium mb-1">Key Features</div>
          <ul className="list-disc list-inside text-sm text-dark dark:text-white">
            {key_features.map((feature, idx) => (
              <li key={idx}>{feature}</li>
            ))}
          </ul>
        </div>
      )}

      {detailed_explanation && (
        <div className="mb-2">
          <div className="text-sm text-neutral font-medium mb-1">Detailed Explanation</div>
          <div className="text-sm text-dark dark:text-white whitespace-pre-line">{detailed_explanation}</div>
        </div>
      )}

      {timestamp && (
        <div className="text-xs text-neutral text-right mt-4">{timestamp}</div>
      )}
    </div>
  )
} 