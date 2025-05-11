"use client"

import { useEffect } from "react"

// This component will handle the animated favicon by swapping images
export function AnimatedFavicon() {
  useEffect(() => {
    // Skip animation if prefers-reduced-motion is enabled
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (prefersReducedMotion) return

    // Create an array of favicon frames (we'll use 8 frames for a smooth rotation)
    const frames = [
      "/favicon-frames/frame-1.png",
      "/favicon-frames/frame-2.png",
      "/favicon-frames/frame-3.png",
      "/favicon-frames/frame-4.png",
      "/favicon-frames/frame-5.png",
      "/favicon-frames/frame-6.png",
      "/favicon-frames/frame-7.png",
      "/favicon-frames/frame-8.png",
    ]

    // Get the favicon link element
    let link: HTMLLinkElement | null = document.querySelector("link[rel='icon']")

    // If no favicon link exists, create one
    if (!link) {
      link = document.createElement("link")
      link.rel = "icon"
      link.type = "image/png"
      document.head.appendChild(link)
    }

    // Set up the animation
    let frameIndex = 0
    let intervalId: NodeJS.Timeout | null = null

    // Function to start the animation
    const startAnimation = () => {
      // Clear any existing interval first
      if (intervalId) clearInterval(intervalId)

      // Use a slow interval for subtle animation (250ms per frame = 2 seconds per full rotation)
      intervalId = setInterval(() => {
        if (link) {
          try {
            link.href = frames[frameIndex]
            frameIndex = (frameIndex + 1) % frames.length
          } catch (error) {
            console.error("Error updating favicon:", error)
            pauseAnimation()
          }
        }
      }, 250)
    }

    // Function to pause the animation
    const pauseAnimation = () => {
      if (intervalId) {
        clearInterval(intervalId)
        intervalId = null
      }
    }

    // Handle visibility change
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        startAnimation()
      } else {
        pauseAnimation()
      }
    }

    // Add visibility change listener
    document.addEventListener("visibilitychange", handleVisibilityChange)

    // Start animation initially if page is visible
    if (document.visibilityState === "visible") {
      // Delay start to avoid conflicts with initial page load
      setTimeout(startAnimation, 1000)
    }

    // Clean up on unmount
    return () => {
      if (intervalId) clearInterval(intervalId)
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      // Reset to static favicon
      if (link) {
        try {
          link.href = "/vinyl-favicon-new.png"
        } catch (error) {
          console.error("Error resetting favicon:", error)
        }
      }
    }
  }, [])

  // This component doesn't render anything visible
  return null
}
