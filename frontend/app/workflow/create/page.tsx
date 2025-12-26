'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { workflowApi } from '@/lib/api'
import WorkflowBuilder from '@/components/WorkflowBuilder'
import ActionConfigSidebar from '@/components/ActionConfigSidebar'

interface WorkflowAction {
  id: string
  type: 'generate_mom' | 'send_email' | 'create_calendar' | 'teams_post'
  label: string
  description: string
  icon: React.ReactNode
  config: any
}

export default function CreateWorkflowPage() {
  const router = useRouter()
  const [workflowName, setWorkflowName] = useState('')
  const [actions, setActions] = useState<WorkflowAction[]>([])
  const [editingAction, setEditingAction] = useState<{ type: WorkflowAction['type']; config: any } | null>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleActionConfigChange = (id: string, config: any) => {
    setActions(actions.map(a => a.id === id ? { ...a, config } : a))
  }

  const handleEditAction = (action: WorkflowAction) => {
    setEditingAction({ type: action.type, config: action.config })
    setIsSidebarOpen(true)
  }

  const handleSaveConfig = (config: any) => {
    if (editingAction) {
      const action = actions.find(a => a.type === editingAction.type)
      if (action) {
        handleActionConfigChange(action.id, config)
      }
    }
    setEditingAction(null)
    setIsSidebarOpen(false)
  }

  const handleSave = async () => {
    setError(null)

    if (!workflowName.trim()) {
      setError('Workflow name is required')
      return
    }

    if (actions.length === 0) {
      setError('Please add at least one action')
      return
    }

    setLoading(true)

    try {
      await workflowApi.create({
        name: workflowName.trim(),
        actions: actions.map(a => a.type),
        actionConfigs: actions.reduce((acc, a) => {
          acc[a.type] = a.config
          return acc
        }, {} as Record<string, any>),
      })
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create workflow')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {error && (
        <div className="bg-red-50 border-b border-red-200 p-4">
          <div className="max-w-7xl mx-auto text-red-800 text-sm">{error}</div>
        </div>
      )}

      <WorkflowBuilder
        workflowName={workflowName}
        onNameChange={setWorkflowName}
        actions={actions}
        onActionsChange={setActions}
        onActionConfigChange={handleActionConfigChange}
        onSave={handleSave}
        onCancel={() => router.push('/dashboard')}
        onEditAction={handleEditAction}
      />

      <ActionConfigSidebar
        isOpen={isSidebarOpen}
        onClose={() => {
          setIsSidebarOpen(false)
          setEditingAction(null)
        }}
        action={editingAction}
        onSave={handleSaveConfig}
      />
    </div>
  )
}
