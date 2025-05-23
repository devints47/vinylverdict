"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Instagram, Share, Download } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { generateShareImageUrl, copyImageToClipboard, downloadImage, openSocialApp } from "@/lib/static-image-generator"

interface InstagramShareModalProps {
  isOpen: boolean
  onClose: () => void
  text: string
  assistantType: string
}

export function InstagramShareModal({ isOpen, onClose, text, assistantType }: InstagramShareModalProps) {
  const [imageUrl, setImageUrl] = useState<string>("")
  const [imageLoaded, setImageLoaded] = useState(false)

  useEffect(() => {
    if (isOpen) {
      const url = generateShareImageUrl(text, assistantType)
      setImageUrl(url)
      setImageLoaded(false)
    }
  }, [isOpen, text, assistantType])

  const handleShare = async () => {
    try {
      await copyImageToClipboard(imageUrl)
      openSocialApp("instagram")

      toast({
        title: "Image copied",
        description: "The image has been copied. You can now paste it into Instagram Stories!",
      })

      setTimeout(() => onClose(), 500)
    } catch (error) {
      toast({
        title: "Sharing failed",
        description: "Failed to copy the image. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDownload = async () => {
    try {
      await downloadImage(imageUrl, `vinylverdict-${assistantType}-story.png`)
      toast({
        title: "Image downloaded",
        description: "The image has been saved to your device.",
      })
    } catch (error) {
      toast({
        title: "Download failed",
        description: "Failed to download the image. Please try again.",
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
                toast({
                  title: "Preview failed",
                  description: "Could not load image preview, but sharing should still work.",
                  variant: "destructive",
                })
              }}
            />
            <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">1080×1920</div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            <Button
              onClick={handleShare}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-medium"
            >
              <Share className="mr-2 h-4 w-4" />
              Share to Instagram
            </Button>

            <Button
              onClick={handleDownload}
              variant="outline"
              className="w-full border-zinc-700 text-zinc-300 hover:bg-zinc-800"
            >
              <Download className="mr-2 h-4 w-4" />
              Download Image
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
