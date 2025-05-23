"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Share } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { generateSocialImage, copyImageToClipboard, openSocialApp } from "@/lib/social-image-generator"

interface SocialShareModalProps {
  isOpen: boolean
  onClose: () => void
  text: string
  assistantType: string
  platform: string
  platformName: string
  platformColor: string
  platformIcon: React.ReactNode
}

export function SocialShareModal({
  isOpen,
  onClose,
  text,
  assistantType,
  platform,
  platformName,
  platformColor,
  platformIcon,
}: SocialShareModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [useFallback, setUseFallback] = useState(false)

  // Generate the image when the modal opens
  useState(() => {
    if (isOpen) {
      setIsLoading(true)
      setImageLoaded(false)
      setUseFallback(false)
      generateImage()
    } else {
      setImageUrl(null)
    }
  })

  const generateImage = async () => {
    try {
      // Generate a story image
      const storyUrl = await generateSocialImage({
        text,
        assistantType,
        format: "story",
      })

      setImageUrl(storyUrl)

      // Pre-load the image
      const img = new Image()
      img.onload = () => {
        setImageLoaded(true)
        setIsLoading(false)
      }
      img.onerror = () => {
        console.error("Image failed to load, using fallback")
        setUseFallback(true)
        setImageLoaded(true)
        setIsLoading(false)
      }
      img.src = storyUrl
    } catch (error) {
      console.error(`Error generating ${platformName} image:`, error)
      setUseFallback(true)
      setImageLoaded(true)
      setIsLoading(false)
    }
  }

  const handleShare = async () => {
    if (!imageUrl && !useFallback) return

    try {
      // Copy the image to clipboard
      const urlToShare = useFallback ? getFallbackUrl() : imageUrl!
      await copyImageToClipboard(urlToShare)

      // Open the social media app
      openSocialApp(platform)

      toast({
        title: "Image copied",
        description: `The image has been copied. You can now paste it into ${platformName}!`,
      })

      // Close the modal after a short delay
      setTimeout(() => onClose(), 500)
    } catch (error) {
      console.error(`Error sharing to ${platformName}:`, error)
      toast({
        title: "Sharing failed",
        description: "Failed to copy the image. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Get fallback image URL
  const getFallbackUrl = () => {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin
    return `${appUrl}/api/og/static?type=${assistantType}`
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-zinc-900 border-zinc-800">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-white">
            <div className="h-5 w-5" style={{ color: platformColor }}>
              {platformIcon}
            </div>
            Share to {platformName}
          </DialogTitle>
          <DialogDescription className="text-zinc-400">
            Share your music verdict to {platformName} Stories
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Preview Image */}
          <div className="relative mx-auto max-w-[240px]">
            {isLoading ? (
              <div className="aspect-[9/16] bg-zinc-800 rounded-lg flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
              </div>
            ) : (
              <img
                src={useFallback ? getFallbackUrl() : imageUrl || "/placeholder.svg"}
                alt={`${platformName} Story preview`}
                className="w-full rounded-lg border border-zinc-700 object-contain"
                style={{ aspectRatio: "9/16" }}
                onLoad={() => setImageLoaded(true)}
                onError={() => {
                  console.error("Image failed to load, using fallback")
                  setUseFallback(true)
                }}
              />
            )}
            <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">1080×1920</div>
          </div>

          {/* Share Button */}
          <Button
            onClick={handleShare}
            disabled={isLoading && !useFallback}
            className="w-full"
            style={{
              background: platformColor,
              color: "white",
            }}
          >
            <Share className="mr-2 h-4 w-4" />
            Share
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
