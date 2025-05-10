"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface StandardProbability {
  standard: string
  probability: number
  reason: string
}

interface ReverseEngineeringResponse {
  most_likely_standard: string
  standard_probabilities: StandardProbability[]
  key_features: string[]
  detailed_explanation: string
}

interface ReverseEngineeringResponseProps {
  response: ReverseEngineeringResponse
  className?: string
}

export function ReverseEngineeringResponse({ response, className }: ReverseEngineeringResponseProps) {
  return (
    <motion.div
      className={cn("w-full space-y-6 p-6 bg-white dark:bg-dark-accent rounded-lg shadow-sm", className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Primary Standard */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-neutral dark:text-gray-400">Most Likely Standard</h3>
        <div className="text-xl font-semibold text-primary dark:text-primary-light">
          {response.most_likely_standard}
        </div>
      </div>

      {/* Standard Probabilities Table */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-neutral dark:text-gray-400">Standard Probabilities</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-2 px-4 text-sm font-medium text-neutral dark:text-gray-400">Standard</th>
                <th className="text-left py-2 px-4 text-sm font-medium text-neutral dark:text-gray-400">Probability</th>
                <th className="text-left py-2 px-4 text-sm font-medium text-neutral dark:text-gray-400">Reason</th>
              </tr>
            </thead>
            <tbody>
              {response.standard_probabilities.map((item, index) => (
                <tr key={index} className="border-b dark:border-gray-700">
                  <td className="py-2 px-4 text-sm">{item.standard}</td>
                  <td className="py-2 px-4 text-sm">{(item.probability * 100).toFixed(1)}%</td>
                  <td className="py-2 px-4 text-sm">{item.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Key Features */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-neutral dark:text-gray-400">Key Features</h3>
        <ul className="list-disc list-inside space-y-1">
          {response.key_features.map((feature, index) => (
            <li key={index} className="text-sm">{feature}</li>
          ))}
        </ul>
      </div>

      {/* Detailed Explanation */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-neutral dark:text-gray-400">Detailed Explanation</h3>
        <p className="text-sm whitespace-pre-wrap">{response.detailed_explanation}</p>
      </div>
    </motion.div>
  )
} 