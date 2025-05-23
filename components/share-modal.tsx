"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { Facebook, Instagram, Mail, Copy, Share2, Linkedin, X, Share, MessageCircle } from "lucide-react"
import { generateShareImageUrl, copyImageToClipboard, openSocialApp } from "@/lib/static-image-generator"

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

const loadingMessages = [
  "Generating your image...",
  "Making it look perfect...",
  "Adding some vinyl magic...",
  "Preparing your share...",
  "Almost ready...",
  "Finalizing your verdict...",
  "Crafting your story...",
]

export function ShareModal({ isOpen, onClose, text, assistantType, onShare }: ShareModalProps) {
  const [imageUrl, setImageUrl] = useState<string>("")
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [showingImage, setShowingImage] = useState(false)
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0)
  const [pollingAttempts, setPollingAttempts] = useState(0)
  const loadingIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const imgRef = useRef<HTMLImageElement>(null)

  // Maximum number of polling attempts (30 attempts * 1 second = 30 seconds max wait time)
  const MAX_POLLING_ATTEMPTS = 30

  useEffect(() => {
    if (isOpen) {
      // Reset states
      setImageLoaded(false)
      setShowingImage(false)
      setPollingAttempts(0)

      // Generate image URL with timestamp to prevent caching
      const url = generateShareImageUrl(text, assistantType)
      setImageUrl(url)

      // Start cycling through loading messages
      setLoadingMessageIndex(0)
      if (loadingIntervalRef.current) {
        clearInterval(loadingIntervalRef.current)
      }

      loadingIntervalRef.current = setInterval(() => {
        setLoadingMessageIndex((prev) => (prev + 1) % loadingMessages.length)
      }, 2000)

      // Start polling to check if image is ready
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current)
      }

      pollingIntervalRef.current = setInterval(() => {
        checkImageAvailability(url)
      }, 1000) // Poll every second
    }

    return () => {
      // Clean up intervals
      if (loadingIntervalRef.current) {
        clearInterval(loadingIntervalRef.current)
      }
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current)
      }
    }
  }, [isOpen, text, assistantType])

  // Function to check if the image is available
  const checkImageAvailability = async (url: string) => {
    try {
      // Increment polling attempts
      setPollingAttempts((prev) => {
        const newAttempts = prev + 1

        // If we've reached max attempts, stop polling and show error
        if (newAttempts >= MAX_POLLING_ATTEMPTS && pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current)
          toast({
            title: "Image generation timeout",
            description: "The image is taking longer than expected. Please try again.",
            variant: "destructive",
          })
        }
        return newAttempts
      })

      // Make a HEAD request to check if the image exists
      const response = await fetch(url, { method: "HEAD" })

      if (response.ok) {
        // Image is ready, stop polling
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current)
        }

        setImageLoaded(true)

        // Add 1 second delay before showing the image
        setTimeout(() => {
          setShowingImage(true)
        }, 1000)
      }
    } catch (error) {
      console.error("Error checking image availability:", error)
    }
  }

  // Clear intervals when image is showing
  useEffect(() => {
    if (showingImage) {
      if (loadingIntervalRef.current) {
        clearInterval(loadingIntervalRef.current)
      }
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current)
      }
    }
  }, [showingImage])

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
      color: "bg-[#1877F2] hover:bg-[#166fe5]",
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
      id: "whatsapp",
      name: "WhatsApp",
      icon: (
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.785" />
        </svg>
      ),
      color: "bg-[#25D366] hover:bg-[#22c55e]",
      description: "Share to WhatsApp",
    },
    {
      id: "linkedin",
      name: "LinkedIn",
      icon: <Linkedin className="h-6 w-6" />,
      color: "bg-[#0077B5] hover:bg-[#006399]",
      description: "Share to LinkedIn",
    },
    {
      id: "messages",
      name: "Messages",
      icon: <MessageCircle className="h-6 w-6" />,
      color: "bg-[#007AFF] hover:bg-[#0056CC]",
      description: "Share via Messages",
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

    if (option.id === "messages") {
      const shareText = `Check out my music taste verdict from VinylVerdict.fm!\n\n${text.substring(0, 100)}...\n\nGet yours at vinylverdict.fm`
      const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)

      if (isMobile) {
        window.open(`sms:?body=${encodeURIComponent(shareText)}`, "_blank")
      } else {
        navigator.clipboard.writeText(shareText)
        toast({
          title: "Text copied",
          description: "Message text has been copied to clipboard!",
        })
      }
      onClose()
      return
    }

    // For all other platforms, show the preview with image
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

  const renderPreview = () => {
    if (!selectedPlatform) return null

    const platform = shareOptions.find((opt) => opt.id === selectedPlatform)
    if (!platform) return null

    return (
      <Dialog open={!!selectedPlatform} onOpenChange={() => setSelectedPlatform(null)}>
        <DialogContent className="sm:max-w-md bg-zinc-900 border-zinc-800">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full ${platform.color} flex items-center justify-center text-white`}>
                {platform.icon}
              </div>
              <DialogTitle className="text-white">Share to {platform.name}</DialogTitle>
            </div>
          </DialogHeader>

          <div className="relative mx-auto w-full" style={{ maxWidth: "280px" }}>
            {!showingImage ? (
              <div className="aspect-[9/16] bg-zinc-800 rounded-lg flex flex-col items-center justify-center p-4 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mb-4"></div>
                <p className="text-purple-300 font-medium text-lg">{loadingMessages[loadingMessageIndex]}</p>
                <p className="text-zinc-400 text-sm mt-2">This may take a few moments</p>
              </div>
            ) : (
              <div className="relative">
                <img
                  ref={imgRef}
                  src={`${imageUrl}&cache=${Date.now()}`}
                  alt={`${platform.name} preview`}
                  className="w-full rounded-lg border border-zinc-700 object-contain"
                  style={{ aspectRatio: "9/16" }}
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
            )}
          </div>

          <div className="space-y-2 mt-2">
            <Button
              onClick={handleShareAfterPreview}
              disabled={!showingImage}
              className={`w-full text-white font-medium ${platform.color.replace("hover:", "")}`}
            >
              <Share className="mr-2 h-4 w-4" />
              Share to {platform.name}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  useEffect(() => {
    if (selectedPlatform) {
      setShowingImage(false)
      // Add 1 second delay even if image is already loaded
      setTimeout(() => {
        setShowingImage(true)
      }, 1000)
    }
  }, [selectedPlatform])

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

          <div className="grid grid-cols-3 gap-3 py-4">
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

      {renderPreview()}
    </>
  )
}
