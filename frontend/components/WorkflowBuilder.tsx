'use client'

import { useState } from 'react'
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent, DragOverlay, DragStartEvent } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Mail, Calendar, MessageSquare, FileText, GripVertical, X, Settings, Plus } from 'lucide-react'

interface WorkflowAction {
  id: string
  type: 'generate_mom' | 'send_email' | 'create_calendar' | 'teams_post'
  label: string
  description: string
  icon: React.ReactNode
  config: any
}

const AVAILABLE_ACTIONS: Omit<WorkflowAction, 'id' | 'config'>[] = [
  {
    type: 'generate_mom',
    label: 'Generate MOM',
    description: 'Generate structured Meeting Minutes from notes',
    icon: <FileText className="h-5 w-5" />,
  },
  {
    type: 'send_email',
    label: 'Send Email',
    description: 'Send email via Outlook',
    icon: <Mail className="h-5 w-5" />,
  },
  {
    type: 'create_calendar',
    label: 'Create Calendar Event',
    description: 'Create Outlook calendar event',
    icon: <Calendar className="h-5 w-5" />,
  },
  {
    type: 'teams_post',
    label: 'Post Teams Message',
    description: 'Post message to Teams channel',
    icon: <MessageSquare className="h-5 w-5" />,
  },
]

interface SortableItemProps {
  action: WorkflowAction
  index: number
  onEdit: (action: WorkflowAction) => void
  onRemove: (id: string) => void
}

function SortableItem({ action, index, onEdit, onRemove }: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: action.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const actionInfo = AVAILABLE_ACTIONS.find(a => a.type === action.type)!

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative bg-white rounded-xl border-2 border-gray-200 p-5 shadow-sm hover:shadow-lg transition-all duration-200 ${
        isDragging ? 'opacity-50 scale-95' : 'opacity-100'
      }`}
    >
      <div className="flex items-start gap-4">
        {/* Step Number */}
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
          {index + 1}
        </div>

        {/* Drag Handle */}
        <div
          {...attributes}
          {...listeners}
          className="flex-shrink-0 cursor-grab active:cursor-grabbing text-gray-400 hover:text-primary-500 transition-colors mt-1"
        >
          <GripVertical className="h-5 w-5" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center text-primary-600">
              {actionInfo.icon}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 text-base mb-1">{actionInfo.label}</h3>
              <p className="text-sm text-gray-600">{actionInfo.description}</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex-shrink-0 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(action)}
            className="p-2 rounded-lg text-gray-600 hover:bg-primary-50 hover:text-primary-600 transition-colors"
            title="Configure"
          >
            <Settings className="h-4 w-4" />
          </button>
          <button
            onClick={() => onRemove(action.id)}
            className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
            title="Remove"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

interface ActionCardProps {
  action: Omit<WorkflowAction, 'id' | 'config'>
  onClick: () => void
}

function ActionCard({ action, onClick }: ActionCardProps) {
  return (
    <button
      onClick={onClick}
      className="w-full bg-white rounded-xl border-2 border-gray-200 p-4 hover:border-primary-300 hover:shadow-lg transition-all duration-200 text-left group"
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center text-primary-600 group-hover:from-primary-100 group-hover:to-primary-200 transition-colors">
          {action.icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 text-sm mb-1">{action.label}</h3>
          <p className="text-xs text-gray-600 line-clamp-2">{action.description}</p>
        </div>
        <div className="flex-shrink-0">
          <Plus className="h-5 w-5 text-gray-400 group-hover:text-primary-500 transition-colors" />
        </div>
      </div>
    </button>
  )
}

interface WorkflowBuilderProps {
  workflowName: string
  onNameChange: (name: string) => void
  actions: WorkflowAction[]
  onActionsChange: (actions: WorkflowAction[]) => void
  onActionConfigChange: (id: string, config: any) => void
  onSave: () => void
  onCancel: () => void
}

export default function WorkflowBuilder({
  workflowName,
  onNameChange,
  actions,
  onActionsChange,
  onActionConfigChange,
  onSave,
  onCancel,
  onEditAction,
}: WorkflowBuilderProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const [activeId, setActiveId] = useState<string | null>(null)
  const [draggedAction, setDraggedAction] = useState<WorkflowAction | null>(null)

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
    const action = actions.find(a => a.id === event.active.id)
    setDraggedAction(action || null)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = actions.findIndex(a => a.id === active.id)
      const newIndex = actions.findIndex(a => a.id === over.id)
      onActionsChange(arrayMove(actions, oldIndex, newIndex))
    }

    setActiveId(null)
    setDraggedAction(null)
  }

  const addAction = (type: WorkflowAction['type']) => {
    const newAction: WorkflowAction = {
      id: `action-${Date.now()}-${Math.random()}`,
      type,
      label: AVAILABLE_ACTIONS.find(a => a.type === type)!.label,
      description: AVAILABLE_ACTIONS.find(a => a.type === type)!.description,
      icon: AVAILABLE_ACTIONS.find(a => a.type === type)!.icon,
      config: {},
    }
    onActionsChange([...actions, newAction])
  }

  const removeAction = (id: string) => {
    onActionsChange(actions.filter(a => a.id !== id))
  }

  const handleEditAction = (action: WorkflowAction) => {
    if (onEditAction) {
      onEditAction(action)
    }
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50 grid-background overflow-hidden">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm z-10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 max-w-2xl">
              <input
                type="text"
                value={workflowName}
                onChange={(e) => onNameChange(e.target.value)}
                placeholder="Enter workflow name..."
                className="text-2xl font-bold text-gray-900 bg-transparent border-none outline-none w-full placeholder:text-gray-400"
              />
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={onCancel}
                className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={onSave}
                disabled={!workflowName.trim() || actions.length === 0}
                className="px-6 py-2 rounded-lg bg-primary-600 text-white font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md"
              >
                Save Workflow
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Canvas Area */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-4xl mx-auto">
            {actions.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center">
                <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                  <Plus className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Start Building Your Workflow</h3>
                <p className="text-gray-600 mb-6">Add actions from the sidebar to get started</p>
              </div>
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
              >
                <SortableContext items={actions.map(a => a.id)} strategy={verticalListSortingStrategy}>
                  <div className="space-y-4">
                    {actions.map((action, index) => (
                      <SortableItem
                        key={action.id}
                        action={action}
                        index={index}
                        onEdit={handleEditAction}
                        onRemove={removeAction}
                      />
                    ))}
                  </div>
                </SortableContext>
                <DragOverlay>
                  {draggedAction && (
                    <div className="bg-white rounded-xl border-2 border-primary-300 p-5 shadow-2xl opacity-95">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-bold text-sm">
                          {actions.findIndex(a => a.id === draggedAction.id) + 1}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center text-primary-600">
                              {AVAILABLE_ACTIONS.find(a => a.type === draggedAction.type)!.icon}
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900 text-base mb-1">{draggedAction.label}</h3>
                              <p className="text-sm text-gray-600">{draggedAction.description}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </DragOverlay>
              </DndContext>
            )}
          </div>
        </div>

        {/* Sidebar - Available Actions */}
        <div className="w-80 bg-white border-l border-gray-200 shadow-lg overflow-y-auto">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Available Actions</h2>
            <div className="space-y-3">
              {AVAILABLE_ACTIONS.map((action) => (
                <ActionCard
                  key={action.type}
                  action={action}
                  onClick={() => addAction(action.type)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
