'use client'

import React, { memo } from 'react'
import { Handle, Position, NodeProps } from 'reactflow'
import {
  FileText,
  Mail,
  Calendar,
  MessageSquare,
  Presentation,
  Database,
  Zap,
  Globe,
  Bot,
  Clock,
} from 'lucide-react'

const iconMap: Record<string, React.ReactNode> = {
  generate_mom: <FileText className="w-5 h-5" />,
  send_email: <Mail className="w-5 h-5" />,
  create_calendar: <Calendar className="w-5 h-5" />,
  teams_post: <MessageSquare className="w-5 h-5" />,
  create_ppt: <Presentation className="w-5 h-5" />,
  save_data: <Database className="w-5 h-5" />,
  api_call: <Globe className="w-5 h-5" />,
  ai_process: <Bot className="w-5 h-5" />,
  delay: <Clock className="w-5 h-5" />,
  default: <Zap className="w-5 h-5" />,
}

const colorMap: Record<string, string> = {
  generate_mom: 'from-purple-500 to-purple-600',
  send_email: 'from-green-500 to-green-600',
  create_calendar: 'from-blue-500 to-blue-600',
  teams_post: 'from-indigo-500 to-indigo-600',
  create_ppt: 'from-orange-500 to-orange-600',
  save_data: 'from-cyan-500 to-cyan-600',
  api_call: 'from-pink-500 to-pink-600',
  ai_process: 'from-violet-500 to-violet-600',
  delay: 'from-gray-500 to-gray-600',
  default: 'from-gray-500 to-gray-600',
}

interface ActionNodeData {
  label: string
  actionType: string
  icon: string
  description: string
  config: any
}

export const ActionNode = memo(({ data, selected }: NodeProps<ActionNodeData>) => {
  const icon = iconMap[data.actionType] || iconMap.default
  const gradient = colorMap[data.actionType] || colorMap.default

  return (
    <div
      className={`relative bg-[#2a2a4a] rounded-xl border-2 ${
        selected ? 'border-orange-500 shadow-lg shadow-orange-500/20' : 'border-gray-700'
      } min-w-[180px] transition-all duration-200 hover:border-gray-600`}
    >
      {/* Input Handle */}
      <Handle
        type="target"
        position={Position.Left}
        className="!w-3 !h-3 !bg-gray-600 !border-2 !border-gray-500 hover:!bg-orange-500 hover:!border-orange-400 transition-colors"
      />

      {/* Content */}
      <div className="p-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center text-white shadow-lg`}>
            {icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-white text-sm truncate">{data.label}</div>
            <div className="text-xs text-gray-400 truncate">{data.description}</div>
          </div>
        </div>
      </div>

      {/* Output Handle */}
      <Handle
        type="source"
        position={Position.Right}
        className="!w-3 !h-3 !bg-gray-600 !border-2 !border-gray-500 hover:!bg-orange-500 hover:!border-orange-400 transition-colors"
      />

      {/* Plus button for adding next node */}
      <div className="absolute -right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button className="w-5 h-5 rounded-full bg-gray-700 border border-gray-600 flex items-center justify-center text-gray-400 hover:bg-orange-500 hover:border-orange-400 hover:text-white transition-colors">
          <span className="text-xs">+</span>
        </button>
      </div>
    </div>
  )
})

ActionNode.displayName = 'ActionNode'

