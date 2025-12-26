'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { authApi } from '@/lib/api'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    authApi
      .getMe()
      .then(() => {
        router.push('/dashboard')
      })
      .catch(() => {
        router.push('/login')
      })
  }, [router])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  )
}

