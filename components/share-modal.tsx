"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { Facebook, Instagram, Mail, Copy, Share2, Linkedin, X, Share, Download } from "lucide-react"
import { generateShareImageUrl, copyImageToClipboard, downloadImage, openSocialApp } from "@/lib/static-image-generator"

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
}

export function ShareModal({ isOpen, onClose, text, assistantType, onShare }: ShareModalProps) {
  const [imageUrl, setImageUrl] = useState<string>("")
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null)
  const [imageLoaded, setImageLoaded] = useState(false)

  useEffect(() => {
    if (isOpen) {
      const url = generateShareImageUrl(text, assistantType)
      setImageUrl(url)
      setImageLoaded(false)
    }
  }, [isOpen, text, assistantType])

  const shareOptions: ShareOption[] = [
    {
      id: "twitter",
      name: "Twitter",
      icon: <X className="h-6 w-6" />,
      color: "bg-black hover:bg-zinc-800",
      description: "Share to Twitter",
    },
    {
      id: "facebook",
      name: "Facebook",
      icon: <Facebook className="h-6 w-6" />,
      color: "bg-[#1877F2] hover:bg-[#0e6ae4]",
      description: "Share to Facebook Stories",
    },
    {
      id: "instagram",
      name: "Instagram",
      icon: <Instagram className="h-6 w-6" />,
      color: "bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] hover:opacity-90",
      description: "Share to Instagram Stories",
    },
    {
      id: "linkedin",
      name: "LinkedIn",
      icon: <Linkedin className="h-6 w-6" />,
      color: "bg-[#0077B5] hover:bg-[#006399]",
      description: "Share to LinkedIn",
    },
    {
      id: "email",
      name: "Email",
      icon: <Mail className="h-6 w-6" />,
      color: "bg-[#D44638] hover:bg-[#c13e31]",
      description: "Share via Email",
    },
    {
      id: "copy",
      name: "Copy Link",
      icon: <Copy className="h-6 w-6" />,
      color: "bg-zinc-700 hover:bg-zinc-600",
      description: "Copy link to clipboard",
    },
    {
      id: "share",
      name: "Share...",
      icon: <Share2 className="h-6 w-6" />,
      color: "bg-purple-600 hover:bg-purple-700",
      description: "Use native share menu",
    },
  ]

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

  const handleShareClick = (option: ShareOption) => {
    // Handle special cases that don't need image preview
    if (option.id === "email") {
      const subject = "My Music Taste Verdict from VinylVerdict.fm"
      const body = `Check out my music taste verdict:\n\n${text}\n\nGet your own at vinylverdict.fm`
      window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`)
      onClose()
      return
    }

    if (option.id === "copy") {
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin
      const shareUrl = `${appUrl}/share?text=${encodeURIComponent(text.substring(0, 200))}&type=${assistantType}`
      navigator.clipboard.writeText(shareUrl)
      toast({
        title: "Link copied",
        description: "Share link has been copied to clipboard!",
      })
      onClose()
      return
    }

    if (option.id === "share" && navigator.share) {
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin
      const shareUrl = `${appUrl}/share?text=${encodeURIComponent(text.substring(0, 200))}&type=${assistantType}`
      navigator.share({
        title: "My Music Taste Verdict",
        text: "Check out my music taste verdict!",
        url: shareUrl,
      })
      onClose()
      return
    }

    // For all other platforms, show the Instagram-style preview
    setSelectedPlatform(option.id)
  }

  const handleShareAfterPreview = async () => {
    if (!selectedPlatform) return

    try {
      await copyImageToClipboard(imageUrl)
      openSocialApp(selectedPlatform)

      const platform = shareOptions.find((opt) => opt.id === selectedPlatform)
      toast({
        title: "Image copied",
        description: `The image has been copied. You can now paste it into ${platform?.name}!`,
      })

      onClose()
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

          <div className="relative mx-auto max-w-[240px]">
            {!imageLoaded && (
              <div className="absolute inset-0 aspect-[9/16] bg-zinc-800 rounded-lg flex items-center justify-center z-10">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
              </div>
            )}
            <img
              src={imageUrl || "/placeholder.svg"}
              alt={`${platform.name} preview`}
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

          <div className="space-y-2">
            <Button
              onClick={handleShareAfterPreview}
              disabled={!imageLoaded}
              className={`w-full text-white font-medium ${platform.color.replace("hover:", "")}`}
            >
              <Share className="mr-2 h-4 w-4" />
              Share to {platform.name}
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

      {selectedPlatform && renderPreview()}
    </>
  )
}
