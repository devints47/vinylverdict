"use client"

import { useState, useEffect } from "react"
import { ChevronDown, ChevronUp, Info } from "lucide-react"

interface SimpleDescriptionProps {
  description: string
  className?: string
  variant?: "default" | "dashboard"
  selectedVinyl?: any
}

export function SimpleDescription({ description, className = "", variant = "default", selectedVinyl }: SimpleDescriptionProps) {
  const [currentDescription, setCurrentDescription] = useState(description)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    // Only use state management for the default variant (index page)
    if (variant === "default" && description !== currentDescription) {
      setIsAnimating(true)
      
      // Modern techy transition timing
      setTimeout(() => {
        setCurrentDescription(description)
        setIsAnimating(false)
      }, 200)
    }
  }, [description, currentDescription, variant])

  // Hide the box if there's no content, but maintain dimensions
  const hasContent = (variant === "dashboard" ? description : currentDescription) && (variant === "dashboard" ? description : currentDescription).trim().length > 0

  const toggleExpand = () => {
    setIsExpanded(!isExpanded)
  }

  // For dashboard variant, use description directly to avoid state-related re-renders
  const displayDescription = variant === "dashboard" ? description : currentDescription

  if (variant === "dashboard") {
    return (
      <>
        {/* CSS keyframe animation for smooth fade-in */}
        <style jsx>{`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
        `}</style>
        
        {selectedVinyl ? (
          <>
            {/* Mobile view - Standalone Dropdown (same level as data privacy) */}
            <div className="block md:hidden w-full">
              <button
                onClick={toggleExpand}
                className="w-full bg-zinc-900/80 border border-zinc-800 rounded-xl p-4 flex items-center justify-between hover:bg-zinc-800/80 transition-colors duration-200"
                aria-expanded={isExpanded}
              >
                <div className="flex items-center gap-3">
                  <Info className="h-4 w-4 text-bright-purple flex-shrink-0" />
                  <span className="text-sm text-zinc-300 text-left">
                    {isExpanded ? "Hide details" : `Learn more about ${selectedVinyl.name}`}
                  </span>
                </div>
                <ChevronDown 
                  className={`h-4 w-4 text-zinc-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                />
              </button>

              {/* Dropdown Content */}
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="bg-zinc-900/60 border-l border-r border-b border-zinc-800 rounded-b-xl p-4 mt-1">
                  <div 
                    key={selectedVinyl?.assistantType || 'default'}
                    className="opacity-0 animate-[fadeIn_300ms_ease-in-out_forwards]"
                    style={{
                      animation: 'fadeIn 300ms ease-in-out forwards'
                    }}
                  >
                    <p className="text-sm text-zinc-300 leading-relaxed">
                      <span className="font-bold text-bright-purple">{selectedVinyl.name}:</span>{" "}
                      {displayDescription}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop view - Card Container */}
            <div 
              className="hidden md:block bg-zinc-900/50 rounded-xl border border-zinc-800 overflow-hidden md:h-[132px] flex items-center justify-center"
              style={{ contain: 'layout style' }}
            >
              <div className="p-3 h-full flex flex-col justify-center w-full">
                <div className="overflow-hidden py-1">
                  <div 
                    key={selectedVinyl?.assistantType || 'default'}
                    className="min-h-[80px] flex items-center justify-center opacity-0 animate-[fadeIn_300ms_ease-in-out_forwards]"
                    style={{ 
                      contain: 'layout style',
                      textRendering: 'optimizeSpeed',
                      fontKerning: 'none',
                      animation: 'fadeIn 300ms ease-in-out forwards'
                    }}
                  >
                    <p 
                      className="text-zinc-300 text-base leading-relaxed text-center px-4 w-full"
                      style={{ 
                        wordBreak: 'break-word',
                        hyphens: 'none',
                        textAlign: 'center',
                        whiteSpace: 'normal'
                      }}
                    >
                      <span className="font-bold text-purple-gradient">{selectedVinyl.name}:</span>{" "}
                      {displayDescription}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="bg-zinc-900/50 rounded-xl border border-zinc-800 overflow-hidden md:h-[132px] flex items-center justify-center">
            <div className="p-6 flex items-center justify-center">
              <p className="text-zinc-400 text-center">Select a personality to see their description</p>
            </div>
          </div>
        )}
      </>
    )
  }

  return (
    <div className={`relative ${className}`}>
      <div 
        className={`
          bg-gradient-to-r from-purple-900/30 to-black/80 
          border border-purple-800/50 
          rounded-lg p-4 backdrop-blur-sm
          transition-all duration-200 ease-out
          min-h-[120px] w-full max-w-full
          mx-auto
          flex items-center
          transform-gpu
          ${isAnimating 
            ? 'opacity-40 scale-[0.98] -translate-y-1 shadow-lg shadow-purple-500/20' 
            : hasContent 
              ? 'opacity-100 scale-100 translate-y-0 shadow-md shadow-purple-500/10' 
              : 'opacity-0 scale-100 translate-y-0'
          }
        `}
      >
        <p className={`
          text-sm text-[#A1A1AA] leading-relaxed w-full
          transition-all duration-200 ease-out
          ${isAnimating ? 'blur-[0.5px]' : 'blur-0'}
        `}>
          {displayDescription}
        </p>
      </div>
    </div>
  )
} 