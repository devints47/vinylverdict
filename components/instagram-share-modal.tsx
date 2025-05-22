"use client"

import React, { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, Copy, Instagram, Smartphone, ImageIcon, Video } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import {
  generateInstagramShareImage,
  downloadImage,
  copyImageToClipboard,
  openInstagramCamera,
  openInstagramStories,
} from "@/lib/instagram-share"

interface InstagramShareModalProps {
  isOpen: boolean
  onClose: () => void
  text: string
  assistantType: string
}

export function InstagramShareModal({ isOpen, onClose, text, assistantType }: InstagramShareModalProps) {
  const [isLoading, setIsLoading] = useState({ post: false, story: false })
  const [imageUrls, setImageUrls] = useState<{ post: string | null; story: string | null }>({ post: null, story: null })
  const [activeTab, setActiveTab] = useState("post")

  React.useEffect(() => {
    if (isOpen) {
      generateImages()
    }
  }, [isOpen])

  const generateImages = async () => {
    try {
      setIsLoading({ post: true, story: true })

      // Generate both post and story images
      const [postUrl, storyUrl] = await Promise.all([
        generateInstagramShareImage(text, assistantType, "post"),
        generateInstagramShareImage(text, assistantType, "story"),
      ])

      setImageUrls({ post: postUrl, story: storyUrl })
    } catch (error) {
      toast({
        title: "Error generating images",
        description: "Failed to generate the share images. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading({ post: false, story: false })
    }
  }

  const handleDownload = async (format: "post" | "story") => {
    const imageUrl = imageUrls[format]
    if (!imageUrl) return

    try {
      const filename = `vinylverdict-${assistantType}-${format}.png`
      await downloadImage(imageUrl, filename)
      toast({
        title: "Image downloaded",
        description: `The ${format} image has been saved to your device. You can now share it on Instagram!`,
      })
    } catch (error) {
      toast({
        title: "Download failed",
        description: "Failed to download the image. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleCopyImage = async (format: "post" | "story") => {
    const imageUrl = imageUrls[format]
    if (!imageUrl) return

    try {
      await copyImageToClipboard(imageUrl)
      toast({
        title: "Image copied to clipboard",
        description: `The ${format} image has been copied. You can now paste it directly into Instagram!`,
      })
    } catch (error) {
      // Fallback to download if clipboard doesn't work
      handleDownload(format)
    }
  }

  const handleOpenInstagram = (format: "post" | "story") => {
    if (format === "story") {
      openInstagramStories()
    } else {
      openInstagramCamera()
    }
  }

  const renderTabContent = (format: "post" | "story") => {
    const imageUrl = imageUrls[format]
    const loading = isLoading[format]
    const dimensions = format === "post" ? "1200x630" : "1080x1920"
    const aspectRatio = format === "post" ? "1200/630" : "1080/1920"

    return (
      <div className="space-y-4">
        {/* Preview Image */}
        {imageUrl && (
          <div className="relative">
            <img
              src={imageUrl || "/placeholder.svg"}
              alt={`${format} preview`}
              className="w-full rounded-lg border border-zinc-700 max-h-96 object-contain"
              style={{ aspectRatio }}
            />
            <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">{dimensions}</div>
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
            <span className="ml-2 text-zinc-400">Generating {format} image...</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-1 gap-3">
          {/* Copy to Clipboard (Primary action) */}
          <Button
            onClick={() => handleCopyImage(format)}
            disabled={!imageUrl || loading}
            className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-medium"
          >
            <Copy className="mr-2 h-4 w-4" />
            Copy {format === "story" ? "Story" : "Post"} & Open Instagram
          </Button>

          {/* Download Image */}
          <Button
            onClick={() => handleDownload(format)}
            disabled={!imageUrl || loading}
            variant="outline"
            className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
          >
            <Download className="mr-2 h-4 w-4" />
            Download {format === "story" ? "Story" : "Post"} Image
          </Button>

          {/* Open Instagram */}
          <Button
            onClick={() => handleOpenInstagram(format)}
            variant="outline"
            className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
          >
            <Smartphone className="mr-2 h-4 w-4" />
            Open Instagram {format === "story" ? "Stories" : "Camera"}
          </Button>
        </div>

        {/* Instructions */}
        <div className="bg-zinc-800 rounded-lg p-4 space-y-2">
          <h4 className="font-medium text-white text-sm">
            How to share to Instagram {format === "story" ? "Stories" : "Posts"}:
          </h4>
          <ol className="text-xs text-zinc-400 space-y-1 list-decimal list-inside">
            <li>Click "Copy {format === "story" ? "Story" : "Post"} & Open Instagram" to copy the image</li>
            <li>Instagram will open automatically</li>
            {format === "story" ? (
              <>
                <li>Tap the camera icon or swipe right to create a story</li>
                <li>Tap the gallery icon and paste or select the image</li>
                <li>Add stickers, text, or music if desired</li>
                <li>Share to your story!</li>
              </>
            ) : (
              <>
                <li>Tap the + icon to create a new post</li>
                <li>Select the image from your gallery or paste it</li>
                <li>Add filters, captions, and tags</li>
                <li>Share your post!</li>
              </>
            )}
          </ol>
          <p className="text-xs text-zinc-500 mt-2">
            {format === "story"
              ? "Stories are optimized for mobile viewing (1080x1920px)"
              : "Posts work great on all devices (1200x630px)"}
          </p>
        </div>
      </div>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg bg-zinc-900 border-zinc-800 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-white">
            <Instagram className="h-5 w-5 text-pink-500" />
            Share to Instagram
          </DialogTitle>
          <DialogDescription className="text-zinc-400">
            Choose between Instagram Posts or Stories format
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-zinc-800">
            <TabsTrigger value="post" className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4" />
              Post
            </TabsTrigger>
            <TabsTrigger value="story" className="flex items-center gap-2">
              <Video className="h-4 w-4" />
              Story
            </TabsTrigger>
          </TabsList>

          <TabsContent value="post" className="mt-4">
            {renderTabContent("post")}
          </TabsContent>

          <TabsContent value="story" className="mt-4">
            {renderTabContent("story")}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
