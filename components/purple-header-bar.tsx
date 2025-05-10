import type { ReactNode } from "react"

interface PurpleHeaderBarProps {
  children: ReactNode
  isActive?: boolean
}

export function PurpleHeaderBar({ children, isActive = false }: PurpleHeaderBarProps) {
  return (
    <div
      className={`w-full py-3 px-4 ${isActive ? "bg-purple-gradient holographic-shimmer" : "bg-zinc-800/50"} flex items-center justify-center`}
    >
      <div className="text-white font-medium text-lg">{children}</div>
    </div>
  )
}
