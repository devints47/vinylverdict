"use client"

import { useCallback, useEffect, useRef, useState } from "react"

export function useResizeObserver<T extends HTMLElement>(): [(node: T | null) => void, number, number] {
  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)
  const resizeObserver = useRef<ResizeObserver | null>(null)

  const ref = useCallback((node: T | null) => {
    if (node) {
      const observer = new ResizeObserver((entries) => {
        const { width, height } = entries[0].contentRect
        setWidth(width)
        setHeight(height)
      })

      observer.observe(node)
      resizeObserver.current = observer
    } else if (resizeObserver.current) {
      resizeObserver.current.disconnect()
    }
  }, [])

  useEffect(() => {
    return () => {
      if (resizeObserver.current) {
        resizeObserver.current.disconnect()
      }
    }
  }, [])

  return [ref, width, height]
}
