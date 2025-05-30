"use client"

import { useState } from "react"

interface VinylVerdictLogoProps {
  size?: number
  className?: string
}

export function VinylVerdictLogo({ size = 40, className = "" }: VinylVerdictLogoProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className={`relative flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img
        src="/music-snob-vinyl.png"
        alt="VinylVerdict.FM Logo"
        width={size}
        height={size}
        className={`transition-all duration-300 ${isHovered ? 'scale-110 brightness-110' : 'scale-100'}`}
        style={{
          width: size,
          height: size,
          objectFit: 'contain'
        }}
      />
    </div>
  )
}

// For backward compatibility
export function SnobifyLogo({ size = 40, className = "" }: VinylVerdictLogoProps) {
  return <VinylVerdictLogo size={size} className={className} />
}

export function SnobScoreLogo({ size = 40, className = "" }: VinylVerdictLogoProps) {
  return <VinylVerdictLogo size={size} className={className} />
}
