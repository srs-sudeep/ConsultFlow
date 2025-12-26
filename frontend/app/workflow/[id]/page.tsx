'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { workflowApi } from '@/lib/api'
import Link from 'next/link'

interface Workflow {
  _id: string
  name: string
  actions: string[]
  actionConfigs?: Record<string, any>
  createdAt: string
}

export default function WorkflowDetailPage() {
  const router = useRouter()
  const params = useParams()
  const workflowId = params.id as string

  const [workflow, setWorkflow] = useState<Workflow | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadWorkflow()
  }, [workflowId])

  const loadWorkflow = async () => {
    try {
      const res = await workflowApi.getOne(workflowId)
      setWorkflow(res.data)
    } catch (error: any) {
      if (error.response?.status === 404) {
        router.push('/dashboard')
      }
    } finally {
      setLoading(false)
    }
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

  const actionIcons: Record<string, string> = {
    generate_mom: '📝',
    send_email: '📧',
    create_calendar: '📅',
    teams_post: '💬',
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{workflow.name}</h1>
              <p className="text-sm text-gray-600">
                {workflow.actions.length} action(s) • Created{' '}
                {new Date(workflow.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => router.push('/dashboard')}
                className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-300"
              >
                Back
              </button>
              <Link
                href={`/workflow/execute/${workflow._id}`}
                className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700"
              >
                Execute Workflow
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Workflow Actions</h2>
          <div className="space-y-3">
            {workflow.actions.map((action, index) => (
              <div
                key={index}
                className="flex items-center rounded-lg border border-gray-200 p-4"
              >
                <span className="mr-4 text-2xl">{actionIcons[action] || '⚙️'}</span>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">
                    {action.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                  </div>
                  <div className="text-sm text-gray-600">
                    {action === 'generate_mom' && 'Generate structured Meeting Minutes'}
                    {action === 'send_email' && 'Send email via Outlook'}
                    {action === 'create_calendar' && 'Create Outlook calendar event'}
                    {action === 'teams_post' && 'Post message to Teams channel'}
                  </div>
                </div>
                <span className="text-sm text-gray-500">Step {index + 1}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
