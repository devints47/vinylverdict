interface VinylLogoProps {
  size?: number
  className?: string
}

export function VinylLogo({ size = 40, className = "" }: VinylLogoProps) {
  return (
    <img
      src="/music-snob-vinyl.png"
      alt="VinylVerdict.FM Logo"
      width={size}
      height={size}
      className={`inline-block ${className}`}
      style={{
        width: size,
        height: size,
        objectFit: 'contain'
      }}
    />
  )
}
