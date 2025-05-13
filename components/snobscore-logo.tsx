"use client"

import { useState } from "react"

interface SnobifyLogoProps {
  size?: number
  className?: string
}

// Keep the original export for backward compatibility
export function SnobifyLogo({ size = 40, className = "" }: SnobifyLogoProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className={`relative flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Base circle */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute"
      >
        <circle
          cx="50"
          cy="50"
          r="48"
          fill="#A855F7"
          className="transition-all duration-300"
          style={{
            filter: isHovered ? "brightness(1.1)" : "brightness(1)",
          }}
        />

        {/* Vinyl record grooves */}
        <circle cx="50" cy="50" r="42" stroke="rgba(0,0,0,0.2)" strokeWidth="1" />
        <circle cx="50" cy="50" r="36" stroke="rgba(0,0,0,0.2)" strokeWidth="1" />
        <circle cx="50" cy="50" r="30" stroke="rgba(0,0,0,0.2)" strokeWidth="1" />
        <circle cx="50" cy="50" r="24" stroke="rgba(0,0,0,0.2)" strokeWidth="1" />

        {/* Center hole */}
        <circle cx="50" cy="50" r="4" fill="black" />

        {/* Glasses - enlarged and repositioned */}
        <path
          d="M25 45 C25 38, 40 38, 40 45 C40 52, 25 52, 25 45 Z"
          stroke="black"
          strokeWidth="3.5"
          fill="none"
          className="transition-all duration-300"
          style={{
            transform: isHovered ? "translateY(-2px)" : "translateY(0)",
          }}
        />
        <path
          d="M60 45 C60 38, 75 38, 75 45 C75 52, 60 52, 60 45 Z"
          stroke="black"
          strokeWidth="3.5"
          fill="none"
          className="transition-all duration-300"
          style={{
            transform: isHovered ? "translateY(-2px)" : "translateY(0)",
          }}
        />
        <line x1="40" y1="45" x2="60" y2="45" stroke="black" strokeWidth="3.5" />

        {/* Raised eyebrow - enlarged */}
        <path
          d="M25 32 Q35 25 45 32"
          stroke="black"
          strokeWidth="3"
          fill="none"
          className="transition-all duration-300"
          style={{
            transform: isHovered ? "translateY(-3px) rotate(-5deg)" : "translateY(0)",
          }}
        />

        {/* Unimpressed mouth - enlarged and repositioned */}
        <path
          d="M35 70 Q50 65 65 70"
          stroke="black"
          strokeWidth="3"
          fill="none"
          className="transition-all duration-300"
          style={{
            d: isHovered ? "M35 70 Q50 75 65 70" : "M35 70 Q50 65 65 70",
          }}
        />
      </svg>
    </div>
  )
}

export function VinylVerdictLogo({ size = 40, className = "" }: SnobifyLogoProps) {
  // Use the original component for now to maintain visual consistency
  return <SnobifyLogo size={size} className={className} />
}

// Keep the old function name for backward compatibility
export function SnobScoreLogo({ size = 40, className = "" }: SnobifyLogoProps) {
  return <VinylVerdictLogo size={size} className={className} />
}
