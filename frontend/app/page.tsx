'use client'

import Link from 'next/link'
import { FileText, Mail, Calendar, Presentation, ArrowRight, Play, Sparkles } from 'lucide-react'
import Logo, { Attribution } from '@/components/Logo'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0a1a] text-white">
      {/* Header */}
      <header className="border-b border-gray-800 animate-[slideIn_0.5s_ease-out]">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Logo size="md" />
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/login"
                className="relative px-6 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-pink-500 text-white font-medium hover:from-orange-600 hover:to-pink-600 transition-all overflow-hidden group"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_2s_infinite] transform -skew-x-12 opacity-0 group-hover:opacity-100" />
                <span className="relative z-10">Get Started</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Animated Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-orange-500/10 via-transparent to-transparent" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-orange-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-purple-500/15 to-blue-500/15 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '5s' }} />

        <div className="relative max-w-7xl mx-auto px-6 py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-[fadeIn_0.8s_ease-out]">
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Flexible AI workflow automation{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-400">
                  for consulting teams
                </span>
              </h1>
              <p className="text-xl text-gray-400 mb-8">
                Build with the precision of code or the speed of drag-n-drop. Transform meeting transcripts into minutes, presentations, and actionable tasks automatically.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 px-8 py-3 rounded-lg bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold hover:from-orange-600 hover:to-pink-600 transition-all shadow-lg shadow-orange-500/25"
                >
                  Get started for free
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <button className="inline-flex items-center gap-2 px-8 py-3 rounded-lg bg-gray-800 text-white font-semibold hover:bg-gray-700 transition-colors">
                  <Play className="w-5 h-5" />
                  Watch demo
                </button>
              </div>
            </div>

            {/* Hero Image / Illustration */}
            <div className="relative animate-[scaleUp_0.6s_ease-out]">
              <div className="bg-[#16162a] rounded-2xl border border-gray-800 p-6 shadow-2xl hover:border-gray-700 transition-colors">
                {/* Mini workflow visualization */}
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 h-0.5 bg-gradient-to-r from-orange-500 to-transparent" />
                  </div>
                  <div className="ml-6 pl-6 border-l-2 border-gray-700 space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-purple-400" />
                      </div>
                      <span className="text-sm text-gray-400">Generate MOM</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                        <Mail className="w-5 h-5 text-green-400" />
                      </div>
                      <span className="text-sm text-gray-400">Send Email</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
                        <Presentation className="w-5 h-5 text-orange-400" />
                      </div>
                      <span className="text-sm text-gray-400">Create PPT</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Cards */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">What you can automate</h2>
            <p className="text-gray-400">Transform your consulting workflow with AI-powered automation</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <FileText className="w-6 h-6" />,
                title: 'Meeting Minutes',
                description: 'Auto-generate structured MOM from transcripts',
                gradient: 'from-purple-500 to-purple-600',
              },
              {
                icon: <Presentation className="w-6 h-6" />,
                title: 'Presentations',
                description: 'Create PowerPoint slides automatically',
                gradient: 'from-orange-500 to-orange-600',
              },
              {
                icon: <Mail className="w-6 h-6" />,
                title: 'Email Delivery',
                description: 'Send via Outlook with one click',
                gradient: 'from-green-500 to-green-600',
              },
              {
                icon: <Calendar className="w-6 h-6" />,
                title: 'Calendar Events',
                description: 'Schedule follow-ups automatically',
                gradient: 'from-blue-500 to-blue-600',
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-[#16162a] rounded-xl border border-gray-800 p-6 hover:border-gray-700 transition-colors group"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-orange-500/10 to-pink-500/10 rounded-3xl border border-gray-800 p-12">
            <h2 className="text-3xl font-bold mb-4">Ready to automate your workflow?</h2>
            <p className="text-gray-400 mb-8">
              Start building powerful automations in minutes. No credit card required.
            </p>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-lg bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold hover:from-orange-600 hover:to-pink-600 transition-all shadow-lg shadow-orange-500/25"
            >
              Get started for free
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-4">
          <div className="flex items-center justify-between w-full">
            <Logo size="sm" />
            <div className="flex items-center gap-6 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="https://github.com/srs-sudeep" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GitHub</a>
            </div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Attribution />
            <span className="text-xs text-gray-600">© 2025 ConsultFlow. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
