import type React from "react"
import { VirtualizedList } from "./virtualized-list"

interface ListContainerProps {
  children: React.ReactNode
  className?: string
  virtualized?: boolean
  items?: any[]
  renderItem?: (item: any, index: number) => React.ReactNode
  itemHeight?: number
}

export function ListContainer({
  children,
  className = "",
  virtualized = false,
  items = [],
  renderItem,
  itemHeight = 72,
}: ListContainerProps) {
  // If virtualization is enabled and we have items and a render function
  if (virtualized && items.length > 0 && renderItem) {
    return (
      <VirtualizedList
        items={items}
        renderItem={renderItem}
        itemHeight={itemHeight}
        className={`space-y-1 divide-y divide-zinc-800/30 sm:px-0 ${className}`}
      />
    )
  }

  // Otherwise, render normally
  return <div className={`space-y-1 divide-y divide-zinc-800/30 sm:px-0 ${className}`}>{children}</div>
}
