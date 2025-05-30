import type React from "react"
import { VirtualizedList } from "./virtualized-list"

interface ListContainerProps {
  children: React.ReactNode
  className?: string
  virtualized?: boolean
  items?: any[]
  renderItem?: (item: any, index: number) => React.ReactNode
  itemHeight?: number
  minItems?: number
}

export function ListContainer({
  children,
  className = "",
  virtualized = false,
  items = [],
  renderItem,
  itemHeight = 72,
  minItems = 20, // Default to 20 items height to match skeleton
}: ListContainerProps) {
  // Calculate minimum height based on minimum item count
  // Include space for Load More button (~60px)
  const loadMoreButtonHeight = 60 // mt-6 (24px) + py-2 (16px) + text height (~20px)
  const mobileMinHeight = minItems * 76 + loadMoreButtonHeight // 72px + 4px gap per item + button
  const desktopMinHeight = minItems * 92 + loadMoreButtonHeight // 88px + 4px gap per item + button

  const containerStyle = {
    minHeight: `${mobileMinHeight}px`,
    '@media (min-width: 640px)': {
      minHeight: `${desktopMinHeight}px`
    }
  }

  // If virtualization is enabled and we have items and a render function
  if (virtualized && items.length > 0 && renderItem) {
    return (
      <>
        <style jsx>{`
          .list-container {
            min-height: ${mobileMinHeight}px;
          }
          @media (min-width: 640px) {
            .list-container {
              min-height: ${desktopMinHeight}px;
            }
          }
        `}</style>
        <VirtualizedList
          items={items}
          renderItem={renderItem}
          itemHeight={itemHeight}
          className={`list-container space-y-1 divide-y divide-zinc-800/30 sm:px-0 ${className}`}
        />
      </>
    )
  }

  // Otherwise, render normally with consistent height
  return (
    <>
      <style jsx>{`
        .list-container {
          min-height: ${mobileMinHeight}px;
        }
        @media (min-width: 640px) {
          .list-container {
            min-height: ${desktopMinHeight}px;
          }
        }
      `}</style>
      <div className={`list-container space-y-1 divide-y divide-zinc-800/30 sm:px-0 ${className}`}>
        {children}
      </div>
    </>
  )
}
