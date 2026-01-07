'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Node, Edge } from 'reactflow'
import { workflowApi } from '@/lib/api'
import { WorkflowCanvasWrapper } from '@/components/workflow/WorkflowCanvas'

export default function CreateWorkflowPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [workflowName, setWorkflowName] = useState('')

  const handleSave = async (nodes: Node[], edges: Edge[]) => {
    setError(null)

    if (!workflowName.trim()) {
      setError('Workflow name is required')
      return
    }

    if (nodes.length === 0) {
      setError('Please add at least one node')
      return
    }

    try {
      // Find trigger node (should be only one)
      const triggerNode = nodes.find((node) => node.type === 'trigger')
      const trigger = triggerNode?.data.actionType || 'manual'

      // Convert action nodes to actions format for backend
      const actions = nodes
        .filter((node) => node.type === 'action')
        .map((node) => node.data.actionType)

      if (actions.length === 0) {
        setError('Please add at least one action node')
        return
      }

      // Extract configs (only for action nodes)
      const actionConfigs = nodes
        .filter((node) => node.type === 'action')
        .reduce((acc, node) => {
          if (node.data.config && Object.keys(node.data.config).length > 0) {
            acc[node.data.actionType] = node.data.config
          }
          return acc
        }, {} as Record<string, any>)

      // Save workflow with full node/edge data for canvas
      await workflowApi.create({
        name: workflowName.trim(),
        trigger,
        actions,
        actionConfigs,
        // Extended data for canvas
        canvasData: {
          nodes: nodes.map((n) => ({
            id: n.id,
            type: n.type,
            position: n.position,
            data: n.data,
          })),
          edges: edges.map((e) => ({
            id: e.id,
            source: e.source,
            target: e.target,
            sourceHandle: e.sourceHandle,
            targetHandle: e.targetHandle,
          })),
        },
      })

      router.push('/dashboard')
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create workflow')
    }
  }

  return (
    <div className="h-screen flex flex-col">
      {error && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-50 bg-red-500/90 backdrop-blur-sm text-white px-6 py-3 rounded-lg shadow-xl">
          {error}
        </div>
      )}

      <WorkflowCanvasWrapper
        workflowName={workflowName}
        onNameChange={setWorkflowName}
        onSave={handleSave}
        onCancel={() => router.push('/dashboard')}
      />
    </div>
  )
}
