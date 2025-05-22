"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Instagram, Share } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { generateSocialImage, copyImageToClipboard, openSocialApp } from "@/lib/social-image-generator"

interface InstagramShareModalProps {
  isOpen: boolean
  onClose: () => void
  text: string
  assistantType: string
}

export function InstagramShareModal({ isOpen, onClose, text, assistantType }: InstagramShareModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const [imageLoaded, setImageLoaded] = useState(false)

  // Generate the image when the modal opens
  useEffect(() => {
    if (isOpen) {
      generateImage()
    } else {
      // Reset state when modal closes
      setImageLoaded(false)
      setRetryCount(0)
    }
  }, [isOpen])

  // Retry image generation if needed
  useEffect(() => {
    if (retryCount > 0 && retryCount <= 3 && isOpen) {
      generateImage(true)
    }
  }, [retryCount])

  const generateImage = async (forceRefresh = false) => {
    try {
      setIsLoading(true)
      setImageLoaded(false)

      // Try to generate a story image
      const storyUrl = await generateSocialImage({
        text,
        assistantType,
        format: "story",
        forceRefresh,
      })

      setImageUrl(storyUrl)

      // Pre-load the image with fallback
      const img = new Image()
      img.onload = () => setImageLoaded(true)
      img.onerror = () => {
        console.error("Dynamic image failed, using fallback")
        // Use fallback image if dynamic generation fails
        setImageUrl("/fallback-story.png")
        setImageLoaded(true)
      }
      img.src = storyUrl
    } catch (error) {
      console.error("Error generating Instagram image:", error)
      // Use fallback image
      setImageUrl("/fallback-story.png")
      setImageLoaded(true)

      toast({
        title: "Using fallback image",
        description: "Dynamic image generation failed, using a default image.",
        variant: "default",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleShare = async () => {
    if (!imageUrl) return

    try {
      // Copy the image to clipboard
      await copyImageToClipboard(imageUrl)

      // Open Instagram Stories
      openSocialApp("instagram")

      toast({
        title: "Image copied",
        description: "The image has been copied. You can now paste it into Instagram Stories!",
      })

      // Close the modal after a short delay
      setTimeout(() => onClose(), 500)
    } catch (error) {
      console.error("Error sharing to Instagram:", error)
      toast({
        title: "Sharing failed",
        description: "Failed to copy the image. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-zinc-900 border-zinc-800">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-white">
            <Instagram className="h-5 w-5 text-pink-500" />
            Share to Instagram
          </DialogTitle>
          <DialogDescription className="text-zinc-400">Share your music verdict to Instagram Stories</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Preview Image */}
          <div className="relative mx-auto max-w-[240px]">
            {isLoading ? (
              <div className="aspect-[9/16] bg-zinc-800 rounded-lg flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
              </div>
            ) : imageUrl ? (
              <>
                {!imageLoaded && (
                  <div className="absolute inset-0 aspect-[9/16] bg-zinc-800 rounded-lg flex items-center justify-center z-10">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                  </div>
                )}
                <img
                  src={imageUrl || "/placeholder.svg"}
                  alt="Instagram Story preview"
                  className="w-full rounded-lg border border-zinc-700 object-contain"
                  style={{ aspectRatio: "9/16" }}
                  onLoad={() => setImageLoaded(true)}
                  onError={() => {
                    console.error("Image failed to load")
                    if (retryCount < 3) {
                      setRetryCount((prev) => prev + 1)
                    }
                  }}
                />
              </>
            ) : (
              <div className="aspect-[9/16] bg-zinc-800 rounded-lg flex items-center justify-center">
                <span className="text-zinc-400">Preview unavailable</span>
              </div>
            )}
            <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">1080×1920</div>
          </div>

          {/* Share Button */}
          <Button
            onClick={handleShare}
            disabled={!imageUrl || isLoading || !imageLoaded}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-medium"
          >
            <Share className="mr-2 h-4 w-4" />
            Share
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
