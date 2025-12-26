'use client'

import ReactMarkdown from 'react-markdown'

interface MOMDisplayProps {
  momContent: string
  structuredData?: any
  onUseInWorkflow?: (data: any) => void
}

export default function MOMDisplay({ momContent, structuredData, onUseInWorkflow }: MOMDisplayProps) {
  return (
    <div className="space-y-6">
      <div className="prose max-w-none rounded-lg border border-gray-200 bg-white p-6">
        <ReactMarkdown className="text-sm text-gray-800">{momContent}</ReactMarkdown>
      </div>

      {structuredData && (
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Extracted Data</h3>
          <div className="space-y-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">Attendees:</span>{' '}
              <span className="text-gray-600">{structuredData.attendees?.join(', ') || 'N/A'}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Meeting Title:</span>{' '}
              <span className="text-gray-600">{structuredData.meetingTitle || 'N/A'}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Date & Time:</span>{' '}
              <span className="text-gray-600">{structuredData.dateTime || 'N/A'}</span>
            </div>
            {structuredData.todos && structuredData.todos.length > 0 && (
              <div>
                <span className="font-medium text-gray-700">Action Items:</span>
                <ul className="mt-2 space-y-1">
                  {structuredData.todos.map((todo: any, idx: number) => (
                    <li key={idx} className="text-gray-600">
                      • {typeof todo === 'string' ? todo : todo.description || JSON.stringify(todo)}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {onUseInWorkflow && structuredData && (
        <button
          onClick={() => onUseInWorkflow(structuredData)}
          className="w-full rounded-lg bg-primary-600 px-6 py-3 font-medium text-white transition-colors hover:bg-primary-700"
        >
          Use in Workflow
        </button>
      )}
    </div>
  )
}

