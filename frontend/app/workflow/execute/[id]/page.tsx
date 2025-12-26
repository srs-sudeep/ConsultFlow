'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { workflowApi, momApi } from '@/lib/api'
import ActionConfigSidebar from '@/components/ActionConfigSidebar'
import MOMDisplay from '@/components/MOMDisplay'

interface Workflow {
  _id: string
  name: string
  actions: string[]
  actionConfigs?: Record<string, any>
  createdAt: string
}

export default function ExecuteWorkflowPage() {
  const router = useRouter()
  const params = useParams()
  const workflowId = params.id as string

  const [workflow, setWorkflow] = useState<Workflow | null>(null)
  const [loading, setLoading] = useState(true)
  const [executing, setExecuting] = useState(false)
  const [executionResult, setExecutionResult] = useState<any>(null)
  const [momContent, setMomContent] = useState<string | null>(null)
  const [momStructured, setMomStructured] = useState<any>(null)
  const [editingAction, setEditingAction] = useState<{ type: string; config: any } | null>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [executionData, setExecutionData] = useState<any>({})

  useEffect(() => {
    loadWorkflow()
  }, [workflowId])

  const loadWorkflow = async () => {
    try {
      const res = await workflowApi.getOne(workflowId)
      setWorkflow(res.data)
      
      // Initialize execution data from workflow configs
      if (res.data.actionConfigs) {
        setExecutionData(res.data.actionConfigs)
      }
    } catch (error: any) {
      if (error.response?.status === 404) {
        router.push('/dashboard')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateMOM = async () => {
    if (!executionData.meetingNotes?.trim()) {
      alert('Please enter meeting notes first')
      return
    }

    try {
      const res = await momApi.generate(executionData.meetingNotes)
      setMomContent(res.data.mom)
      setMomStructured(res.data.structured)
      
      // Pre-fill execution data from structured MOM
      if (res.data.structured) {
        const structured = res.data.structured
        setExecutionData({
          ...executionData,
          emailTo: structured.attendees?.map((a: string) => {
            // Try to extract email or create placeholder
            const emailMatch = a.match(/[\w\.-]+@[\w\.-]+\.\w+/)
            return emailMatch ? emailMatch[0] : `${a.split(' ')[0].toLowerCase()}@example.com`
          }).join(', ') || executionData.emailTo,
          emailSubject: `Meeting Minutes - ${structured.meetingTitle || 'Meeting'}`,
          emailBody: res.data.mom, // Use generated MOM as email body
          calendarTitle: structured.nextMeeting?.title || 'Follow-up Meeting',
          calendarStart: structured.nextMeeting?.dateTime || '',
          calendarAttendees: structured.nextMeeting?.attendees || structured.attendees || [],
        })
      }
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to generate MOM')
    }
  }

  const handleExecute = async () => {
    setExecuting(true)
    setExecutionResult(null)

    try {
      // Pass emailBody - if empty/undefined, backend will use generated MOM
      const res = await workflowApi.run(workflowId, {
        momContent: executionData.meetingNotes,
        emailTo: executionData.emailTo,
        emailSubject: executionData.emailSubject,
        emailBody: executionData.emailBody?.trim() || undefined, // undefined = use MOM
        calendarTitle: executionData.calendarTitle,
        calendarBody: executionData.calendarBody?.trim() || undefined,
        calendarStart: executionData.calendarStart,
        calendarEnd: executionData.calendarEnd,
        calendarAttendees: executionData.calendarAttendees,
        teamsTeamId: executionData.teamsTeamId,
        teamsChannelId: executionData.teamsChannelId,
        teamsMessage: executionData.teamsMessage?.trim() || undefined,
      })

      setExecutionResult(res.data)
      if (res.data.success) {
        setTimeout(() => {
          router.push('/dashboard')
        }, 2000)
      }
    } catch (error: any) {
      setExecutionResult({
        success: false,
        error: error.response?.data?.error || 'Failed to execute workflow',
      })
    } finally {
      setExecuting(false)
    }
  }

  const handleEditAction = (actionType: string) => {
    const config = executionData[actionType] || {}
    setEditingAction({ type: actionType, config })
    setIsSidebarOpen(true)
  }

  const handleSaveConfig = (config: any) => {
    if (editingAction) {
      // For send_email, if body is empty, use generated MOM
      if (editingAction.type === 'send_email' && !config.body && momContent) {
        config.body = momContent
      }
      
      setExecutionData({
        ...executionData,
        [editingAction.type]: { ...executionData[editingAction.type], ...config },
      })
    }
    setEditingAction(null)
    setIsSidebarOpen(false)
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!workflow) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{workflow.name}</h1>
              <p className="text-sm text-gray-600">
                {workflow.actions.length} action(s) • Ready to execute
              </p>
            </div>
            <button
              onClick={() => router.push('/dashboard')}
              className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-300"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left Column - Input & Actions */}
          <div className="space-y-6">
            {/* Meeting Notes Input */}
            {workflow.actions.includes('generate_mom') && (
              <div className="rounded-lg bg-white p-6 shadow-md">
                <h2 className="mb-4 text-lg font-semibold text-gray-900">Meeting Notes</h2>
                <textarea
                  value={executionData.meetingNotes || ''}
                  onChange={(e) => setExecutionData({ ...executionData, meetingNotes: e.target.value })}
                  rows={8}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Paste meeting notes or transcript here..."
                />
                <button
                  onClick={handleGenerateMOM}
                  disabled={!executionData.meetingNotes?.trim()}
                  className="mt-4 w-full rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700 disabled:opacity-50"
                >
                  Generate MOM
                </button>
              </div>
            )}

            {/* Action Configuration Cards */}
            {workflow.actions.map((action, index) => (
              <div key={index} className="rounded-lg bg-white p-6 shadow-md">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {action.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </h3>
                  <button
                    onClick={() => handleEditAction(action)}
                    className="rounded-lg px-3 py-1 text-sm font-medium text-primary-600 hover:bg-primary-50 transition-colors"
                  >
                    Edit
                  </button>
                </div>

                {/* Show pre-filled data preview */}
                {action === 'send_email' && (
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">To:</span> {executionData.emailTo || 'Not set'}</div>
                    <div><span className="font-medium">Subject:</span> {executionData.emailSubject || 'Not set'}</div>
                  </div>
                )}
                {action === 'create_calendar' && (
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">Title:</span> {executionData.calendarTitle || 'Not set'}</div>
                    <div><span className="font-medium">Start:</span> {executionData.calendarStart || 'Not set'}</div>
                  </div>
                )}
                {action === 'teams_post' && (
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">Team ID:</span> {executionData.teamsTeamId || 'Not set'}</div>
                    <div><span className="font-medium">Channel ID:</span> {executionData.teamsChannelId || 'Not set'}</div>
                  </div>
                )}
              </div>
            ))}

            {/* Execute Button */}
            <button
              onClick={handleExecute}
              disabled={executing}
              className="w-full rounded-lg bg-primary-600 px-6 py-3 font-medium text-white transition-colors hover:bg-primary-700 disabled:opacity-50"
            >
              {executing ? 'Executing...' : 'Execute Workflow'}
            </button>

            {/* Execution Result */}
            {executionResult && (
              <div
                className={`rounded-lg p-4 ${
                  executionResult.success
                    ? 'bg-green-50 text-green-800'
                    : 'bg-red-50 text-red-800'
                }`}
              >
                <p className="font-medium">
                  {executionResult.success ? '✅ Success!' : '❌ Failed'}
                </p>
                {executionResult.error && (
                  <p className="mt-2 text-sm">{executionResult.error}</p>
                )}
              </div>
            )}
          </div>

          {/* Right Column - MOM Display */}
          {momContent && (
            <div className="rounded-lg bg-white p-6 shadow-md">
              <MOMDisplay
                momContent={momContent}
                structuredData={momStructured}
              />
            </div>
          )}
        </div>
      </main>

      {/* Sidebar for editing actions */}
      <ActionConfigSidebar
        isOpen={isSidebarOpen}
        onClose={() => {
          setIsSidebarOpen(false)
          setEditingAction(null)
        }}
        action={editingAction}
        onSave={handleSaveConfig}
        momData={momStructured}
        momContent={momContent || undefined}
      />
    </div>
  )
}

