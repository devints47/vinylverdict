"use client"

import type React from "react"

import { type ReactNode, useEffect, useState } from "react"
import { FixedSizeList as List } from "react-window"
import { useResizeObserver } from "@/hooks/use-resize-observer"

interface VirtualizedListProps {
  items: any[]
  renderItem: (item: any, index: number) => ReactNode
  itemHeight?: number
  className?: string
  overscanCount?: number
}

export function VirtualizedList({
  items,
  renderItem,
  itemHeight = 72, // Default height for track/artist items
  className = "",
  overscanCount = 5,
}: VirtualizedListProps) {
  const [listHeight, setListHeight] = useState(600)
  const [containerRef, containerWidth] = useResizeObserver<HTMLDivElement>()

  // Calculate the height based on number of items, but cap it
  useEffect(() => {
    const calculateHeight = () => {
      // Get viewport height
      const viewportHeight = window.innerHeight
      // Calculate ideal list height (items * itemHeight)
      const idealHeight = Math.min(items.length * itemHeight, viewportHeight * 0.7)
      // Set a minimum height
      return Math.max(idealHeight, 300)
    }

    setListHeight(calculateHeight())

    const handleResize = () => {
      setListHeight(calculateHeight())
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [items.length, itemHeight])

  // Row renderer function
  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => (
    <div style={style}>{renderItem(items[index], index)}</div>
  )

  if (items.length === 0) {
    return <div className={className}>No items to display</div>
  }

  return (
    <div ref={containerRef} className={`w-full ${className}`}>
      <List
        height={listHeight}
        width="100%"
        itemCount={items.length}
        itemSize={itemHeight}
        overscanCount={overscanCount}
      >
        {Row}
      </List>
    </div>
  )
}
