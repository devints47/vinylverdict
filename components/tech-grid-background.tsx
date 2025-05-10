"use client"

interface TechGridBackgroundProps {
  className?: string
}

export function TechGridBackground({ className = "" }: TechGridBackgroundProps) {
  return (
    <div
      className={`absolute inset-0 w-full h-full pointer-events-none z-0 bg-black ${className}`}
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='50' height='50' viewBox='0 0 50 50'%3E%3Cpath stroke='rgba(255, 255, 255, 0.04)' strokeWidth='0.6' fill='none' d='M0,0 L50,0 L50,50 L0,50 Z'/%3E%3Ccircle cx='0' cy='0' r='1.2' fill='rgba(255, 255, 255, 0.06)'/%3E%3Ccircle cx='50' cy='0' r='1.2' fill='rgba(255, 255, 255, 0.06)'/%3E%3Ccircle cx='0' cy='50' r='1.2' fill='rgba(255, 255, 255, 0.06)'/%3E%3Ccircle cx='50' cy='50' r='1.2' fill='rgba(255, 255, 255, 0.06)'/%3E%3C/svg%3E")`,
        backgroundSize: "50px 50px",
        backgroundRepeat: "repeat",
      }}
      aria-hidden="true"
    >
      {/* Purple accent dots - keep these more visible */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='500' height='500' viewBox='0 0 500 500'%3E%3Ccircle cx='120' cy='80' r='3' fill='rgba(168, 85, 247, 0.25)'/%3E%3Ccircle cx='370' cy='190' r='4' fill='rgba(168, 85, 247, 0.25)'/%3E%3Ccircle cx='180' cy='320' r='5' fill='rgba(168, 85, 247, 0.25)'/%3E%3Ccircle cx='430' cy='400' r='3' fill='rgba(168, 85, 247, 0.25)'/%3E%3Ccircle cx='250' cy='150' r='4' fill='rgba(168, 85, 247, 0.25)'/%3E%3C/svg%3E")`,
          backgroundSize: "500px 500px",
          backgroundRepeat: "repeat",
          opacity: 0.7,
        }}
      />

      {/* Glow effect for purple dots - slightly reduced */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='500' height='500' viewBox='0 0 500 500'%3E%3Cfilter id='glow' x='-50%25' y='-50%25' width='200%25' height='200%25'%3E%3CfeGaussianBlur stdDeviation='10' result='blur'/%3E%3CfeComposite in='SourceGraphic' in2='blur' operator='over'/%3E%3C/filter%3E%3Ccircle cx='120' cy='80' r='12' fill='rgba(168, 85, 247, 0.08)' filter='url(%23glow)'/%3E%3Ccircle cx='370' cy='190' r='16' fill='rgba(168, 85, 247, 0.08)' filter='url(%23glow)'/%3E%3Ccircle cx='180' cy='320' r='20' fill='rgba(168, 85, 247, 0.08)' filter='url(%23glow)'/%3E%3Ccircle cx='430' cy='400' r='12' fill='rgba(168, 85, 247, 0.08)' filter='url(%23glow)'/%3E%3Ccircle cx='250' cy='150' r='16' fill='rgba(168, 85, 247, 0.08)' filter='url(%23glow)'/%3E%3C/svg%3E")`,
          backgroundSize: "500px 500px",
          backgroundRepeat: "repeat",
          opacity: 0.5,
        }}
      />
    </div>
  )
}
