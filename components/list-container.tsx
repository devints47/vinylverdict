import type React from "react"
interface ListContainerProps {
  children: React.ReactNode
  className?: string
}

export function ListContainer({ children, className = "" }: ListContainerProps) {
  return <div className={`space-y-1 divide-y divide-zinc-800/30 sm:px-0 ${className}`}>{children}</div>
}
