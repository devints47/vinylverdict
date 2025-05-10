import type React from "react"
interface ListContainerProps {
  children: React.ReactNode
}

export function ListContainer({ children }: ListContainerProps) {
  return <div className="flex flex-col divide-y divide-zinc-800/50 rounded-lg overflow-hidden">{children}</div>
}
