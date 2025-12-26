'use client'

import React, { memo } from 'react'
import { Handle, Position, NodeProps } from 'reactflow'
import { Play, Clock, Webhook, FileInput, Zap } from 'lucide-react'

const iconMap: Record<string, React.ReactNode> = {
  manual: <Play className="w-5 h-5" />,
  schedule: <Clock className="w-5 h-5" />,
  webhook: <Webhook className="w-5 h-5" />,
  transcript: <FileInput className="w-5 h-5" />,
  default: <Zap className="w-5 h-5" />,
}

interface TriggerNodeData {
  label: string
  actionType: string
  icon: string
  description: string
  config: any
}

export const TriggerNode = memo(({ data, selected }: NodeProps<TriggerNodeData>) => {
  const icon = iconMap[data.actionType] || iconMap.default

  return (
    <div
      className={`relative bg-[#2a2a4a] rounded-xl border-2 ${
        selected ? 'border-orange-500 shadow-lg shadow-orange-500/20' : 'border-gray-700'
      } min-w-[180px] transition-all duration-200 hover:border-gray-600`}
    >
      {/* Trigger Badge */}
      <div className="absolute -top-3 left-4">
        <div className="px-2 py-0.5 bg-orange-500 rounded-full text-[10px] font-bold text-white uppercase tracking-wider">
          Trigger
        </div>
      </div>

      {/* Content */}
      <div className="p-4 pt-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center text-white shadow-lg">
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
        className="!w-3 !h-3 !bg-orange-500 !border-2 !border-orange-400 hover:!bg-orange-400 transition-colors"
      />
    </div>
  )
})

TriggerNode.displayName = 'TriggerNode'

