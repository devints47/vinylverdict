"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { Facebook, Instagram, Mail, Copy, Share2, Linkedin, MessageCircle, X, Share } from "lucide-react"
import { generateSocialImage, copyImageToClipboard, openSocialApp } from "@/lib/social-image-generator"

interface ShareModalProps {
  isOpen: boolean
  onClose: () => void
  text: string
  assistantType: string
  onShare: (platform: string) => void
}

interface ShareOption {
  id: string
  name: string
  icon: React.ReactNode
  color: string
  description: string
  needsPreview: boolean
}

export function ShareModal({ isOpen, onClose, text, assistantType, onShare }: ShareModalProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null)

  // Define all share options with their respective colors and icons
  const shareOptions: ShareOption[] = [
    {
      id: "twitter",
      name: "Twitter",
      icon: <X className="h-6 w-6" />,
      color: "bg-black hover:bg-zinc-800",
      description: "Share to Twitter",
      needsPreview: true,
    },
    {
      id: "facebook",
      name: "Facebook",
      icon: <Facebook className="h-6 w-6" />,
      color: "bg-[#1877F2] hover:bg-[#0e6ae4]",
      description: "Share to Facebook Stories",
      needsPreview: true,
    },
    {
      id: "instagram",
      name: "Instagram",
      icon: <Instagram className="h-6 w-6" />,
      color: "bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] hover:opacity-90",
      description: "Share to Instagram Stories",
      needsPreview: false, // Instagram has its own modal with preview
    },
    {
      id: "linkedin",
      name: "LinkedIn",
      icon: <Linkedin className="h-6 w-6" />,
      color: "bg-[#0077B5] hover:bg-[#006399]",
      description: "Share to LinkedIn",
      needsPreview: true,
    },
    {
      id: "email",
      name: "Email",
      icon: <Mail className="h-6 w-6" />,
      color: "bg-[#D44638] hover:bg-[#c13e31]",
      description: "Share via Email",
      needsPreview: true,
    },
    {
      id: "sms",
      name: "SMS",
      icon: <MessageCircle className="h-6 w-6" />,
      color: "bg-[#25D366] hover:bg-[#20bd5a]",
      description: "Share via SMS",
      needsPreview: true,
    },
    {
      id: "copy",
      name: "Copy Link",
      icon: <Copy className="h-6 w-6" />,
      color: "bg-zinc-700 hover:bg-zinc-600",
      description: "Copy link to clipboard",
      needsPreview: true,
    },
    {
      id: "share",
      name: "Share...",
      icon: <Share2 className="h-6 w-6" />,
      color: "bg-purple-600 hover:bg-purple-700",
      description: "Use native share menu",
      needsPreview: false,
    },
  ]

  // Generate the image when the modal opens
  useEffect(() => {
    if (isOpen) {
      generateImage()
    }
  }, [isOpen])

  const generateImage = async () => {
    try {
      setIsLoading(true)

      // Generate a story image for all platforms
      const storyUrl = await generateSocialImage({
        text,
        assistantType,
        format: "story",
      })

      setImageUrl(storyUrl)
    } catch (error) {
      console.error("Error generating social image:", error)
      toast({
        title: "Error generating image",
        description: "Failed to generate the share image. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Get the appropriate title based on the assistant type
  const getShareTitle = () => {
    switch (assistantType) {
      case "worshipper":
        return "Share Your Validation"
      case "historian":
        return "Share Your Analysis"
      case "snob":
      default:
        return "Share Your Roast"
    }
  }

  // Handle native share if available
  const handleNativeShare = async () => {
    try {
      // Get the app URL from environment variable or use a default
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin
      const shareText = encodeURIComponent(text.substring(0, 200))
      const shareUrl = `${appUrl}/share?text=${shareText}&type=${assistantType}`

      if (navigator.share) {
        await navigator.share({
          title: "My Music Taste Verdict from VinylVerdict.fm",
          text: "Check out my music taste verdict!",
          url: shareUrl,
        })
        toast({
          title: "Shared successfully",
          description: "Your verdict has been shared!",
        })
      } else {
        // Fallback to copy link
        onShare("copy")
      }
    } catch (error) {
      console.error("Error with native sharing:", error)
      toast({
        title: "Sharing failed",
        description: "There was an error sharing. Please try another method.",
        variant: "destructive",
      })
    }
  }

  // Handle click on a share option
  const handleShareClick = (option: ShareOption) => {
    if (option.id === "share") {
      handleNativeShare()
      onClose()
    } else if (option.id === "instagram") {
      onShare(option.id)
      // Don't close the modal for Instagram since it opens another modal
    } else if (option.needsPreview) {
      // Show the preview for this platform
      setSelectedPlatform(option.id)
    } else {
      onShare(option.id)
      onClose()
    }
  }

  // Handle share after preview
  const handleShareAfterPreview = async () => {
    if (!selectedPlatform || !imageUrl) return

    try {
      // For platforms that need the image copied
      if (["twitter", "facebook", "linkedin"].includes(selectedPlatform)) {
        await copyImageToClipboard(imageUrl)
        openSocialApp(selectedPlatform)
      } else if (selectedPlatform === "copy") {
        // For copy link, just copy the URL
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin
        const shareUrl = `${appUrl}/share?text=${encodeURIComponent(text.substring(0, 200))}&type=${assistantType}`
        await navigator.clipboard.writeText(shareUrl)
        toast({
          title: "Link copied",
          description: "Share link has been copied to clipboard!",
        })
      } else {
        // For other platforms, just call the onShare handler
        onShare(selectedPlatform)
      }

      // Close the modal
      onClose()
    } catch (error) {
      console.error("Error sharing:", error)
      toast({
        title: "Sharing failed",
        description: "There was an error sharing. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Render the preview section
  const renderPreview = () => {
    if (!selectedPlatform) return null

    const platform = shareOptions.find((opt) => opt.id === selectedPlatform)
    if (!platform) return null

    return (
      <div className="fixed inset-0 bg-black/80 z-50 flex flex-col items-center justify-center p-4">
        <div className="bg-zinc-900 rounded-lg max-w-md w-full p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full ${platform.color} flex items-center justify-center text-white`}>
                {platform.icon}
              </div>
              <h3 className="text-lg font-medium text-white">Share to {platform.name}</h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedPlatform(null)}
              className="text-zinc-400 hover:text-white"
            >
              Back
            </Button>
          </div>

          {/* Preview Image */}
          <div className="relative mx-auto max-w-[240px]">
            {isLoading ? (
              <div className="aspect-[9/16] bg-zinc-800 rounded-lg flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
              </div>
            ) : imageUrl ? (
              <img
                src={imageUrl || "/placeholder.svg"}
                alt={`${platform.name} preview`}
                className="w-full rounded-lg border border-zinc-700 object-contain"
                style={{ aspectRatio: "9/16" }}
              />
            ) : (
              <div className="aspect-[9/16] bg-zinc-800 rounded-lg flex items-center justify-center">
                <span className="text-zinc-400">Preview unavailable</span>
              </div>
            )}
            <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">1080×1920</div>
          </div>

          {/* Share Button */}
          <Button
            onClick={handleShareAfterPreview}
            disabled={!imageUrl || isLoading}
            className={`w-full text-white font-medium ${platform.color.replace("hover:", "")}`}
          >
            <Share className="mr-2 h-4 w-4" />
            Share to {platform.name}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md bg-zinc-900 border-zinc-800">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-white">
              <Share2 className="h-5 w-5 text-purple-500" />
              {getShareTitle()}
            </DialogTitle>
            <DialogDescription className="text-zinc-400">
              Choose how you want to share your music verdict
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-4 gap-3 py-4">
            {shareOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => handleShareClick(option)}
                className="flex flex-col items-center justify-center gap-2 p-3 rounded-lg transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
                aria-label={option.description}
              >
                <div className={`w-12 h-12 rounded-full ${option.color} flex items-center justify-center text-white`}>
                  {option.icon}
                </div>
                <span className="text-xs text-zinc-300 text-center">{option.name}</span>
              </button>
            ))}
          </div>

          <div className="mt-2 pt-2 border-t border-zinc-800">
            <div className="flex justify-between items-center">
              <div className="text-xs text-zinc-500">Sharing helps spread the word about VinylVerdict.fm</div>
              <Button
                variant="outline"
                size="sm"
                onClick={onClose}
                className="text-zinc-400 hover:text-white border-zinc-700 hover:bg-zinc-800"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Preview overlay */}
      {selectedPlatform && renderPreview()}
    </>
  )
}
