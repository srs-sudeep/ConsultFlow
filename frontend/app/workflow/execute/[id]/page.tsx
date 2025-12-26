'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { workflowApi, momApi } from '@/lib/api'
import { 
  Zap, FileText, Clock, LayoutDashboard, Plus, Play, CheckCircle, XCircle, 
  ArrowLeft, Edit2, Mail, Calendar, MessageSquare, Sparkles, ChevronRight,
  Copy, Check, Eye, EyeOff
} from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import Logo, { LoadingLogo, Attribution } from '@/components/Logo'

interface Workflow {
  _id: string
  name: string
  actions: string[]
  actionConfigs?: Record<string, any>
  canvasData?: any
  createdAt: string
}

export default function ExecuteWorkflowPage() {
  const router = useRouter()
  const params = useParams()
  const workflowId = params.id as string

  const [workflow, setWorkflow] = useState<Workflow | null>(null)
  const [loading, setLoading] = useState(true)
  const [executing, setExecuting] = useState(false)
  const [executionResult, setExecutionResult] = useState<any>(null)
  const [momContent, setMomContent] = useState<string | null>(null)
  const [momStructured, setMomStructured] = useState<any>(null)
  const [activeStep, setActiveStep] = useState(0)
  const [showPreview, setShowPreview] = useState(true)
  const [copied, setCopied] = useState(false)
  const [executionData, setExecutionData] = useState<any>({
    meetingNotes: '',
    emailTo: '',
    emailSubject: '',
    emailBody: '',
    calendarTitle: '',
    calendarStart: '',
    calendarEnd: '',
    calendarAttendees: [],
    teamsTeamId: '',
    teamsChannelId: '',
    teamsMessage: '',
  })

  useEffect(() => {
    loadWorkflow()
  }, [workflowId])

  const loadWorkflow = async () => {
    try {
      const res = await workflowApi.getOne(workflowId)
      setWorkflow(res.data)
      
      if (res.data.actionConfigs) {
        setExecutionData((prev: any) => ({ ...prev, ...res.data.actionConfigs }))
      }
    } catch (error: any) {
      if (error.response?.status === 404) {
        router.push('/dashboard')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateMOM = async () => {
    if (!executionData.meetingNotes?.trim()) {
      alert('Please enter meeting notes first')
      return
    }

    try {
      const res = await momApi.generate(executionData.meetingNotes)
      setMomContent(res.data.mom)
      setMomStructured(res.data.structured)
      
      if (res.data.structured) {
        const structured = res.data.structured
        setExecutionData((prev: any) => ({
          ...prev,
          emailTo: structured.attendees?.map((a: string) => {
            const emailMatch = a.match(/[\w\.-]+@[\w\.-]+\.\w+/)
            return emailMatch ? emailMatch[0] : `${a.split(' ')[0].toLowerCase()}@example.com`
          }).join(', ') || prev.emailTo,
          emailSubject: `Meeting Minutes - ${structured.meetingTitle || 'Meeting'}`,
          emailBody: res.data.mom,
          calendarTitle: structured.nextMeeting?.title || 'Follow-up Meeting',
          calendarStart: structured.nextMeeting?.dateTime || '',
          calendarAttendees: structured.nextMeeting?.attendees || structured.attendees || [],
        }))
      }
      
      // Auto-advance to next step if available
      const currentIndex = getActionIndex('generate_mom')
      if (currentIndex >= 0 && currentIndex < workflow.actions.length - 1) {
        setActiveStep(currentIndex + 1)
      }
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to generate MOM')
    }
  }

  const handleExecute = async () => {
    setExecuting(true)
    setExecutionResult(null)

    try {
      const res = await workflowApi.run(workflowId, {
        momContent: executionData.meetingNotes,
        emailTo: executionData.emailTo,
        emailSubject: executionData.emailSubject,
        emailBody: executionData.emailBody?.trim() || undefined,
        calendarTitle: executionData.calendarTitle,
        calendarBody: executionData.calendarBody?.trim() || undefined,
        calendarStart: executionData.calendarStart,
        calendarEnd: executionData.calendarEnd,
        calendarAttendees: executionData.calendarAttendees,
        teamsTeamId: executionData.teamsTeamId,
        teamsChannelId: executionData.teamsChannelId,
        teamsMessage: executionData.teamsMessage?.trim() || undefined,
      })

      setExecutionResult(res.data)
      if (res.data.success) {
        setTimeout(() => {
          router.push('/dashboard')
        }, 2000)
      }
    } catch (error: any) {
      setExecutionResult({
        success: false,
        error: error.response?.data?.error || 'Failed to execute workflow',
      })
    } finally {
      setExecuting(false)
    }
  }

  const handleCopy = () => {
    if (momContent) {
      navigator.clipboard.writeText(momContent)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'generate_mom':
        return <FileText className="w-5 h-5" />
      case 'send_email':
        return <Mail className="w-5 h-5" />
      case 'create_calendar':
        return <Calendar className="w-5 h-5" />
      case 'teams_post':
        return <MessageSquare className="w-5 h-5" />
      default:
        return <Sparkles className="w-5 h-5" />
    }
  }

  const getActionColor = (action: string) => {
    switch (action) {
      case 'generate_mom':
        return 'from-purple-500 to-purple-600'
      case 'send_email':
        return 'from-green-500 to-green-600'
      case 'create_calendar':
        return 'from-blue-500 to-blue-600'
      case 'teams_post':
        return 'from-indigo-500 to-indigo-600'
      default:
        return 'from-gray-500 to-gray-600'
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a1a]">
        <LoadingLogo message="Loading workflow..." />
      </div>
    )
  }

  if (!workflow) return null

  const steps = workflow.actions.map((action, index) => ({
    id: index,
    action,
    label: action.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    completed: index < activeStep,
    active: index === activeStep,
    actionIndex: index,
  }))
  
  // Get the action index for the current active step
  const getActionIndex = (actionType: string) => {
    return workflow.actions.indexOf(actionType)
  }

  return (
    <div className="min-h-screen bg-[#0a0a1a] text-white">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-[#16162a] border-r border-gray-800 flex flex-col z-20">
        <div className="p-5 border-b border-gray-800">
          <Link href="/">
            <Logo size="md" />
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
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
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-800/50 hover:text-white transition-colors"
          >
            <Clock className="w-5 h-5" />
            Execution Logs
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="ml-64">
        {/* Header */}
        <div className="bg-[#16162a] border-b border-gray-800 px-8 py-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">{workflow.name}</h1>
              <p className="text-gray-400">{workflow.actions.length} action(s) • Ready to execute</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="px-4 py-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors flex items-center gap-2"
              >
                {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                {showPreview ? 'Hide Preview' : 'Show Preview'}
              </button>
            </div>
          </div>
        </div>

        {/* Progress Steps with Flowing Animation */}
        <div className="bg-[#16162a] border-b border-gray-800 px-8 py-4 relative overflow-hidden">
          {/* Animated background gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-500/5 to-transparent animate-pulse" />
          
          <div className="relative flex items-center gap-2">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveStep(index)}
                    className={`relative flex items-center gap-3 px-5 py-3 rounded-xl transition-all duration-300 transform ${
                      step.active
                        ? 'bg-orange-500/20 text-orange-400 border-2 border-orange-500/50 scale-105 shadow-lg shadow-orange-500/20'
                        : step.completed
                        ? 'bg-green-500/10 text-green-400 border border-green-500/30 hover:scale-102'
                        : 'bg-gray-800 text-gray-500 border border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    {/* Flowing light effect on active step */}
                    {step.active && (
                      <div className="absolute inset-0 rounded-xl overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-400/30 to-transparent animate-[shimmer_2s_infinite] transform -skew-x-12" />
                      </div>
                    )}
                    
                    <div className={`relative z-10 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                      step.active
                        ? 'bg-orange-500 shadow-lg shadow-orange-500/50'
                        : step.completed
                        ? 'bg-green-500'
                        : 'bg-gray-700'
                    }`}>
                      {step.completed ? (
                        <CheckCircle className="w-5 h-5 text-white animate-[scaleIn_0.3s_ease-out]" />
                      ) : (
                        <span className={`text-sm font-bold text-white ${step.active ? 'animate-pulse' : ''}`}>
                          {index + 1}
                        </span>
                      )}
                    </div>
                    <span className={`relative z-10 text-sm font-semibold transition-all duration-300 ${
                      step.active ? 'text-orange-400' : step.completed ? 'text-green-400' : 'text-gray-500'
                    }`}>
                      {step.label}
                    </span>
                  </button>
                </div>
                
                {/* Animated connecting line */}
                {index < steps.length - 1 && (
                  <div className="relative w-12 h-1 mx-2">
                    <div className="absolute inset-0 bg-gray-700 rounded-full" />
                    {/* Progress fill */}
                    <div 
                      className={`absolute inset-y-0 left-0 rounded-full transition-all duration-500 ${
                        step.completed 
                          ? 'bg-gradient-to-r from-green-500 to-green-400 w-full' 
                          : step.active
                          ? 'bg-gradient-to-r from-orange-500 to-orange-400 w-1/2'
                          : 'bg-gray-700 w-0'
                      }`}
                    />
                    {/* Flowing light animation */}
                    {step.completed && (
                      <div className="absolute inset-0 overflow-hidden rounded-full">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-[flow_1.5s_infinite] w-1/3" />
                      </div>
                    )}
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Execution Result */}
        {executionResult && (
          <div className="mx-8 mt-6">
            <div
              className={`rounded-xl p-4 flex items-center gap-3 ${
                executionResult.success
                  ? 'bg-green-500/10 border border-green-500/20'
                  : 'bg-red-500/10 border border-red-500/20'
              }`}
            >
              {executionResult.success ? (
                <CheckCircle className="w-6 h-6 text-green-500" />
              ) : (
                <XCircle className="w-6 h-6 text-red-500" />
              )}
              <div>
                <p className={`font-medium ${executionResult.success ? 'text-green-400' : 'text-red-400'}`}>
                  {executionResult.success ? 'Workflow executed successfully!' : 'Workflow execution failed'}
                </p>
                {executionResult.error && (
                  <p className="text-sm text-red-400 mt-1">{executionResult.error}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="p-6">
          <div className={`grid gap-8 ${showPreview && momContent ? 'lg:grid-cols-2' : 'lg:grid-cols-1'}`}>
            {/* Left Column - Configuration */}
            <div className="space-y-6">
              {/* Step 1: Meeting Notes */}
              {workflow.actions.includes('generate_mom') && (
                <div className={`bg-gradient-to-br from-[#16162a] to-[#1a1a2e] rounded-2xl border border-gray-800 p-6 transition-all duration-500 ${
                  activeStep === getActionIndex('generate_mom')
                    ? 'ring-2 ring-orange-500/50 shadow-lg shadow-orange-500/10 opacity-100 translate-y-0 max-h-[2000px]' 
                    : 'opacity-0 max-h-0 overflow-hidden -translate-y-4 pointer-events-none'
                }`}>
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getActionColor('generate_mom')} flex items-center justify-center text-white shadow-lg`}>
                      {getActionIcon('generate_mom')}
                    </div>
                    <div className="flex-1">
                      <h2 className="text-xl font-bold">Meeting Transcript</h2>
                      <p className="text-sm text-gray-400">Paste your meeting notes or transcript</p>
                    </div>
                    <span className="px-3 py-1 bg-gray-800 rounded-full text-xs text-gray-400">Step 1</span>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Transcript / Notes
                      </label>
                      <textarea
                        value={executionData.meetingNotes || ''}
                        onChange={(e) => setExecutionData({ ...executionData, meetingNotes: e.target.value })}
                        rows={12}
                        className="w-full px-4 py-3 bg-[#0a0a1a] border-2 border-gray-700 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:border-orange-500 resize-none transition-colors"
                        placeholder="Paste your meeting notes or transcript here..."
                      />
                    </div>

                    <button
                      onClick={handleGenerateMOM}
                      disabled={!executionData.meetingNotes?.trim() || !!momContent}
                      className="relative w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold hover:from-purple-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-purple-500/25 overflow-hidden group"
                    >
                      {/* Flowing light effect */}
                      {!momContent && executionData.meetingNotes?.trim() && (
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_2s_infinite] transform -skew-x-12" />
                      )}
                      <span className="relative z-10 flex items-center gap-2">
                        {momContent ? (
                          <>
                            <CheckCircle className="w-5 h-5" />
                            MOM Generated
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-5 h-5" />
                            Generate MOM
                          </>
                        )}
                      </span>
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Email Configuration */}
              {workflow.actions.includes('send_email') && (
                <div className={`bg-gradient-to-br from-[#16162a] to-[#1a1a2e] rounded-2xl border border-gray-800 p-6 transition-all duration-500 ${
                  activeStep === getActionIndex('send_email')
                    ? 'ring-2 ring-orange-500/50 shadow-lg shadow-orange-500/10 opacity-100 translate-y-0 max-h-[2000px]' 
                    : 'opacity-0 max-h-0 overflow-hidden -translate-y-4 pointer-events-none'
                }`}>
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getActionColor('send_email')} flex items-center justify-center text-white shadow-lg`}>
                      {getActionIcon('send_email')}
                    </div>
                    <div className="flex-1">
                      <h2 className="text-xl font-bold">Email Configuration</h2>
                      <p className="text-sm text-gray-400">Configure email recipients and content</p>
                    </div>
                    <span className="px-3 py-1 bg-gray-800 rounded-full text-xs text-gray-400">
                      Step {workflow.actions.indexOf('send_email') + 1}
                    </span>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Recipients <span className="text-orange-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={executionData.emailTo || ''}
                        onChange={(e) => setExecutionData({ ...executionData, emailTo: e.target.value })}
                        className="w-full px-4 py-3 bg-[#0a0a1a] border-2 border-gray-700 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:border-green-500 transition-colors"
                        placeholder="recipient1@example.com, recipient2@example.com"
                      />
                      <p className="mt-1 text-xs text-gray-500">Separate multiple emails with commas</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Subject <span className="text-orange-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={executionData.emailSubject || ''}
                        onChange={(e) => setExecutionData({ ...executionData, emailSubject: e.target.value })}
                        className="w-full px-4 py-3 bg-[#0a0a1a] border-2 border-gray-700 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:border-green-500 transition-colors"
                        placeholder="Meeting Minutes - [Date]"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Body Content
                      </label>
                      <div className="relative">
                        <textarea
                          value={executionData.emailBody || momContent || ''}
                          onChange={(e) => setExecutionData({ ...executionData, emailBody: e.target.value })}
                          rows={6}
                          className="w-full px-4 py-3 bg-[#0a0a1a] border-2 border-gray-700 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:border-green-500 resize-none transition-colors"
                          placeholder="Leave empty to use generated MOM"
                        />
                        {momContent && !executionData.emailBody && (
                          <div className="absolute bottom-3 right-3">
                            <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-lg">
                              Using MOM
                            </span>
                          </div>
                        )}
                      </div>
                      <p className="mt-1 text-xs text-gray-500">Leave empty to automatically use generated MOM</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Calendar Configuration */}
              {workflow.actions.includes('create_calendar') && (
                <div className={`bg-gradient-to-br from-[#16162a] to-[#1a1a2e] rounded-2xl border border-gray-800 p-6 transition-all duration-500 ${
                  activeStep === getActionIndex('create_calendar')
                    ? 'ring-2 ring-orange-500/50 shadow-lg shadow-orange-500/10 opacity-100 translate-y-0 max-h-[2000px]' 
                    : 'opacity-0 max-h-0 overflow-hidden -translate-y-4 pointer-events-none'
                }`}>
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getActionColor('create_calendar')} flex items-center justify-center text-white shadow-lg`}>
                      {getActionIcon('create_calendar')}
                    </div>
                    <div className="flex-1">
                      <h2 className="text-xl font-bold">Calendar Event</h2>
                      <p className="text-sm text-gray-400">Schedule a follow-up meeting</p>
                    </div>
                    <span className="px-3 py-1 bg-gray-800 rounded-full text-xs text-gray-400">
                      Step {workflow.actions.indexOf('create_calendar') + 1}
                    </span>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Event Title <span className="text-orange-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={executionData.calendarTitle || ''}
                        onChange={(e) => setExecutionData({ ...executionData, calendarTitle: e.target.value })}
                        className="w-full px-4 py-3 bg-[#0a0a1a] border-2 border-gray-700 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                        placeholder="Follow-up Meeting"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                          Start Time <span className="text-orange-500">*</span>
                        </label>
                        <input
                          type="datetime-local"
                          value={executionData.calendarStart || ''}
                          onChange={(e) => setExecutionData({ ...executionData, calendarStart: e.target.value })}
                          className="w-full px-4 py-3 bg-[#0a0a1a] border-2 border-gray-700 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                          End Time <span className="text-orange-500">*</span>
                        </label>
                        <input
                          type="datetime-local"
                          value={executionData.calendarEnd || ''}
                          onChange={(e) => setExecutionData({ ...executionData, calendarEnd: e.target.value })}
                          className="w-full px-4 py-3 bg-[#0a0a1a] border-2 border-gray-700 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-colors"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Teams Post Configuration */}
              {workflow.actions.includes('teams_post') && (
                <div className={`bg-gradient-to-br from-[#16162a] to-[#1a1a2e] rounded-2xl border border-gray-800 p-6 transition-all duration-500 ${
                  activeStep === getActionIndex('teams_post')
                    ? 'ring-2 ring-orange-500/50 shadow-lg shadow-orange-500/10 opacity-100 translate-y-0 max-h-[2000px]' 
                    : 'opacity-0 max-h-0 overflow-hidden -translate-y-4 pointer-events-none'
                }`}>
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getActionColor('teams_post')} flex items-center justify-center text-white shadow-lg`}>
                      {getActionIcon('teams_post')}
                    </div>
                    <div className="flex-1">
                      <h2 className="text-xl font-bold">Teams Message</h2>
                      <p className="text-sm text-gray-400">Post message to MS Teams channel</p>
                    </div>
                    <span className="px-3 py-1 bg-gray-800 rounded-full text-xs text-gray-400">
                      Step {getActionIndex('teams_post') + 1}
                    </span>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Team ID <span className="text-orange-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={executionData.teamsTeamId || ''}
                        onChange={(e) => setExecutionData({ ...executionData, teamsTeamId: e.target.value })}
                        className="w-full px-4 py-3 bg-[#0a0a1a] border-2 border-gray-700 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:border-indigo-500 transition-colors"
                        placeholder="19:meeting_abc123@thread.skype"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Channel ID <span className="text-orange-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={executionData.teamsChannelId || ''}
                        onChange={(e) => setExecutionData({ ...executionData, teamsChannelId: e.target.value })}
                        className="w-full px-4 py-3 bg-[#0a0a1a] border-2 border-gray-700 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:border-indigo-500 transition-colors"
                        placeholder="19:channel_123456@thread.skype"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Message Content
                      </label>
                      <textarea
                        value={executionData.teamsMessage || momContent || ''}
                        onChange={(e) => setExecutionData({ ...executionData, teamsMessage: e.target.value })}
                        rows={6}
                        className="w-full px-4 py-3 bg-[#0a0a1a] border-2 border-gray-700 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:border-indigo-500 resize-none transition-colors"
                        placeholder="Leave empty to use generated MOM"
                      />
                      <p className="mt-1 text-xs text-gray-500">Leave empty to automatically use generated MOM</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Execute Button */}
              <div className="sticky bottom-0 pt-6 bg-[#0a0a1a]">
                <button
                  onClick={handleExecute}
                  disabled={executing}
                  className="relative w-full flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 text-white font-bold text-lg hover:from-orange-600 hover:to-pink-600 disabled:opacity-50 transition-all shadow-2xl shadow-orange-500/25 hover:shadow-orange-500/40 overflow-hidden group"
                >
                  {/* Flowing light effect */}
                  {!executing && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_2s_infinite] transform -skew-x-12" />
                  )}
                  <span className="relative z-10 flex items-center gap-3">
                    {executing ? (
                      <>
                        <div className="w-6 h-6 border-3 border-white/20 border-t-white rounded-full animate-spin" />
                        Executing Workflow...
                      </>
                    ) : (
                      <>
                        <Play className="w-6 h-6" />
                        Execute Workflow
                      </>
                    )}
                  </span>
                </button>
              </div>
            </div>

            {/* Right Column - MOM Preview */}
            {showPreview && momContent && (
              <div className="bg-gradient-to-br from-[#16162a] to-[#1a1a2e] rounded-2xl border border-gray-800 p-6 sticky top-8 h-fit max-h-[calc(100vh-200px)] flex flex-col animate-[slideIn_0.5s_ease-out]">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white">
                      <FileText className="w-5 h-5" />
                    </div>
                    <h2 className="text-xl font-bold">Generated MOM</h2>
                  </div>
                  <button
                    onClick={handleCopy}
                    className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white transition-colors"
                    title="Copy MOM"
                  >
                    {copied ? <Check className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5" />}
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto prose prose-invert prose-sm max-w-none bg-[#0a0a1a] rounded-xl p-6">
                  <ReactMarkdown>{momContent}</ReactMarkdown>
                </div>
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
