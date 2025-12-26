'use client'

import React, { useState } from 'react'
import { Node } from 'reactflow'
import { X, Search, Play, FileText, Mail, Calendar, MessageSquare, Presentation, Clock, Webhook, FileInput, Bot, Database, Globe, ChevronRight, Trash2 } from 'lucide-react'

interface ActionCategory {
  name: string
  icon: React.ReactNode
  actions: ActionItem[]
}

interface ActionItem {
  type: string
  label: string
  description: string
  icon: React.ReactNode
  nodeType: 'trigger' | 'action'
}

const actionCategories: ActionCategory[] = [
  {
    name: 'Triggers',
    icon: <Play className="w-4 h-4" />,
    actions: [
      {
        type: 'manual',
        label: 'Manual Trigger',
        description: 'Start workflow manually',
        icon: <Play className="w-5 h-5" />,
        nodeType: 'trigger',
      },
      {
        type: 'transcript',
        label: 'Transcript Input',
        description: 'Start with meeting transcript',
        icon: <FileInput className="w-5 h-5" />,
        nodeType: 'trigger',
      },
      {
        type: 'schedule',
        label: 'Schedule Trigger',
        description: 'Run on a schedule',
        icon: <Clock className="w-5 h-5" />,
        nodeType: 'trigger',
      },
      {
        type: 'webhook',
        label: 'Webhook Trigger',
        description: 'Triggered via HTTP request',
        icon: <Webhook className="w-5 h-5" />,
        nodeType: 'trigger',
      },
    ],
  },
  {
    name: 'AI & Processing',
    icon: <Bot className="w-4 h-4" />,
    actions: [
      {
        type: 'generate_mom',
        label: 'Generate MOM',
        description: 'AI-powered meeting minutes',
        icon: <FileText className="w-5 h-5" />,
        nodeType: 'action',
      },
      {
        type: 'create_ppt',
        label: 'Create Presentation',
        description: 'Generate PowerPoint slides',
        icon: <Presentation className="w-5 h-5" />,
        nodeType: 'action',
      },
      {
        type: 'ai_process',
        label: 'AI Process',
        description: 'Custom AI processing',
        icon: <Bot className="w-5 h-5" />,
        nodeType: 'action',
      },
    ],
  },
  {
    name: 'Communication',
    icon: <Mail className="w-4 h-4" />,
    actions: [
      {
        type: 'send_email',
        label: 'Send Email',
        description: 'Send via Outlook',
        icon: <Mail className="w-5 h-5" />,
        nodeType: 'action',
      },
      {
        type: 'teams_post',
        label: 'Teams Message',
        description: 'Post to MS Teams',
        icon: <MessageSquare className="w-5 h-5" />,
        nodeType: 'action',
      },
      {
        type: 'create_calendar',
        label: 'Calendar Event',
        description: 'Create Outlook event',
        icon: <Calendar className="w-5 h-5" />,
        nodeType: 'action',
      },
    ],
  },
  {
    name: 'Data & Storage',
    icon: <Database className="w-4 h-4" />,
    actions: [
      {
        type: 'save_data',
        label: 'Save Data',
        description: 'Store data to database',
        icon: <Database className="w-5 h-5" />,
        nodeType: 'action',
      },
      {
        type: 'api_call',
        label: 'HTTP Request',
        description: 'Make API calls',
        icon: <Globe className="w-5 h-5" />,
        nodeType: 'action',
      },
    ],
  },
]

interface ActionSidebarProps {
  onAddNode: (actionType: string, label: string, icon: string, description: string) => void
  selectedNode: Node | null
  isConfigOpen: boolean
  onCloseConfig: () => void
  onUpdateConfig: (nodeId: string, config: any) => void
  onDeleteNode: (nodeId: string) => void
}

export function ActionSidebar({
  onAddNode,
  selectedNode,
  isConfigOpen,
  onCloseConfig,
  onUpdateConfig,
  onDeleteNode,
}: ActionSidebarProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['Triggers', 'AI & Processing', 'Communication'])

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    )
  }

  const filteredCategories = actionCategories.map((category) => ({
    ...category,
    actions: category.actions.filter(
      (action) =>
        action.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        action.description.toLowerCase().includes(searchTerm.toLowerCase())
    ),
  })).filter((category) => category.actions.length > 0)

  // Show config panel if a node is selected
  if (isConfigOpen && selectedNode) {
    return (
      <div className="w-80 bg-[#16162a] border-l border-gray-800 flex flex-col">
        <div className="p-4 border-b border-gray-800 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Configure Node</h2>
          <button
            onClick={onCloseConfig}
            className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Node Type</label>
              <div className="px-3 py-2 bg-gray-800 rounded-lg text-white text-sm">
                {selectedNode.data.label}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Description</label>
              <div className="px-3 py-2 bg-gray-800 rounded-lg text-gray-300 text-sm">
                {selectedNode.data.description}
              </div>
            </div>
            {/* Add more config fields based on node type */}
            <NodeConfigFields
              nodeType={selectedNode.data.actionType}
              config={selectedNode.data.config}
              onConfigChange={(config) => onUpdateConfig(selectedNode.id, config)}
            />
          </div>
        </div>
        <div className="p-4 border-t border-gray-800">
          <button
            onClick={() => onDeleteNode(selectedNode.id)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 text-red-500 font-medium hover:bg-red-500/20 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Delete Node
          </button>
        </div>
      </div>
    )
  }

  // Show action picker
  return (
    <div className="w-80 bg-[#16162a] border-l border-gray-800 flex flex-col">
      <div className="p-4 border-b border-gray-800">
        <h2 className="text-lg font-semibold text-white mb-4">Add Node</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search actions..."
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm placeholder:text-gray-500 focus:outline-none focus:border-orange-500"
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {filteredCategories.map((category) => (
            <div key={category.name}>
              <button
                onClick={() => toggleCategory(category.name)}
                className="w-full flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-white transition-colors mb-2"
              >
                <ChevronRight
                  className={`w-4 h-4 transition-transform ${
                    expandedCategories.includes(category.name) ? 'rotate-90' : ''
                  }`}
                />
                {category.icon}
                {category.name}
              </button>
              {expandedCategories.includes(category.name) && (
                <div className="space-y-2 ml-6">
                  {category.actions.map((action) => (
                    <button
                      key={action.type}
                      onClick={() => onAddNode(action.type, action.label, action.type, action.description)}
                      className="w-full flex items-center gap-3 p-3 bg-[#2a2a4a] rounded-lg border border-gray-700 hover:border-orange-500/50 hover:bg-[#2a2a5a] transition-all group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center text-gray-400 group-hover:text-orange-500 transition-colors">
                        {action.icon}
                      </div>
                      <div className="flex-1 text-left">
                        <div className="text-sm font-medium text-white">{action.label}</div>
                        <div className="text-xs text-gray-500">{action.description}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Dynamic config fields based on node type
function NodeConfigFields({
  nodeType,
  config,
  onConfigChange,
}: {
  nodeType: string
  config: any
  onConfigChange: (config: any) => void
}) {
  const updateField = (field: string, value: any) => {
    onConfigChange({ ...config, [field]: value })
  }

  switch (nodeType) {
    case 'send_email':
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">To (Email)</label>
            <input
              type="text"
              value={config.to || ''}
              onChange={(e) => updateField('to', e.target.value)}
              placeholder="recipient@example.com"
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm placeholder:text-gray-500 focus:outline-none focus:border-orange-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Subject</label>
            <input
              type="text"
              value={config.subject || ''}
              onChange={(e) => updateField('subject', e.target.value)}
              placeholder="Email subject"
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm placeholder:text-gray-500 focus:outline-none focus:border-orange-500"
            />
          </div>
        </div>
      )

    case 'create_calendar':
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Event Title</label>
            <input
              type="text"
              value={config.title || ''}
              onChange={(e) => updateField('title', e.target.value)}
              placeholder="Meeting title"
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm placeholder:text-gray-500 focus:outline-none focus:border-orange-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Start Time</label>
            <input
              type="datetime-local"
              value={config.start || ''}
              onChange={(e) => updateField('start', e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-orange-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">End Time</label>
            <input
              type="datetime-local"
              value={config.end || ''}
              onChange={(e) => updateField('end', e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-orange-500"
            />
          </div>
        </div>
      )

    case 'teams_post':
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Team ID</label>
            <input
              type="text"
              value={config.teamId || ''}
              onChange={(e) => updateField('teamId', e.target.value)}
              placeholder="Teams team ID"
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm placeholder:text-gray-500 focus:outline-none focus:border-orange-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Channel ID</label>
            <input
              type="text"
              value={config.channelId || ''}
              onChange={(e) => updateField('channelId', e.target.value)}
              placeholder="Teams channel ID"
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm placeholder:text-gray-500 focus:outline-none focus:border-orange-500"
            />
          </div>
        </div>
      )

    case 'create_ppt':
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Template</label>
            <select
              value={config.template || 'default'}
              onChange={(e) => updateField('template', e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-orange-500"
            >
              <option value="default">Default Template</option>
              <option value="executive">Executive Summary</option>
              <option value="technical">Technical Report</option>
              <option value="meeting">Meeting Recap</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Max Slides</label>
            <input
              type="number"
              value={config.maxSlides || 10}
              onChange={(e) => updateField('maxSlides', parseInt(e.target.value))}
              min={1}
              max={50}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-orange-500"
            />
          </div>
        </div>
      )

    case 'transcript':
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Input Source</label>
            <select
              value={config.source || 'manual'}
              onChange={(e) => updateField('source', e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-orange-500"
            >
              <option value="manual">Manual Input</option>
              <option value="teams">MS Teams Recording</option>
              <option value="upload">File Upload</option>
            </select>
          </div>
        </div>
      )

    default:
      return (
        <div className="text-sm text-gray-500">
          No configuration options for this node type.
        </div>
      )
  }
}

