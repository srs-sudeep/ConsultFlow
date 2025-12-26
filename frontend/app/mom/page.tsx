'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { momApi, workflowApi } from '@/lib/api'
import MOMDisplay from '@/components/MOMDisplay'

export default function MOMPage() {
  const router = useRouter()
  const [meetingNotes, setMeetingNotes] = useState('')
  const [momContent, setMomContent] = useState<string | null>(null)
  const [momStructured, setMomStructured] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [workflows, setWorkflows] = useState<any[]>([])

  useEffect(() => {
    loadWorkflows()
  }, [])

  const loadWorkflows = async () => {
    try {
      const workflowsRes = await workflowApi.getAll()
      setWorkflows(workflowsRes.data)
    } catch (err) {
      // Ignore errors
    }
  }

  const handleGenerate = async () => {
    if (!meetingNotes.trim()) {
      setError('Please enter meeting notes')
      return
    }

    setLoading(true)
    setError(null)
    setMomContent(null)
    setMomStructured(null)

    try {
      const res = await momApi.generate(meetingNotes)
      setMomContent(res.data.mom)
      setMomStructured(res.data.structured)
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to generate MOM')
    } finally {
      setLoading(false)
    }
  }

  const handleUseInWorkflow = (data: any) => {
    // Navigate to workflow creation with pre-filled data
    router.push('/workflow/create')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">MOM Generator</h1>
            <button
              onClick={() => router.push('/dashboard')}
              className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-300"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Input Section */}
          <div className="rounded-lg bg-white p-6 shadow-md">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              Meeting Notes / Transcript
            </h2>

            {error && (
              <div className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-800">
                {error}
              </div>
            )}

            <textarea
              value={meetingNotes}
              onChange={(e) => setMeetingNotes(e.target.value)}
              rows={15}
              className="mb-4 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Paste your meeting notes or transcript here..."
            />

            <button
              onClick={handleGenerate}
              disabled={loading || !meetingNotes.trim()}
              className="w-full rounded-lg bg-primary-600 px-6 py-3 font-medium text-white transition-colors hover:bg-primary-700 disabled:opacity-50"
            >
              {loading ? 'Generating...' : 'Generate MOM'}
            </button>
          </div>

          {/* Output Section */}
          <div className="rounded-lg bg-white p-6 shadow-md">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Generated MOM</h2>
              {momContent && (
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(momContent)
                    alert('MOM copied to clipboard!')
                  }}
                  className="rounded-lg bg-gray-200 px-3 py-1 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-300"
                >
                  Copy
                </button>
              )}
            </div>

            {momContent ? (
              <MOMDisplay
                momContent={momContent}
                structuredData={momStructured}
                onUseInWorkflow={handleUseInWorkflow}
              />
            ) : (
              <div className="flex h-full min-h-[400px] items-center justify-center rounded-lg border-2 border-dashed border-gray-300">
                <p className="text-gray-500">
                  {loading ? 'Generating MOM...' : 'Generated MOM will appear here'}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
