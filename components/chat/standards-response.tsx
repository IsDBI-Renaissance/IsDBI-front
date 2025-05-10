import { motion } from "framer-motion"
import { CheckCircle2, AlertCircle, Clock, FileText, ArrowRight } from "lucide-react"

interface PipelineStage {
  timestamp: string
  quality_score: number
  notes: string[]
  processing_steps: string[]
}

interface DetailedAssessment {
  strengths: string[]
  weaknesses: string[]
  improvements: string[]
}

interface Enhancement {
  improvement: string
  recommendation: string
}

interface EnhancedStandard {
  title: string
  sections: {
    title: string
    clauses: string[]
  }[]
  definitions: {
    term: string
    definition: string
  }[]
}

interface StandardsResponse {
  audit_trail: {
    start_time: string
    input_length: number
    pipeline_stages: string[]
  }
  pipeline_stages: {
    preprocessor: PipelineStage
    reviewer: PipelineStage
    enhancer: PipelineStage
    validator: PipelineStage
  }
  detailed_assessment: {
    reviewer: DetailedAssessment
    validator: DetailedAssessment
  }
  enhancements: Enhancement[]
  final_summary: {
    completion_time: string
    average_quality_score: number
    total_processing_time: number
  }
  enhanced_standard: EnhancedStandard
}

interface StandardsResponseProps {
  content: string
}

export function StandardsResponse({ content }: StandardsResponseProps) {
  // Parse the JSON content
  let data: StandardsResponse
  try {
    data = JSON.parse(content)
  } catch (error) {
    console.error("Failed to parse standards response:", error)
    return (
      <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg">
        Failed to parse standards response. Please check the response format.
      </div>
    )
  }

  // Helper function to format timestamps
  const formatTimestamp = (timestamp: string) => {
    try {
      return new Date(timestamp).toLocaleString()
    } catch (error) {
      return timestamp
    }
  }

  return (
    <div className="space-y-6 p-4 bg-white dark:bg-dark-accent rounded-lg shadow-sm">
      {/* Audit Trail Summary */}
      <section className="space-y-2">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Audit Trail Summary
        </h3>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>Start Time: {formatTimestamp(data.audit_trail.start_time)}</li>
          <li>Input Length: {data.audit_trail.input_length} characters</li>
          <li>Pipeline Stages: {data.audit_trail.pipeline_stages.join(" → ")}</li>
        </ul>
      </section>

      {/* Pipeline Stages */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <ArrowRight className="w-5 h-5" />
          Pipeline Stages
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(data.pipeline_stages).map(([stage, details]) => (
            <div key={stage} className="p-4 border rounded-lg space-y-2">
              <h4 className="font-medium capitalize">{stage}</h4>
              <div className="text-sm space-y-2">
                <p>Timestamp: {formatTimestamp(details.timestamp)}</p>
                <p>Quality Score: {details.quality_score}%</p>
                <div>
                  <p className="font-medium">Notes:</p>
                  <ul className="list-disc list-inside">
                    {details.notes.map((note, i) => (
                      <li key={i}>{note}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="font-medium">Processing Steps:</p>
                  <ul className="list-disc list-inside">
                    {details.processing_steps.map((step, i) => (
                      <li key={i}>{step}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Detailed Assessment */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Detailed Assessment
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(data.detailed_assessment).map(([role, assessment]) => (
            <div key={role} className="p-4 border rounded-lg space-y-4">
              <h4 className="font-medium capitalize">{role} Assessment</h4>
              <div className="space-y-4">
                <div>
                  <h5 className="font-medium flex items-center gap-2 text-green-600">
                    <CheckCircle2 className="w-4 h-4" />
                    Strengths
                  </h5>
                  <ul className="list-disc list-inside text-sm">
                    {assessment.strengths.map((strength, i) => (
                      <li key={i}>{strength}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium flex items-center gap-2 text-red-600">
                    <AlertCircle className="w-4 h-4" />
                    Weaknesses
                  </h5>
                  <ul className="list-disc list-inside text-sm">
                    {assessment.weaknesses.map((weakness, i) => (
                      <li key={i}>{weakness}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium">Areas of Improvement</h5>
                  <ul className="list-disc list-inside text-sm">
                    {assessment.improvements.map((improvement, i) => (
                      <li key={i}>{improvement}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Enhancements and Recommendations */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold">Enhancements and Recommendations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.enhancements.map((enhancement, i) => (
            <div key={i} className="p-4 border rounded-lg space-y-2">
              <h4 className="font-medium">Improvement {i + 1}</h4>
              <p className="text-sm">{enhancement.improvement}</p>
              <h5 className="font-medium">Recommendation:</h5>
              <p className="text-sm">{enhancement.recommendation}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Final Process Summary */}
      <section className="p-4 border rounded-lg space-y-2">
        <h3 className="text-lg font-semibold">Final Process Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="font-medium">Completion Time</p>
            <p>{formatTimestamp(data.final_summary.completion_time)}</p>
          </div>
          <div>
            <p className="font-medium">Average Quality Score</p>
            <p>{data.final_summary.average_quality_score}%</p>
          </div>
          <div>
            <p className="font-medium">Total Processing Time</p>
            <p>{data.final_summary.total_processing_time} seconds</p>
          </div>
        </div>
      </section>

      {/* Enhanced Standard */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold">Enhanced Standard</h3>
        <div className="p-4 border rounded-lg space-y-4">
          <h4 className="font-medium text-xl">{data.enhanced_standard.title}</h4>
          
          {/* Sections */}
          <div className="space-y-4">
            {data.enhanced_standard.sections.map((section, i) => (
              <div key={i} className="space-y-2">
                <h5 className="font-medium">{section.title}</h5>
                <ul className="list-disc list-inside text-sm space-y-1">
                  {section.clauses.map((clause, j) => (
                    <li key={j}>{clause}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Definitions */}
          <div className="mt-6">
            <h5 className="font-medium mb-2">Definitions</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.enhanced_standard.definitions.map((def, i) => (
                <div key={i} className="p-2 border rounded">
                  <p className="font-medium text-sm">{def.term}</p>
                  <p className="text-sm">{def.definition}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
} 