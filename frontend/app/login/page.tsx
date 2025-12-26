'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { authApi } from '@/lib/api'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const errorParam = searchParams.get('error')
    if (errorParam) {
      setError('Authentication failed. Please try again.')
    }

    // Check if already logged in
    authApi
      .getMe()
      .then(() => {
        router.push('/dashboard')
      })
      .catch(() => {
        // Not logged in, stay on login page
      })
  }, [router, searchParams])

  const handleLogin = () => {
    authApi.login()
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-xl">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">ConsultFlow</h1>
          <p className="text-gray-600">Consulting Automation Copilot</p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-800">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <p className="text-center text-gray-700">
            Sign in with your Microsoft account to get started
          </p>

          <button
            onClick={handleLogin}
            className="w-full rounded-lg bg-[#0078d4] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#106ebe] focus:outline-none focus:ring-2 focus:ring-[#0078d4] focus:ring-offset-2"
          >
            <div className="flex items-center justify-center gap-2">
              <svg
                className="h-5 w-5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zM24 11.4H12.6V0H24v11.4z" />
              </svg>
              Sign in with Microsoft
            </div>
          </button>
        </div>

        <div className="mt-8 border-t border-gray-200 pt-6">
          <p className="text-center text-xs text-gray-500">
            By signing in, you agree to use Microsoft authentication services
          </p>
        </div>
      </div>
    </div>
  )
}

