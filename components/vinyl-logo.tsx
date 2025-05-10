interface VinylLogoProps {
  size?: number
  className?: string
}

export function VinylLogo({ size = 40, className = "" }: VinylLogoProps) {
  // Calculate dimensions based on size
  const outerRadius = size / 2 - 2
  const labelRadius = outerRadius / 3
  const centerX = size / 2
  const centerY = size / 2

  // Calculate face dimensions (matching the canvas version)
  const eyeOffsetX = labelRadius * 0.4
  const eyeY = centerY - labelRadius * 0.1
  const eyeWidth = labelRadius * 0.3
  const eyeHeight = labelRadius * 0.25

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={`inline-block ${className}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Vinyl Record */}
      <circle cx={centerX} cy={centerY} r={outerRadius} fill="#191414" />

      {/* Vinyl Grooves */}
      {Array.from({ length: 10 }).map((_, i) => {
        const grooveRadius = outerRadius - 3 - i * 3
        if (grooveRadius <= labelRadius) return null
        return (
          <circle
            key={`groove-${i}`}
            cx={centerX}
            cy={centerY}
            r={grooveRadius}
            fill="none"
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth="1"
          />
        )
      })}

      {/* Reflection Highlight */}
      <defs>
        <linearGradient id="reflection" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(255, 255, 255, 0)" />
          <stop offset="45%" stopColor="rgba(255, 255, 255, 0)" />
          <stop offset="50%" stopColor="rgba(255, 255, 255, 0.15)" />
          <stop offset="55%" stopColor="rgba(255, 255, 255, 0)" />
          <stop offset="100%" stopColor="rgba(255, 255, 255, 0)" />
        </linearGradient>
      </defs>
      <circle cx={centerX} cy={centerY} r={outerRadius} fill="url(#reflection)" />

      {/* Outer Rim Highlight */}
      <circle cx={centerX} cy={centerY} r={outerRadius} fill="none" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="1" />

      {/* Label Background with Purple Gradient */}
      <defs>
        <linearGradient id="purpleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#A855F7" />
          <stop offset="25%" stopColor="#9333EA" />
          <stop offset="50%" stopColor="#C084FC" />
          <stop offset="75%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#D946EF" />
        </linearGradient>
      </defs>
      <circle cx={centerX} cy={centerY} r={labelRadius} fill="url(#purpleGradient)" />

      {/* Label Edge */}
      <circle cx={centerX} cy={centerY} r={labelRadius} fill="none" stroke="rgba(0, 0, 0, 0.3)" strokeWidth="1" />

      {/* Music Snob Face - Glasses */}
      <ellipse
        cx={centerX - eyeOffsetX}
        cy={eyeY}
        rx={eyeWidth}
        ry={eyeHeight}
        fill="none"
        stroke="black"
        strokeWidth="1.5"
      />
      <ellipse
        cx={centerX + eyeOffsetX}
        cy={eyeY}
        rx={eyeWidth}
        ry={eyeHeight}
        fill="none"
        stroke="black"
        strokeWidth="1.5"
      />

      {/* Bridge */}
      <line
        x1={centerX - eyeOffsetX + eyeWidth}
        y1={eyeY}
        x2={centerX + eyeOffsetX - eyeWidth}
        y2={eyeY}
        stroke="black"
        strokeWidth="1.5"
      />

      {/* Raised Eyebrow */}
      <path
        d={`M ${centerX - eyeOffsetX - eyeWidth} ${eyeY - eyeHeight * 1.5} Q ${centerX - eyeOffsetX} ${eyeY - eyeHeight * 2.5} ${centerX - eyeOffsetX + eyeWidth * 1.5} ${eyeY - eyeHeight * 1.5}`}
        fill="none"
        stroke="black"
        strokeWidth="1.5"
      />

      {/* Unimpressed Mouth */}
      <path
        d={`M ${centerX - labelRadius * 0.5} ${centerY + labelRadius * 0.5} Q ${centerX} ${centerY + labelRadius * 0.4} ${centerX + labelRadius * 0.5} ${centerY + labelRadius * 0.5}`}
        fill="none"
        stroke="black"
        strokeWidth="1.5"
      />

      {/* Center Hole */}
      <circle cx={centerX} cy={centerY} r="5" fill="#333" />

      {/* Center Hole Highlight */}
      <circle cx={centerX - 1} cy={centerY - 1} r="2" fill="rgba(255, 255, 255, 0.3)" />
    </svg>
  )
}
