'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

interface ActionConfig {
  type: 'generate_mom' | 'send_email' | 'create_calendar' | 'teams_post'
  config: any
}

interface ActionConfigSidebarProps {
  isOpen: boolean
  onClose: () => void
  action: ActionConfig | null
  onSave: (config: any) => void
  momData?: any // Pre-filled data from MOM
  momContent?: string // Generated MOM content
}

export default function ActionConfigSidebar({
  isOpen,
  onClose,
  action,
  onSave,
  momData,
  momContent,
}: ActionConfigSidebarProps) {
  const [config, setConfig] = useState<any>({})

  useEffect(() => {
    if (action) {
      // Initialize config with defaults or pre-filled data from MOM
      const defaults: any = {
        generate_mom: {},
        send_email: {
          to: momData?.attendees?.map((a: string) => {
            // Try to extract email from attendee name, or create placeholder
            const emailMatch = a.match(/[\w\.-]+@[\w\.-]+\.\w+/)
            return emailMatch ? emailMatch[0] : `${a.split(' ')[0].toLowerCase()}@example.com`
          }).join(', ') || '',
          subject: `Meeting Minutes - ${momData?.meetingTitle || 'Meeting'}`,
          body: '', // Will be auto-filled with MOM if left empty
        },
        create_calendar: {
          title: momData?.nextMeeting?.title || 'Follow-up Meeting',
          start: momData?.nextMeeting?.dateTime || '',
          end: '',
          attendees: momData?.nextMeeting?.attendees || [],
        },
        teams_post: {
          teamId: '',
          channelId: '',
          message: '',
        },
      }

      let initialConfig = { ...defaults[action.type], ...action.config }
      
      // If email body is empty and we have MOM content, use it
      if (action.type === 'send_email' && !initialConfig.body && momContent) {
        initialConfig.body = momContent
      }
      
      setConfig(initialConfig)
    }
  }, [action, momData, momContent])

  if (!isOpen || !action) return null

  const handleSave = () => {
    // If email body is empty and we have MOM, don't save empty string
    // Let the backend use MOM automatically
    const configToSave = { ...config }
    if (action?.type === 'send_email' && !configToSave.body?.trim() && momContent) {
      // Set to empty string so backend knows to use MOM
      configToSave.body = ''
    }
    onSave(configToSave)
    onClose()
  }

  const renderConfigForm = () => {
    switch (action.type) {
      case 'send_email':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                To (Email Addresses)
              </label>
              <textarea
                value={config.to || ''}
                onChange={(e) => setConfig({ ...config, to: e.target.value })}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="recipient1@example.com, recipient2@example.com"
                rows={3}
              />
              <p className="mt-1 text-xs text-gray-500">
                Separate multiple emails with commas. Pre-filled from MOM attendees.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject
              </label>
              <input
                type="text"
                value={config.subject || ''}
                onChange={(e) => setConfig({ ...config, subject: e.target.value })}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Meeting Minutes - [Date]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Body (HTML)
              </label>
              <textarea
                value={config.body || ''}
                onChange={(e) => setConfig({ ...config, body: e.target.value })}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono"
                placeholder="Email body content..."
                rows={8}
              />
              <p className="mt-1 text-xs text-gray-500">
                {momContent 
                  ? 'Leave empty to use generated MOM. HTML supported.' 
                  : 'HTML supported. Generate MOM first to auto-fill this field.'}
              </p>
              {!config.body && momContent && (
                <div className="mt-2 p-2 bg-blue-50 rounded border border-blue-200">
                  <p className="text-xs text-blue-800">
                    💡 <strong>Tip:</strong> Body is empty. The generated MOM will be used automatically when you save.
                  </p>
                </div>
              )}
            </div>

            {momData && (
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-xs font-medium text-blue-900 mb-2">Pre-filled from MOM:</p>
                <ul className="text-xs text-blue-800 space-y-1">
                  <li>• Attendees: {momData.attendees?.join(', ') || 'N/A'}</li>
                  <li>• Meeting Title: {momData.meetingTitle || 'N/A'}</li>
                  <li>• Date: {momData.dateTime || 'N/A'}</li>
                </ul>
              </div>
            )}
          </div>
        )

      case 'create_calendar':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Title
              </label>
              <input
                type="text"
                value={config.title || ''}
                onChange={(e) => setConfig({ ...config, title: e.target.value })}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Team Meeting"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={config.start || ''}
                  onChange={(e) => setConfig({ ...config, start: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={config.end || ''}
                  onChange={(e) => setConfig({ ...config, end: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Attendees (Email addresses)
              </label>
              <textarea
                value={config.attendees?.join(', ') || ''}
                onChange={(e) => setConfig({ ...config, attendees: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="attendee1@example.com, attendee2@example.com"
                rows={3}
              />
            </div>

            {momData?.nextMeeting && (
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-xs font-medium text-blue-900 mb-2">Pre-filled from MOM:</p>
                <ul className="text-xs text-blue-800 space-y-1">
                  <li>• Date: {momData.nextMeeting.dateTime || 'N/A'}</li>
                  <li>• Location: {momData.nextMeeting.location || 'N/A'}</li>
                  <li>• Attendees: {momData.nextMeeting.attendees?.join(', ') || 'N/A'}</li>
                </ul>
              </div>
            )}
          </div>
        )

      case 'teams_post':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Teams Team ID
              </label>
              <input
                type="text"
                value={config.teamId || ''}
                onChange={(e) => setConfig({ ...config, teamId: e.target.value })}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="19:meeting_abc123@thread.skype"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Channel ID
              </label>
              <input
                type="text"
                value={config.channelId || ''}
                onChange={(e) => setConfig({ ...config, channelId: e.target.value })}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="19:channel_123456@thread.skype"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message
              </label>
              <textarea
                value={config.message || ''}
                onChange={(e) => setConfig({ ...config, message: e.target.value })}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Message to post in Teams channel..."
                rows={6}
              />
            </div>
          </div>
        )

      default:
        return <p className="text-gray-500">No configuration needed for this action.</p>
    }
  }

  return (
    <div
      className={`fixed right-0 top-0 h-full w-96 bg-white shadow-2xl transform transition-transform duration-300 z-50 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="border-b border-gray-200 p-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Configure {action?.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {renderConfigForm()}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 rounded-lg bg-gray-200 text-gray-700 font-medium hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2 rounded-lg bg-primary-600 text-white font-medium hover:bg-primary-700 transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}

