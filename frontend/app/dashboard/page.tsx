'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { authApi, workflowApi, logsApi } from '@/lib/api'
import { Plus, Play, FileText, Clock, LogOut, LayoutDashboard, Settings, ChevronRight, Trash2, Zap } from 'lucide-react'
import Logo, { LoadingLogo, Attribution } from '@/components/Logo'

interface User {
  _id: string
  name: string
  email: string
}

interface Workflow {
  _id: string
  name: string
  actions: string[]
  trigger: string
  createdAt: string
}

interface Log {
  _id: string
  workflowId: string
  status: 'success' | 'failed' | 'running'
  actionsExecuted: string[]
  createdAt: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [workflows, setWorkflows] = useState<Workflow[]>([])
  const [recentLogs, setRecentLogs] = useState<Log[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      const [userRes, workflowsRes, logsRes] = await Promise.all([
        authApi.getMe(),
        workflowApi.getAll(),
        logsApi.getAll({ limit: 5 }),
      ])
      setUser(userRes.data)
      setWorkflows(workflowsRes.data)
      // API returns { logs, total, limit, skip }
      setRecentLogs(logsRes.data.logs || [])
    } catch (error: any) {
      if (error.response?.status === 401) {
        router.push('/login')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await authApi.logout()
  }

  const handleDeleteWorkflow = async (id: string) => {
    if (!confirm('Are you sure you want to delete this workflow?')) return
    try {
      await workflowApi.delete(id)
      setWorkflows(workflows.filter((w) => w._id !== id))
    } catch (error) {
      alert('Failed to delete workflow')
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a1a]">
        <LoadingLogo message="Loading dashboard..." />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a1a] text-white flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#16162a] border-r border-gray-800 flex flex-col animate-[slideIn_0.5s_ease-out]">
        <div className="p-5 border-b border-gray-800">
          <Logo size="md" />
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-4 py-3 rounded-lg bg-gray-800/50 text-white"
          >
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </Link>
          <Link
            href="/workflow/create"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-800/50 hover:text-white transition-colors"
          >
            <Plus className="w-5 h-5" />
            New Workflow
          </Link>
          <Link
            href="/mom"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-800/50 hover:text-white transition-colors"
          >
            <FileText className="w-5 h-5" />
            MOM Generator
          </Link>
          <Link
            href="/logs"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-800/50 hover:text-white transition-colors"
          >
            <Clock className="w-5 h-5" />
            Execution Logs
          </Link>
        </nav>

        {/* User section */}
        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">{user?.name}</div>
              <div className="text-xs text-gray-500 truncate">{user?.email}</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2 rounded-lg text-gray-400 hover:bg-gray-800/50 hover:text-white transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name?.split(' ')[0]}!</h1>
            <p className="text-gray-400">Manage your workflow automations and view recent activity.</p>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Link
              href="/workflow/create"
              className="bg-gradient-to-br from-orange-500/10 to-pink-500/10 rounded-xl border border-gray-800 p-6 hover:border-orange-500/50 transition-all group animate-[slideUp_0.5s_ease-out] hover:shadow-lg hover:shadow-orange-500/10"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform">
                <Plus className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold mb-1">Create Workflow</h3>
              <p className="text-sm text-gray-400">Build a new automation workflow</p>
            </Link>

            <Link
              href="/mom"
              className="bg-[#16162a] rounded-xl border border-gray-800 p-6 hover:border-purple-500/50 transition-all group animate-[slideUp_0.6s_ease-out] hover:shadow-lg hover:shadow-purple-500/10"
            >
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400 mb-4 group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold mb-1">Generate MOM</h3>
              <p className="text-sm text-gray-400">Create meeting minutes from transcript</p>
            </Link>

            <Link
              href="/logs"
              className="bg-[#16162a] rounded-xl border border-gray-800 p-6 hover:border-blue-500/50 transition-all group animate-[slideUp_0.7s_ease-out] hover:shadow-lg hover:shadow-blue-500/10"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400 mb-4 group-hover:scale-110 transition-transform">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold mb-1">View Logs</h3>
              <p className="text-sm text-gray-400">Check execution history</p>
            </Link>
          </div>

          {/* Workflows */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Your Workflows</h2>
              <Link
                href="/workflow/create"
                className="text-sm text-orange-500 hover:text-orange-400 transition-colors flex items-center gap-1"
              >
                New Workflow
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {workflows.length === 0 ? (
              <div className="bg-[#16162a] rounded-xl border border-gray-800 p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-gray-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No workflows yet</h3>
                <p className="text-gray-400 mb-4">Create your first workflow to get started</p>
                <Link
                  href="/workflow/create"
                  className="inline-flex items-center gap-2 px-6 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-pink-500 text-white font-medium hover:from-orange-600 hover:to-pink-600 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  Create Workflow
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {workflows.map((workflow) => (
                  <div
                    key={workflow._id}
                    className="bg-[#16162a] rounded-xl border border-gray-800 p-4 hover:border-gray-700 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white">
                          <Zap className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{workflow.name}</h3>
                          <p className="text-sm text-gray-400">
                            {workflow.actions.length} action(s) • {workflow.trigger} trigger
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/workflow/execute/${workflow._id}`}
                          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-pink-500 text-white text-sm font-medium hover:from-orange-600 hover:to-pink-600 transition-all"
                        >
                          <Play className="w-4 h-4" />
                          Execute
                        </Link>
                        <button
                          onClick={() => handleDeleteWorkflow(workflow._id)}
                          className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-500/10 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Activity */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Recent Activity</h2>
              <Link
                href="/logs"
                className="text-sm text-orange-500 hover:text-orange-400 transition-colors flex items-center gap-1"
              >
                View All
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {recentLogs.length === 0 ? (
              <div className="bg-[#16162a] rounded-xl border border-gray-800 p-6 text-center">
                <p className="text-gray-400">No recent activity</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentLogs.map((log) => (
                  <div
                    key={log._id}
                    className="bg-[#16162a] rounded-xl border border-gray-800 p-4 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          log.status === 'success'
                            ? 'bg-green-500'
                            : log.status === 'failed'
                            ? 'bg-red-500'
                            : 'bg-yellow-500 animate-pulse'
                        }`}
                      />
                      <div>
                        <p className="text-sm font-medium capitalize">{log.status}</p>
                        <p className="text-xs text-gray-500">
                          {log.actionsExecuted.length} actions • {new Date(log.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <Link
                      href={`/logs/${log._id}`}
                      className="text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      View Details
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer Attribution */}
      <footer className="fixed bottom-4 left-1/2 -translate-x-1/2 z-10">
        <Attribution />
      </footer>
    </div>
  )
}
