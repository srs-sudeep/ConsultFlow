'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { authApi, workflowApi, logsApi } from '@/lib/api'

interface User {
  id: string
  email: string
  name: string
}

interface Workflow {
  _id: string
  name: string
  actions: string[]
  createdAt: string
}

interface Log {
  _id: string
  status: string
  executedAt: string
  workflowId: {
    name: string
  }
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [workflows, setWorkflows] = useState<Workflow[]>([])
  const [logs, setLogs] = useState<Log[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [userRes, workflowsRes, logsRes] = await Promise.all([
        authApi.getMe(),
        workflowApi.getAll(),
        logsApi.getAll({ limit: 5 }),
      ])

      setUser(userRes.data)
      setWorkflows(workflowsRes.data)
      setLogs(logsRes.data.logs)
    } catch (error: any) {
      if (error.response?.status === 401) {
        router.push('/login')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await authApi.logout()
    } catch (error) {
      router.push('/login')
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">ConsultFlow</h1>
              {user && (
                <p className="text-sm text-gray-600">
                  Welcome, {user.name} ({user.email})
                </p>
              )}
            </div>
            <button
              onClick={handleLogout}
              className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-300"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Quick Actions */}
        <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/workflow/create"
            className="rounded-lg bg-white p-6 shadow-md transition-shadow hover:shadow-lg"
          >
            <div className="mb-2 text-2xl">⚙️</div>
            <h3 className="mb-1 text-lg font-semibold text-gray-900">
              Create Workflow
            </h3>
            <p className="text-sm text-gray-600">
              Build automation workflows for your consulting tasks
            </p>
          </Link>

          <Link
            href="/mom"
            className="rounded-lg bg-white p-6 shadow-md transition-shadow hover:shadow-lg"
          >
            <div className="mb-2 text-2xl">📝</div>
            <h3 className="mb-1 text-lg font-semibold text-gray-900">
              Generate MOM
            </h3>
            <p className="text-sm text-gray-600">
              AI-powered Meeting Minutes generation
            </p>
          </Link>

          <Link
            href="/logs"
            className="rounded-lg bg-white p-6 shadow-md transition-shadow hover:shadow-lg"
          >
            <div className="mb-2 text-2xl">📊</div>
            <h3 className="mb-1 text-lg font-semibold text-gray-900">
              View Logs
            </h3>
            <p className="text-sm text-gray-600">
              Check workflow execution history
            </p>
          </Link>
        </div>

        {/* Recent Workflows */}
        <div className="mb-8 rounded-lg bg-white p-6 shadow-md">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              Your Workflows
            </h2>
            <Link
              href="/workflow/create"
              className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700"
            >
              + New Workflow
            </Link>
          </div>

          {workflows.length === 0 ? (
            <p className="text-gray-500">No workflows yet. Create one to get started!</p>
          ) : (
            <div className="space-y-3">
              {workflows.map((workflow) => (
                <div
                  key={workflow._id}
                  className="flex items-center justify-between rounded-lg border border-gray-200 p-4"
                >
                  <div>
                    <h3 className="font-medium text-gray-900">{workflow.name}</h3>
                    <p className="text-sm text-gray-600">
                      {workflow.actions.length} action(s)
                    </p>
                  </div>
                  <Link
                    href={`/workflow/execute/${workflow._id}`}
                    className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700"
                  >
                    Execute
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Logs */}
        <div className="rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">
            Recent Executions
          </h2>

          {logs.length === 0 ? (
            <p className="text-gray-500">No executions yet.</p>
          ) : (
            <div className="space-y-3">
              {logs.map((log) => (
                <div
                  key={log._id}
                  className="flex items-center justify-between rounded-lg border border-gray-200 p-4"
                >
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {log.workflowId?.name || 'Unknown Workflow'}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {new Date(log.executedAt).toLocaleString()}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      log.status === 'success'
                        ? 'bg-green-100 text-green-800'
                        : log.status === 'failed'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {log.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

