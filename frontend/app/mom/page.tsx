'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { momApi, workflowApi } from '@/lib/api'
import { FileText, Clock, LayoutDashboard, Plus, LogOut, Copy, Check, ArrowRight } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import Logo, { LoadingLogo, Attribution } from '@/components/Logo'

export default function MOMPage() {
  const router = useRouter()
  const [meetingNotes, setMeetingNotes] = useState('')
  const [momContent, setMomContent] = useState<string | null>(null)
  const [momStructured, setMomStructured] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const handleGenerate = async () => {
    if (!meetingNotes.trim()) {
      setError('Please enter meeting notes')
      return
    }

    setLoading(true)
    setError(null)
    setMomContent(null)
    setMomStructured(null)

    try {
      const res = await momApi.generate(meetingNotes)
      setMomContent(res.data.mom)
      setMomStructured(res.data.structured)
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to generate MOM')
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = () => {
    if (momContent) {
      navigator.clipboard.writeText(momContent)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
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
            className="flex items-center gap-3 px-4 py-3 rounded-lg bg-gray-800/50 text-white"
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
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">MOM Generator</h1>
            <p className="text-gray-400">Transform meeting transcripts into structured minutes</p>
          </div>

          {error && (
            <div className="mb-6 bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400">
              {error}
            </div>
          )}

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <div className="bg-[#16162a] rounded-xl border border-gray-800 p-6">
              <h2 className="text-lg font-semibold mb-4">Meeting Transcript</h2>
              <textarea
                value={meetingNotes}
                onChange={(e) => setMeetingNotes(e.target.value)}
                rows={15}
                className="w-full px-4 py-3 bg-[#0a0a1a] border border-gray-700 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:border-orange-500 resize-none"
                placeholder="Paste your meeting notes or transcript here..."
              />
              <button
                onClick={handleGenerate}
                disabled={loading || !meetingNotes.trim()}
                className="w-full mt-4 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold hover:from-orange-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <FileText className="w-5 h-5" />
                    Generate MOM
                  </>
                )}
              </button>
            </div>

            {/* Output Section */}
            <div className="bg-[#16162a] rounded-xl border border-gray-800 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Generated MOM</h2>
                {momContent && (
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-800 text-gray-300 text-sm hover:bg-gray-700 transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 text-green-400" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy
                      </>
                    )}
                  </button>
                )}
              </div>

              {momContent ? (
                <div className="prose prose-invert prose-sm max-w-none bg-[#0a0a1a] rounded-xl p-4 max-h-[500px] overflow-y-auto">
                  <ReactMarkdown>{momContent}</ReactMarkdown>
                </div>
              ) : (
                <div className="flex items-center justify-center h-[400px] border-2 border-dashed border-gray-700 rounded-xl">
                  <div className="text-center text-gray-500">
                    <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>{loading ? 'Generating MOM...' : 'Generated MOM will appear here'}</p>
                  </div>
                </div>
              )}

              {momContent && (
                <div className="mt-4 flex gap-3">
                  <Link
                    href="/workflow/create"
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-purple-500/20 text-purple-400 font-medium hover:bg-purple-500/30 transition-colors"
                  >
                    Use in Workflow
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              )}
            </div>
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
