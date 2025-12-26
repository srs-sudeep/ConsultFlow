'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { authApi } from '@/lib/api'
import Logo, { Attribution } from '@/components/Logo'

export default function LoginPage() {
  const router = useRouter()

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      try {
        await authApi.getMe()
        router.push('/dashboard')
      } catch (error) {
        // Not logged in, stay on login page
      }
    }
    checkAuth()
  }, [router])

  const handleLogin = () => {
    authApi.login()
  }

  return (
    <div className="min-h-screen bg-[#0a0a1a] flex items-center justify-center p-6">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-orange-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-purple-500/20 to-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-orange-500/5 to-purple-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s' }} />
      </div>

      <div className="relative w-full max-w-md animate-[scaleUp_0.6s_ease-out]">
        {/* Logo */}
        <div className="flex items-center justify-center mb-10">
          <Logo size="lg" animated />
        </div>

        {/* Login Card */}
        <div className="bg-[#16162a]/90 backdrop-blur-xl rounded-2xl border border-gray-800 p-8 shadow-2xl animate-[slideUp_0.5s_ease-out]">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">Welcome back</h1>
            <p className="text-gray-400">Sign in to access your workflow automations</p>
          </div>

          <button
            onClick={handleLogin}
            className="relative w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-[#2a2a4a] border border-gray-700 hover:border-orange-500/50 hover:bg-[#2a2a5a] transition-all group overflow-hidden"
          >
            {/* Shimmer effect */}
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-[shimmer_2s_infinite] transform -skew-x-12 opacity-0 group-hover:opacity-100" />
            
            {/* Microsoft Logo */}
            <svg className="w-6 h-6 relative z-10" viewBox="0 0 23 23">
              <path fill="#f35325" d="M1 1h10v10H1z" />
              <path fill="#81bc06" d="M12 1h10v10H12z" />
              <path fill="#05a6f0" d="M1 12h10v10H1z" />
              <path fill="#ffba08" d="M12 12h10v10H12z" />
            </svg>
            <span className="text-white font-medium relative z-10">Continue with Microsoft</span>
          </button>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              By signing in, you agree to our{' '}
              <a href="#" className="text-orange-500 hover:text-orange-400 transition-colors">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="text-orange-500 hover:text-orange-400 transition-colors">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="mt-10 grid grid-cols-3 gap-4 text-center">
          {[
            { icon: '📝', label: 'Meeting Minutes', delay: '0.6s' },
            { icon: '📧', label: 'Email Automation', delay: '0.7s' },
            { icon: '📊', label: 'Presentations', delay: '0.8s' },
          ].map((feature, index) => (
            <div 
              key={index} 
              className="text-gray-400 animate-[fadeIn_0.5s_ease-out]"
              style={{ animationDelay: feature.delay, animationFillMode: 'both' }}
            >
              <div className="text-3xl mb-2 transform hover:scale-125 transition-transform cursor-default">{feature.icon}</div>
              <div className="text-xs">{feature.label}</div>
            </div>
          ))}
        </div>

        {/* Attribution */}
        <div className="mt-10">
          <Attribution />
        </div>
      </div>
    </div>
  )
}
