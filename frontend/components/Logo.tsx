'use client'

import React from 'react'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showText?: boolean
  animated?: boolean
  className?: string
}

export default function Logo({ 
  size = 'md', 
  showText = true, 
  animated = true,
  className = '' 
}: LogoProps) {
  const sizes = {
    sm: { icon: 'w-8 h-8', text: 'text-lg', flow: 'w-2 h-2' },
    md: { icon: 'w-10 h-10', text: 'text-xl', flow: 'w-2.5 h-2.5' },
    lg: { icon: 'w-14 h-14', text: 'text-2xl', flow: 'w-3 h-3' },
    xl: { icon: 'w-20 h-20', text: 'text-4xl', flow: 'w-4 h-4' },
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Logo Icon */}
      <div className={`relative ${sizes[size].icon}`}>
        {/* Main container with gradient */}
        <div className={`absolute inset-0 rounded-xl bg-gradient-to-br from-orange-500 via-pink-500 to-purple-600 ${animated ? 'animate-pulse' : ''}`} 
          style={{ animationDuration: '3s' }}
        />
        
        {/* Inner glow */}
        <div className="absolute inset-0.5 rounded-[10px] bg-gradient-to-br from-orange-400 via-pink-400 to-purple-500 opacity-80" />
        
        {/* Icon content */}
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Flow nodes */}
          <svg viewBox="0 0 40 40" className="w-full h-full p-2">
            {/* Background circle for depth */}
            <defs>
              <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fff" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#fff" stopOpacity="0.7" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            
            {/* Top node */}
            <circle cx="20" cy="8" r="4" fill="url(#logoGradient)" filter="url(#glow)">
              {animated && (
                <animate attributeName="r" values="4;4.5;4" dur="2s" repeatCount="indefinite" />
              )}
            </circle>
            
            {/* Left node */}
            <circle cx="10" cy="28" r="4" fill="url(#logoGradient)" filter="url(#glow)">
              {animated && (
                <animate attributeName="r" values="4;4.5;4" dur="2s" begin="0.3s" repeatCount="indefinite" />
              )}
            </circle>
            
            {/* Right node */}
            <circle cx="30" cy="28" r="4" fill="url(#logoGradient)" filter="url(#glow)">
              {animated && (
                <animate attributeName="r" values="4;4.5;4" dur="2s" begin="0.6s" repeatCount="indefinite" />
              )}
            </circle>
            
            {/* Connecting lines */}
            <path 
              d="M20 12 L20 18 L12 26" 
              stroke="url(#logoGradient)" 
              strokeWidth="2" 
              fill="none" 
              strokeLinecap="round"
              filter="url(#glow)"
            >
              {animated && (
                <animate 
                  attributeName="stroke-dasharray" 
                  values="0,50;25,25;50,0" 
                  dur="2s" 
                  repeatCount="indefinite" 
                />
              )}
            </path>
            <path 
              d="M20 18 L28 26" 
              stroke="url(#logoGradient)" 
              strokeWidth="2" 
              fill="none" 
              strokeLinecap="round"
              filter="url(#glow)"
            >
              {animated && (
                <animate 
                  attributeName="stroke-dasharray" 
                  values="0,30;15,15;30,0" 
                  dur="2s" 
                  begin="0.5s"
                  repeatCount="indefinite" 
                />
              )}
            </path>
            
            {/* Center processing indicator */}
            <circle cx="20" cy="20" r="2" fill="white" opacity="0.8">
              {animated && (
                <>
                  <animate attributeName="r" values="2;3;2" dur="1.5s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.8;1;0.8" dur="1.5s" repeatCount="indefinite" />
                </>
              )}
            </circle>
          </svg>
        </div>
        
        {/* Shine effect */}
        {animated && (
          <div className="absolute inset-0 rounded-xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_3s_infinite] transform -skew-x-12" />
          </div>
        )}
      </div>

      {/* Text */}
      {showText && (
        <div className="flex flex-col">
          <span className={`font-black tracking-tight bg-gradient-to-r from-orange-400 via-pink-400 to-purple-400 bg-clip-text text-transparent ${sizes[size].text}`}>
            ConsultFlow
          </span>
          <span className="text-[10px] text-gray-500 tracking-widest uppercase -mt-0.5">
            Automation Copilot
          </span>
        </div>
      )}
    </div>
  )
}

// Loading Logo with animation
export function LoadingLogo({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-6">
      {/* Animated Logo */}
      <div className="relative">
        {/* Outer glow ring */}
        <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 opacity-20 blur-xl animate-pulse" />
        
        {/* Main logo */}
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-orange-500 via-pink-500 to-purple-600 animate-[spin_8s_linear_infinite]" />
          <div className="absolute inset-1 rounded-xl bg-[#0a0a1a]" />
          
          {/* Inner animated icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <svg viewBox="0 0 40 40" className="w-12 h-12">
              <defs>
                <linearGradient id="loadingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f97316">
                    <animate attributeName="stop-color" values="#f97316;#ec4899;#a855f7;#f97316" dur="3s" repeatCount="indefinite" />
                  </stop>
                  <stop offset="100%" stopColor="#a855f7">
                    <animate attributeName="stop-color" values="#a855f7;#f97316;#ec4899;#a855f7" dur="3s" repeatCount="indefinite" />
                  </stop>
                </linearGradient>
              </defs>
              
              {/* Animated nodes */}
              <circle cx="20" cy="8" r="4" fill="url(#loadingGradient)">
                <animate attributeName="cy" values="8;10;8" dur="1s" repeatCount="indefinite" />
              </circle>
              <circle cx="10" cy="28" r="4" fill="url(#loadingGradient)">
                <animate attributeName="cx" values="10;8;10" dur="1s" begin="0.2s" repeatCount="indefinite" />
              </circle>
              <circle cx="30" cy="28" r="4" fill="url(#loadingGradient)">
                <animate attributeName="cx" values="30;32;30" dur="1s" begin="0.4s" repeatCount="indefinite" />
              </circle>
              
              {/* Animated paths */}
              <path 
                d="M20 12 L20 18 L12 26" 
                stroke="url(#loadingGradient)" 
                strokeWidth="2.5" 
                fill="none" 
                strokeLinecap="round"
                strokeDasharray="20"
              >
                <animate attributeName="stroke-dashoffset" values="40;0;-40" dur="2s" repeatCount="indefinite" />
              </path>
              <path 
                d="M20 18 L28 26" 
                stroke="url(#loadingGradient)" 
                strokeWidth="2.5" 
                fill="none" 
                strokeLinecap="round"
                strokeDasharray="15"
              >
                <animate attributeName="stroke-dashoffset" values="30;0;-30" dur="2s" begin="0.3s" repeatCount="indefinite" />
              </path>
              
              {/* Center pulse */}
              <circle cx="20" cy="18" r="3" fill="url(#loadingGradient)" opacity="0.8">
                <animate attributeName="r" values="2;4;2" dur="1s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="1;0.5;1" dur="1s" repeatCount="indefinite" />
              </circle>
            </svg>
          </div>
        </div>
        
        {/* Orbiting dots */}
        <div className="absolute inset-0 animate-[spin_3s_linear_infinite]">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 w-2 h-2 rounded-full bg-orange-500" />
        </div>
        <div className="absolute inset-0 animate-[spin_4s_linear_infinite_reverse]">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1 w-2 h-2 rounded-full bg-pink-500" />
        </div>
      </div>
      
      {/* Loading text */}
      <div className="text-center">
        <p className="text-gray-400 font-medium animate-pulse">{message}</p>
        <div className="flex justify-center gap-1 mt-3">
          <div className="w-2 h-2 rounded-full bg-orange-500 animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 rounded-full bg-pink-500 animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  )
}

// Footer with attribution
export function Attribution() {
  return (
    <div className="flex items-center justify-center gap-2 text-xs text-gray-600">
      <span>Built with</span>
      <span className="text-red-500">❤️</span>
      <span>by</span>
      <a 
        href="https://github.com/srs-sudeep" 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-orange-500 hover:text-orange-400 transition-colors font-medium"
      >
        @srs-sudeep
      </a>
    </div>
  )
}

