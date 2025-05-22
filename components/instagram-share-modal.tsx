"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Instagram, Share } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { generateInstagramShareImage, copyImageToClipboard, openInstagramStories } from "@/lib/instagram-share"

interface InstagramShareModalProps {
  isOpen: boolean
  onClose: () => void
  text: string
  assistantType: string
}

export function InstagramShareModal({ isOpen, onClose, text, assistantType }: InstagramShareModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState<string | null>(null)

  // Generate the image when the modal opens
  useEffect(() => {
    if (isOpen) {
      generateImage()
    }
  }, [isOpen])

  const generateImage = async () => {
    try {
      setIsLoading(true)
      // Always generate a story image
      const storyUrl = await generateInstagramShareImage(text, assistantType, "story")
      setImageUrl(storyUrl)
    } catch (error) {
      toast({
        title: "Error generating image",
        description: "Failed to generate the share image. Please try again.",
        variant: "destructive",
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
      openInstagramStories()

      toast({
        title: "Image copied",
        description: "The image has been copied. You can now paste it into Instagram Stories!",
      })

      // Close the modal after a short delay
      setTimeout(() => onClose(), 500)
    } catch (error) {
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
          {imageUrl && (
            <div className="relative mx-auto max-w-[240px]">
              <img
                src={imageUrl || "/placeholder.svg"}
                alt="Instagram Story preview"
                className="w-full rounded-lg border border-zinc-700 object-contain"
                style={{ aspectRatio: "9/16" }}
                onError={(e) => {
                  // If image fails to load, try to reload it
                  const target = e.target as HTMLImageElement
                  if (target.src === imageUrl) {
                    // Add a timestamp to force reload
                    target.src = `${imageUrl}${imageUrl.includes("?") ? "&" : "?"}t=${Date.now()}`
                  }
                }}
              />
              <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">1080×1920</div>
            </div>
          )}

          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
              <span className="ml-2 text-zinc-400">Generating story image...</span>
            </div>
          )}

          {/* Share Button */}
          <Button
            onClick={handleShare}
            disabled={!imageUrl || isLoading}
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
