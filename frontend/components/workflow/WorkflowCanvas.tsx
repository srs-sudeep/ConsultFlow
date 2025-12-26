'use client'

import React, { useCallback, useState, useMemo } from 'react'
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  BackgroundVariant,
  Panel,
  MarkerType,
  NodeTypes,
  ReactFlowProvider,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { ActionNode } from './nodes/ActionNode'
import { TriggerNode } from './nodes/TriggerNode'
import { ActionSidebar } from './ActionSidebar'
import Logo, { Attribution } from '@/components/Logo'

export interface WorkflowNode {
  id: string
  type: string
  position: { x: number; y: number }
  data: {
    label: string
    actionType: string
    icon: string
    description: string
    config: any
  }
}

export interface WorkflowEdge {
  id: string
  source: string
  target: string
  sourceHandle?: string
  targetHandle?: string
}

interface WorkflowCanvasProps {
  workflowName: string
  onNameChange: (name: string) => void
  initialNodes?: Node[]
  initialEdges?: Edge[]
  onSave: (nodes: Node[], edges: Edge[]) => void
  onCancel: () => void
}

const nodeTypes: NodeTypes = {
  trigger: TriggerNode,
  action: ActionNode,
}

const defaultEdgeOptions = {
  animated: true,
  style: { stroke: '#6366f1', strokeWidth: 2 },
  markerEnd: {
    type: MarkerType.ArrowClosed,
    color: '#6366f1',
  },
}

export default function WorkflowCanvas({
  workflowName,
  onNameChange,
  initialNodes = [],
  initialEdges = [],
  onSave,
  onCancel,
}: WorkflowCanvasProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) => addEdge({ ...params, ...defaultEdgeOptions }, eds))
    },
    [setEdges]
  )

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node)
    setIsSidebarOpen(true)
  }, [])

  const addNode = useCallback(
    (actionType: string, label: string, icon: string, description: string) => {
      const newNode: Node = {
        id: `node-${Date.now()}`,
        type: actionType === 'trigger' ? 'trigger' : 'action',
        position: {
          x: Math.random() * 400 + 100,
          y: Math.random() * 300 + 100,
        },
        data: {
          label,
          actionType,
          icon,
          description,
          config: {},
        },
      }
      setNodes((nds) => [...nds, newNode])
    },
    [setNodes]
  )

  const updateNodeConfig = useCallback(
    (nodeId: string, config: any) => {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === nodeId
            ? { ...node, data: { ...node.data, config } }
            : node
        )
      )
    },
    [setNodes]
  )

  const deleteNode = useCallback(
    (nodeId: string) => {
      setNodes((nds) => nds.filter((node) => node.id !== nodeId))
      setEdges((eds) =>
        eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId)
      )
      setSelectedNode(null)
      setIsSidebarOpen(false)
    },
    [setNodes, setEdges]
  )

  const handleSave = () => {
    onSave(nodes, edges)
  }

  return (
    <div className="h-screen w-full flex flex-col bg-[#1a1a2e]">
      {/* Header */}
      <header className="bg-[#16162a] border-b border-gray-800 px-6 py-4 z-10 animate-[slideIn_0.5s_ease-out]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Logo size="sm" showText={false} />
            <input
              type="text"
              value={workflowName}
              onChange={(e) => onNameChange(e.target.value)}
              placeholder="Untitled Workflow"
              className="text-xl font-semibold text-white bg-transparent border-none outline-none placeholder:text-gray-500"
            />
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onCancel}
              className="px-4 py-2 rounded-lg bg-gray-800 text-gray-300 font-medium hover:bg-gray-700 transition-all hover:scale-105"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!workflowName.trim() || nodes.length === 0}
              className="relative px-6 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-pink-500 text-white font-medium hover:from-orange-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:scale-105 hover:shadow-orange-500/25 overflow-hidden group"
            >
              {/* Shimmer effect */}
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_2s_infinite] transform -skew-x-12 opacity-0 group-hover:opacity-100" />
              <span className="relative z-10">Save Workflow</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Canvas */}
        <div className="flex-1 relative">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            nodeTypes={nodeTypes}
            defaultEdgeOptions={defaultEdgeOptions}
            fitView
            snapToGrid
            snapGrid={[20, 20]}
            className="bg-[#1a1a2e]"
          >
            <Background
              variant={BackgroundVariant.Dots}
              gap={20}
              size={1}
              color="#333355"
            />
            <Controls
              className="!bg-[#16162a] !border-gray-700 !rounded-lg !shadow-xl"
              showInteractive={false}
            />
            <Panel position="bottom-left" className="!bg-transparent">
              <div className="text-xs text-gray-500 animate-[fadeIn_1s_ease-out]">
                Drag to connect • Click to configure • Right-click to delete
              </div>
            </Panel>
            <Panel position="bottom-center" className="!bg-transparent">
              <Attribution />
            </Panel>
          </ReactFlow>
        </div>

        {/* Sidebar - Available Actions */}
        <ActionSidebar
          onAddNode={addNode}
          selectedNode={selectedNode}
          isConfigOpen={isSidebarOpen}
          onCloseConfig={() => {
            setIsSidebarOpen(false)
            setSelectedNode(null)
          }}
          onUpdateConfig={updateNodeConfig}
          onDeleteNode={deleteNode}
        />
      </div>
    </div>
  )
}

export function WorkflowCanvasWrapper(props: WorkflowCanvasProps) {
  return (
    <ReactFlowProvider>
      <WorkflowCanvas {...props} />
    </ReactFlowProvider>
  )
}

