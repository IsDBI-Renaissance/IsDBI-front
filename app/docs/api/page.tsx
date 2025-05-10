"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, ChevronDown, ChevronRight, Copy, ExternalLink, Lock, Play, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { motion, AnimatePresence } from "framer-motion"

// API Endpoint types
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH"

type Parameter = {
  name: string
  type: string
  required: boolean
  description: string
}

type Response = {
  status: number
  description: string
  example: string
}

type Endpoint = {
  id: string
  path: string
  method: HttpMethod
  summary: string
  description: string
  parameters: Parameter[]
  responses: Response[]
  requiresAuth: boolean
}

type EndpointGroup = {
  id: string
  name: string
  description: string
  endpoints: Endpoint[]
}

// Sample API data
const apiEndpoints: EndpointGroup[] = [
  {
    id: "use-cases",
    name: "Use Case Scenario Analysis",
    description: "Endpoints for analyzing use case scenarios and providing accounting guidance based on AAOIFI standards",
    endpoints: [
      {
        id: "analyze-use-case",
        path: "/service1",
        method: "POST",
        summary: "Analyze use case scenario",
        description: "Analyzes a use case scenario and provides accounting guidance based on AAOIFI standards.",
        parameters: [
          {
            name: "text",
            type: "string",
            required: true,
            description: "The use case scenario description",
          },
          {
            name: "file",
            type: "file",
            required: false,
            description: "Supporting document (PDF, DOCX, XLSX)",
          },
        ],
        responses: [
          {
            status: 200,
            description: "Successful response",
            example: `{
  "analysis": "Detailed analysis of the use case",
  "recommendations": ["Recommendation 1", "Recommendation 2"],
  "standards": ["FAS 1", "FAS 2"],
  "journal_entries": [
    {
      "account": "Account Name",
      "debit": 1000,
      "credit": 0
    }
  ],
  "implementation_steps": [
    {
      "step": 1,
      "description": "Step description",
      "standard_reference": "FAS 1"
    }
  ]
}`,
          },
          {
            status: 401,
            description: "Unauthorized",
            example: `{
  "message": "Your session has expired. Please log in again."
}`,
          },
        ],
        requiresAuth: true,
      },
    ],
  },
  {
    id: "reverse-transactions",
    name: "Reverse Transaction Analysis",
    description: "Endpoints for analyzing journal entries to identify transaction types and applicable standards",
    endpoints: [
      {
        id: "analyze-transaction",
        path: "/service2",
        method: "POST",
        summary: "Analyze journal entries",
        description: "Analyzes journal entries to identify the underlying transaction type and applicable AAOIFI standards.",
        parameters: [
          {
            name: "entries",
            type: "array",
            required: true,
            description: "Array of journal entries to analyze",
          },
          {
            name: "description",
            type: "string",
            required: false,
            description: "Optional description of the transaction",
          },
        ],
        responses: [
          {
            status: 200,
            description: "Successful response",
            example: `{
  "transaction_type": "Identified transaction type",
  "confidence_score": 0.95,
  "applicable_standards": ["FAS 1", "FAS 2"],
  "analysis": "Detailed analysis of the transaction",
  "recommendations": ["Recommendation 1", "Recommendation 2"],
  "standard_compliance": {
    "compliant": true,
    "issues": [],
    "suggestions": []
  }
}`,
          },
          {
            status: 400,
            description: "Bad Request",
            example: `{
  "message": "Invalid request format or missing required fields",
  "details": {
    "field": "entries",
    "error": "At least one journal entry is required"
  }
}`,
          },
        ],
        requiresAuth: true,
      },
    ],
  },
  {
    id: "standards",
    name: "Standards Enhancement Analysis",
    description: "Endpoints for analyzing standards-related queries and providing guidance on enhancements",
    endpoints: [
      {
        id: "analyze-standards",
        path: "/service3",
        method: "POST",
        summary: "Analyze standards query",
        description: "Analyzes standards-related queries and provides guidance on AAOIFI standards enhancements.",
        parameters: [
          {
            name: "text",
            type: "string",
            required: true,
            description: "The standards-related query",
          },
          {
            name: "file",
            type: "file",
            required: false,
            description: "Supporting document (PDF, DOCX, XLSX)",
          },
        ],
        responses: [
          {
            status: 200,
            description: "Successful response",
            example: `{
  "analysis": "Detailed analysis of the standards query",
  "recommendations": ["Recommendation 1", "Recommendation 2"],
  "applicable_standards": ["FAS 1", "FAS 2"],
  "implementation_guidance": "Guidance on implementing the standards",
  "standard_updates": [
    {
      "standard": "FAS 1",
      "update_type": "Clarification",
      "description": "Description of the update"
    }
  ]
}`,
          },
        ],
        requiresAuth: true,
      },
    ],
  },
  {
    id: "finfraud",
    name: "FinFraud Shield Analysis",
    description: "Endpoints for analyzing financial fraud scenarios and providing risk assessment",
    endpoints: [
      {
        id: "analyze-fraud",
        path: "/service4",
        method: "POST",
        summary: "Analyze fraud scenario",
        description: "Analyzes financial fraud scenarios and provides risk assessment based on AAOIFI standards.",
        parameters: [
          {
            name: "text",
            type: "string",
            required: true,
            description: "The fraud scenario description",
          },
          {
            name: "file",
            type: "file",
            required: false,
            description: "Supporting document (PDF, DOCX, XLSX)",
          },
        ],
        responses: [
          {
            status: 200,
            description: "Successful response",
            example: `{
  "risk_assessment": "Detailed risk assessment",
  "risk_level": "HIGH",
  "recommendations": ["Recommendation 1", "Recommendation 2"],
  "applicable_standards": ["FAS 1", "FAS 2"],
  "mitigation_strategies": ["Strategy 1", "Strategy 2"],
  "compliance_issues": [
    {
      "standard": "FAS 1",
      "issue": "Description of the compliance issue",
      "severity": "HIGH"
    }
  ]
}`,
          },
        ],
        requiresAuth: true,
      },
    ],
  },
]

export default function ApiDocumentation() {
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({})
  const [expandedEndpoints, setExpandedEndpoints] = useState<Record<string, boolean>>({})
  const [apiKey, setApiKey] = useState("")
  const [tryItMode, setTryItMode] = useState<Record<string, boolean>>({})
  const [requestParams, setRequestParams] = useState<Record<string, Record<string, string>>>({})
  const [responseData, setResponseData] = useState<
    Record<string, { loading: boolean; data: string | null; error: string | null }>
  >({})

  const toggleGroup = (groupId: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }))
  }

  const toggleEndpoint = (endpointId: string) => {
    setExpandedEndpoints((prev) => ({
      ...prev,
      [endpointId]: !prev[endpointId],
    }))
  }

  const toggleTryItMode = (endpointId: string) => {
    setTryItMode((prev) => ({
      ...prev,
      [endpointId]: !prev[endpointId],
    }))

    // Initialize request params if not already
    if (!requestParams[endpointId]) {
      const endpoint = apiEndpoints.flatMap((group) => group.endpoints).find((e) => e.id === endpointId)

      if (endpoint) {
        const initialParams: Record<string, string> = {}
        endpoint.parameters.forEach((param) => {
          initialParams[param.name] = ""
        })
        setRequestParams((prev) => ({
          ...prev,
          [endpointId]: initialParams,
        }))
      }
    }
  }

  const updateRequestParam = (endpointId: string, paramName: string, value: string) => {
    setRequestParams((prev) => ({
      ...prev,
      [endpointId]: {
        ...prev[endpointId],
        [paramName]: value,
      },
    }))
  }

  const executeRequest = (endpointId: string) => {
    // Find the endpoint
    const endpoint = apiEndpoints.flatMap((group) => group.endpoints).find((e) => e.id === endpointId)

    if (!endpoint) return

    // Set loading state
    setResponseData((prev) => ({
      ...prev,
      [endpointId]: {
        loading: true,
        data: null,
        error: null,
      },
    }))

    // Simulate API request
    setTimeout(() => {
      // Simulate success response
      const successResponse = endpoint.responses.find((r) => r.status >= 200 && r.status < 300)

      if (successResponse) {
        setResponseData((prev) => ({
          ...prev,
          [endpointId]: {
            loading: false,
            data: successResponse.example,
            error: null,
          },
        }))
      } else {
        setResponseData((prev) => ({
          ...prev,
          [endpointId]: {
            loading: false,
            data: null,
            error: "No success response defined for this endpoint",
          },
        }))
      }
    }, 1500)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const getMethodColor = (method: HttpMethod) => {
    switch (method) {
      case "GET":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
      case "POST":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
      case "PUT":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
      case "DELETE":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
      case "PATCH":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
    }
  }

  return (
    <div className="min-h-screen bg-light dark:bg-dark">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <Link href="/" className="inline-flex items-center text-primary hover:text-primary/80">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </div>
          <ThemeToggle className="bg-transparent shadow-none" />
        </div>

        <div className="bg-white dark:bg-dark-accent shadow rounded-lg overflow-hidden">
          <div className="px-6 py-8 border-b border-gray-200 dark:border-gray-700">
            <h1 className="text-3xl font-bold text-dark dark:text-white">API Documentation</h1>
            <p className="mt-2 text-neutral">Complete reference for the FinStandAI API</p>
          </div>

          <div className="px-6 py-6">
            <div className="mb-8">
              <h2 className="text-xl font-bold text-dark dark:text-white mb-4">Authentication</h2>
              <p className="mb-4 dark:text-gray-300">
                All API requests require authentication using a JWT token. The token should be included in the Authorization header.
              </p>

              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md mb-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium dark:text-white">JWT Token</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-neutral hover:text-primary transition-colors"
                    onClick={() => copyToClipboard("Authorization: Bearer YOUR_JWT_TOKEN")}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                  </Button>
                </div>
                <div className="flex items-center mb-4">
                  <input
                    type="text"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Enter your JWT token"
                    className="flex-1 p-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-l-md focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <Button className="rounded-l-none">
                    <Lock className="w-4 h-4 mr-2" />
                    Authorize
                  </Button>
                </div>
                <pre className="text-sm bg-gray-100 dark:bg-gray-900 p-3 rounded-md overflow-x-auto">
                  <code className="dark:text-gray-300">
                    {`// Example request with JWT token
fetch('http://localhost:3000/gateway/service1', {
  headers: {
    'Authorization': 'Bearer ${apiKey || "YOUR_JWT_TOKEN"}',
    'Content-Type': 'multipart/form-data'
  },
  body: formData
})`}
                  </code>
                </pre>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-bold text-dark dark:text-white mb-4">Endpoints</h2>

              <div className="space-y-4">
                {apiEndpoints.map((group) => (
                  <div
                    key={group.id}
                    className="border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden"
                  >
                    <button
                      className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 text-left font-medium text-dark dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      onClick={() => toggleGroup(group.id)}
                    >
                      <span>{group.name}</span>
                      <ChevronDown
                        className={`w-5 h-5 transition-transform ${
                          expandedGroups[group.id] ? "rotate-180" : "rotate-0"
                        }`}
                      />
                    </button>

                    <AnimatePresence>
                      {expandedGroups[group.id] && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                            <p className="text-neutral mb-4">{group.description}</p>

                            <div className="space-y-4">
                              {group.endpoints.map((endpoint) => (
                                <div
                                  key={endpoint.id}
                                  className="border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden"
                                >
                                  <button
                                    className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                    onClick={() => toggleEndpoint(endpoint.id)}
                                  >
                                    <div className="flex items-center">
                                      <span
                                        className={`inline-block px-2 py-1 text-xs font-medium rounded-md mr-3 ${getMethodColor(
                                          endpoint.method,
                                        )}`}
                                      >
                                        {endpoint.method}
                                      </span>
                                      <span className="font-mono text-sm dark:text-white">{endpoint.path}</span>
                                    </div>
                                    <div className="flex items-center">
                                      {endpoint.requiresAuth && <Lock className="w-4 h-4 mr-2 text-neutral" />}
                                      <ChevronRight
                                        className={`w-5 h-5 transition-transform ${
                                          expandedEndpoints[endpoint.id] ? "rotate-90" : "rotate-0"
                                        }`}
                                      />
                                    </div>
                                  </button>

                                  <AnimatePresence>
                                    {expandedEndpoints[endpoint.id] && (
                                      <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                      >
                                        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                                          <h3 className="font-medium text-lg mb-2 dark:text-white">
                                            {endpoint.summary}
                                          </h3>
                                          <p className="text-neutral mb-4">{endpoint.description}</p>

                                          <div className="flex justify-between items-center mb-4">
                                            <h4 className="font-medium dark:text-white">Parameters</h4>
                                            <Button
                                              variant={tryItMode[endpoint.id] ? "default" : "outline"}
                                              size="sm"
                                              onClick={() => toggleTryItMode(endpoint.id)}
                                            >
                                              {tryItMode[endpoint.id] ? (
                                                <>
                                                  <X className="w-4 h-4 mr-2" />
                                                  Cancel
                                                </>
                                              ) : (
                                                <>
                                                  <Play className="w-4 h-4 mr-2" />
                                                  Try it out
                                                </>
                                              )}
                                            </Button>
                                          </div>

                                          {endpoint.parameters.length > 0 ? (
                                            <div className="overflow-x-auto mb-6">
                                              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                                <thead className="bg-gray-50 dark:bg-gray-800">
                                                  <tr>
                                                    <th
                                                      scope="col"
                                                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                                                    >
                                                      Name
                                                    </th>
                                                    <th
                                                      scope="col"
                                                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                                                    >
                                                      Type
                                                    </th>
                                                    <th
                                                      scope="col"
                                                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                                                    >
                                                      Required
                                                    </th>
                                                    <th
                                                      scope="col"
                                                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                                                    >
                                                      Description
                                                    </th>
                                                    {tryItMode[endpoint.id] && (
                                                      <th
                                                        scope="col"
                                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                                                      >
                                                        Value
                                                      </th>
                                                    )}
                                                  </tr>
                                                </thead>
                                                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                                                  {endpoint.parameters.map((param) => (
                                                    <tr key={param.name}>
                                                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-dark dark:text-white">
                                                        {param.name}
                                                      </td>
                                                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral">
                                                        {param.type}
                                                      </td>
                                                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral">
                                                        {param.required ? "Yes" : "No"}
                                                      </td>
                                                      <td className="px-6 py-4 text-sm text-neutral">
                                                        {param.description}
                                                      </td>
                                                      {tryItMode[endpoint.id] && (
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral">
                                                          <input
                                                            type="text"
                                                            className="w-full p-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-md"
                                                            value={requestParams[endpoint.id]?.[param.name] || ""}
                                                            onChange={(e) =>
                                                              updateRequestParam(
                                                                endpoint.id,
                                                                param.name,
                                                                e.target.value,
                                                              )
                                                            }
                                                            placeholder={param.required ? "Required" : "Optional"}
                                                          />
                                                        </td>
                                                      )}
                                                    </tr>
                                                  ))}
                                                </tbody>
                                              </table>
                                            </div>
                                          ) : (
                                            <p className="text-neutral mb-6">No parameters required.</p>
                                          )}

                                          {tryItMode[endpoint.id] && (
                                            <div className="mb-6">
                                              <Button
                                                onClick={() => executeRequest(endpoint.id)}
                                                disabled={responseData[endpoint.id]?.loading}
                                              >
                                                {responseData[endpoint.id]?.loading ? (
                                                  <>
                                                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                                                    Executing...
                                                  </>
                                                ) : (
                                                  <>
                                                    <Play className="w-4 h-4 mr-2" />
                                                    Execute
                                                  </>
                                                )}
                                              </Button>
                                            </div>
                                          )}

                                          {tryItMode[endpoint.id] && responseData[endpoint.id] && (
                                            <div className="mb-6">
                                              <h4 className="font-medium mb-2 dark:text-white">Response</h4>
                                              {responseData[endpoint.id].error ? (
                                                <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 p-4 rounded-md">
                                                  {responseData[endpoint.id].error}
                                                </div>
                                              ) : responseData[endpoint.id].data ? (
                                                <div className="relative">
                                                  <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="absolute top-2 right-2 text-neutral hover:text-primary transition-colors"
                                                    onClick={() =>
                                                      copyToClipboard(responseData[endpoint.id].data || "")
                                                    }
                                                  >
                                                    <Copy className="w-4 h-4" />
                                                  </Button>
                                                  <pre className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md overflow-x-auto text-sm">
                                                    <code className="dark:text-gray-300">
                                                      {responseData[endpoint.id].data}
                                                    </code>
                                                  </pre>
                                                </div>
                                              ) : null}
                                            </div>
                                          )}

                                          <h4 className="font-medium mb-2 dark:text-white">Responses</h4>
                                          <div className="space-y-4">
                                            {endpoint.responses.map((response) => (
                                              <div key={response.status}>
                                                <div className="flex items-center mb-2">
                                                  <span
                                                    className={`inline-block px-2 py-1 text-xs font-medium rounded-md mr-2 ${
                                                      response.status >= 200 && response.status < 300
                                                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                                                        : response.status >= 400 && response.status < 500
                                                          ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                                                          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                                                    }`}
                                                  >
                                                    {response.status}
                                                  </span>
                                                  <span className="text-sm text-neutral">{response.description}</span>
                                                </div>
                                                <div className="relative">
                                                  <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="absolute top-2 right-2 text-neutral hover:text-primary transition-colors"
                                                    onClick={() => copyToClipboard(response.example)}
                                                  >
                                                    <Copy className="w-4 h-4" />
                                                  </Button>
                                                  <pre className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md overflow-x-auto text-sm">
                                                    <code className="dark:text-gray-300">{response.example}</code>
                                                  </pre>
                                                </div>
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </div>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-bold text-dark dark:text-white mb-4">Rate Limits</h2>
              <p className="dark:text-gray-300">
                The API is rate limited to 100 requests per hour per user. Rate limit headers are included in the response:
              </p>
              <ul className="list-disc list-inside mt-2 dark:text-gray-300">
                <li>X-RateLimit-Limit: Maximum requests per hour</li>
                <li>X-RateLimit-Remaining: Remaining requests in the current hour</li>
                <li>X-RateLimit-Reset: Time when the rate limit resets (Unix timestamp)</li>
              </ul>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-bold text-dark dark:text-white mb-4">SDKs and Libraries</h2>
              <p className="mb-4 dark:text-gray-300">
                We provide official client libraries for several programming languages:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {["JavaScript/TypeScript", "Python", "Java", "Ruby", "Go"].map((lang) => (
                  <div
                    key={lang}
                    className="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex-1">
                      <h3 className="font-medium dark:text-white">{lang}</h3>
                      <p className="text-sm text-neutral">Official SDK</p>
                    </div>
                    <ExternalLink className="w-5 h-5 text-neutral" />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold text-dark dark:text-white mb-4">Support</h2>
              <p className="dark:text-gray-300">
                If you have any questions or need assistance with the API, please contact our support team at{" "}
                <a href="mailto:support@mizanex.com" className="text-primary">
                  support@mizanex.com
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
