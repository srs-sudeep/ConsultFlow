'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { logsApi } from '@/lib/api'
import { FileText, Clock, LayoutDashboard, Plus, CheckCircle, XCircle, Loader2 } from 'lucide-react'
import Logo, { LoadingLogo, Attribution } from '@/components/Logo'

interface Log {
  _id: string
  workflowId: {
    _id: string
    name: string
  }
  status: 'success' | 'failed' | 'running'
  actionsExecuted: string[]
  error?: string
  createdAt: string
}

export default function LogsPage() {
  const router = useRouter()
  const [logs, setLogs] = useState<Log[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadLogs()
  }, [])

  const loadLogs = async () => {
    try {
      const res = await logsApi.getAll({ limit: 50 })
      // API returns { logs, total, limit, skip }
      setLogs(res.data.logs || [])
    } catch (error: any) {
      if (error.response?.status === 401) {
        router.push('/login')
      }
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />
      case 'running':
        return <Loader2 className="w-5 h-5 text-yellow-500 animate-spin" />
      default:
        return null
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-500/10 text-green-400 border-green-500/20'
      case 'failed':
        return 'bg-red-500/10 text-red-400 border-red-500/20'
      case 'running':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/20'
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a1a]">
        <LoadingLogo message="Loading logs..." />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a1a] text-white flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#16162a] border-r border-gray-800 flex flex-col animate-[slideIn_0.5s_ease-out]">
        <div className="p-5 border-b border-gray-800">
          <Link href="/">
            <Logo size="md" />
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-800/50 hover:text-white transition-colors"
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
            className="flex items-center gap-3 px-4 py-3 rounded-lg bg-gray-800/50 text-white"
          >
            <Clock className="w-5 h-5" />
            Execution Logs
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Execution Logs</h1>
            <p className="text-gray-400">View your workflow execution history</p>
          </div>

          {logs.length === 0 ? (
            <div className="bg-[#16162a] rounded-xl border border-gray-800 p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-gray-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No execution logs yet</h3>
              <p className="text-gray-400 mb-4">Run a workflow to see execution logs here</p>
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
              {logs.map((log) => (
                <div
                  key={log._id}
                  className="bg-[#16162a] rounded-xl border border-gray-800 p-6 hover:border-gray-700 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      {getStatusIcon(log.status)}
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold">
                            {typeof log.workflowId === 'object' ? log.workflowId.name : 'Unknown Workflow'}
                          </h3>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusBadge(log.status)}`}>
                            {log.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-400 mb-2">
                          {log.actionsExecuted.length} action(s) executed
                        </p>
                        {log.error && (
                          <p className="text-sm text-red-400 bg-red-500/10 px-3 py-2 rounded-lg">
                            {log.error}
                          </p>
                        )}
                        {log.actionsExecuted.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-3">
                            {log.actionsExecuted.map((action, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 bg-gray-800 rounded text-xs text-gray-300"
                              >
                                {action.replace(/_/g, ' ')}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-400">
                        {new Date(log.createdAt).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(log.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Footer Attribution */}
      <footer className="fixed bottom-4 left-1/2 -translate-x-1/2 z-10">
        <Attribution />
      </footer>
    </div>
  )
}
