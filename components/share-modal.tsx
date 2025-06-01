"use client"

import { useState, useEffect, useRef } from "react"
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { Mail, Copy, Share2, Share, Download } from "lucide-react"
import { VinylRecord } from "@/components/vinyl-record"

interface ShareModalProps {
  isOpen: boolean
  onClose: () => void
  text: string
  assistantType: string
  onShare: (platform: string) => void
}

const loadingMessages = [
  "Spinning up the turntables...",
  "Adding vinyl magic...",
  "Crafting your verdict...", 
  "Mixing the perfect roast...",
  "Dropping the needle...",
  "Finalizing your story...",
  "Almost ready to drop...",
]

export function ShareModal({ isOpen, onClose, text, assistantType, onShare }: ShareModalProps) {
  const [imageUrl, setImageUrl] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0)
  const [userProfile, setUserProfile] = useState<any>(null)
  const [isSendingEmail, setIsSendingEmail] = useState(false)
  const [supportsNativeShare, setSupportsNativeShare] = useState(false)
  const [showCopiedFeedback, setShowCopiedFeedback] = useState(false)
  const [showCopiedText, setShowCopiedText] = useState(false)
  const [notifications, setNotifications] = useState<{[key: string]: boolean}>({})
  const [isClient, setIsClient] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const loadingIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const [imageLoading, setImageLoading] = useState(true)

  // Fixed dimensions for consistent modal sizing
  const MODAL_DIMENSIONS = {
    width: 340, // Width of content area
    height: 453, // Height of content area based on 3:4 aspect ratio
    padding: 24, // Padding around content area
    get totalHeight() { return this.height + this.padding * 2 } // Total height including padding
  }

  // Fixed dimensions matching the loading preview - adjusted for mobile
  const PREVIEW_DIMENSIONS = {
    width: 340, // Reduced from 385 to fit better in smaller modal
    aspectRatio: 3/4, // aspect-[3/4] from loading preview
    get height() { return (this.width / this.aspectRatio) } // Calculate height from aspect ratio
  }

  // Detect Web Share API support on client side only to avoid hydration errors
  useEffect(() => {
    setIsClient(true)
    
    // Detect mobile devices
    const checkIsMobile = () => {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
             window.innerWidth <= 768
    }
    setIsMobile(checkIsMobile())
    
    // Check if the browser supports the Web Share API with file sharing
    const hasWebShareAPI = 'share' in navigator && 'canShare' in navigator
    setSupportsNativeShare(hasWebShareAPI)
  }, [])

  // Fetch user profile when modal opens
  useEffect(() => {
    if (isOpen) {
      const fetchProfile = async () => {
        try {
          const response = await fetch("/api/auth/me")
          if (!response.ok) return
          const data = await response.json()
          setUserProfile(data)
        } catch (err) {
          // Continue without profile data
        }
      }
      fetchProfile()
    }
  }, [isOpen])

  useEffect(() => {
    if (isOpen) {
      // Reset states
      setImageUrl("")
      setIsLoading(true)
      setIsSendingEmail(false)
      setShowCopiedFeedback(false)
      setShowCopiedText(false)
      setNotifications({})

      // Start cycling through loading messages
      setLoadingMessageIndex(0)
      if (loadingIntervalRef.current) {
        clearInterval(loadingIntervalRef.current)
      }

      loadingIntervalRef.current = setInterval(() => {
        setLoadingMessageIndex((prev) => (prev + 1) % loadingMessages.length)
      }, 2000)

      // Generate image using server-side API
      const generateServerSideImage = async () => {
        try {
          // Reset image loading state
          setImageLoading(true)
          
          // Get username from profile
          const username = userProfile?.display_name || userProfile?.id || "Your Music"

          // Create URL parameters for the server-side image generation
          const params = new URLSearchParams({
            text: text, // Send raw markdown text
            type: assistantType,
            username: username
          })

          // Call the server-side image generation API
          const imageApiUrl = `/api/share-image?${params.toString()}`
          
          // Simple approach: just set the URL and let the image load naturally
          setImageUrl(imageApiUrl)
          
          // Stop loading after a reasonable delay to let the image load
          setTimeout(() => {
            setIsLoading(false)
            if (loadingIntervalRef.current) {
              clearInterval(loadingIntervalRef.current)
            }
          }, 3000)
          
        } catch (error) {
          console.error('Error generating share image:', error)
          setIsLoading(false)
          if (loadingIntervalRef.current) {
            clearInterval(loadingIntervalRef.current)
          }
          toast({
            title: "Image generation failed",
            description: "Could not generate share image. Please try again.",
            variant: "destructive",
          })
        }
      }

      // Add a small delay to ensure user profile is loaded, then start generation
      setTimeout(generateServerSideImage, 500)
    }

    return () => {
      if (loadingIntervalRef.current) {
        clearInterval(loadingIntervalRef.current)
      }
    }
  }, [isOpen, text, assistantType, userProfile])

  // Helper function to show temporary notifications
  const showNotification = (key: string, duration: number = 3000) => {
    setNotifications(prev => ({ ...prev, [key]: true }))
    setTimeout(() => {
      setNotifications(prev => ({ ...prev, [key]: false }))
    }, duration)
  }

  // Helper function to show instant notifications (no delay)
  const showInstantNotification = (key: string, duration: number = 3000) => {
    // Use requestAnimationFrame to ensure immediate update
    requestAnimationFrame(() => {
      setNotifications(prev => ({ ...prev, [key]: true }))
      setTimeout(() => {
        setNotifications(prev => ({ ...prev, [key]: false }))
      }, duration)
    })
  }

  const getPersonalityName = (type: string): string => {
    switch (type) {
      case "worshipper":
        return "The Taste Validator"
      case "historian":
        return "The Music Historian"
      case "therapist":
        return "The Armchair Therapist"
      case "snob":
      default:
        return "The Music Snob"
    }
  }

  const copyImageToClipboard = async (imageUrl: string): Promise<void> => {
    try {
      if (!navigator.clipboard || !navigator.clipboard.write) {
        throw new Error("Clipboard API not supported")
      }

      const response = await fetch(imageUrl)
      if (!response.ok) {
        throw new Error("Failed to fetch image")
      }
      
      const blob = await response.blob()

      // Ensure we have a PNG blob for clipboard compatibility
      let finalBlob = blob
      if (blob.type !== "image/png") {
        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d")
        const img = new Image()
        
        img.crossOrigin = "anonymous"

        await new Promise((resolve, reject) => {
          img.onload = () => {
            canvas.width = img.width
            canvas.height = img.height
            ctx?.drawImage(img, 0, 0)
            canvas.toBlob((pngBlob) => {
              if (pngBlob) {
                finalBlob = pngBlob
                resolve(pngBlob)
              } else {
                reject(new Error("Failed to convert image to PNG"))
              }
            }, "image/png")
          }
          img.onerror = () => reject(new Error("Failed to load image"))
          img.src = imageUrl
        })
      }

      const item = new ClipboardItem({ [finalBlob.type]: finalBlob })
      await navigator.clipboard.write([item])
    } catch (error) {
      throw new Error("Failed to copy image to clipboard")
    }
  }

  const downloadImage = async (imageUrl: string, filename: string): Promise<void> => {
    try {
      const response = await fetch(imageUrl)
      if (!response.ok) {
        throw new Error("Failed to fetch image")
      }
      
      const blob = await response.blob()
      const blobUrl = URL.createObjectURL(blob)
      
      const link = document.createElement("a")
      link.href = blobUrl
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      URL.revokeObjectURL(blobUrl)
    } catch (error) {
      throw new Error("Failed to download image")
    }
  }

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

  const handleCopyToClipboard = async () => {
    if (!imageUrl) return

    try {
      showInstantNotification('copy')
      await copyImageToClipboard(imageUrl)
      // Don't close modal - let user continue sharing
    } catch (error) {
      console.error('Copy failed:', error)
      // Hide the notification if copy failed
      setNotifications(prev => ({ ...prev, copy: false }))
      toast({
        title: "Copy failed",
        description: "Could not copy image to clipboard. Please try downloading instead.",
        variant: "destructive",
      })
    }
  }

  const handleImageClick = async () => {
    if (!imageUrl) return

    // Show feedback immediately when clicked (before clipboard operation)
    setShowCopiedFeedback(true)
    setShowCopiedText(true)
    showInstantNotification('imageClick', 1500)

    try {
      // Copy to clipboard (async operation happens after feedback is shown)
      await copyImageToClipboard(imageUrl)
      
      // Reset both feedbacks after their respective durations
      setTimeout(() => setShowCopiedFeedback(false), 1500)
      setTimeout(() => setShowCopiedText(false), 2000)
      
    } catch (error) {
      console.error('Copy failed:', error)
      // Hide the notification if copy failed
      setNotifications(prev => ({ ...prev, imageClick: false }))
      setShowCopiedText(false)
      setShowCopiedFeedback(false)
      toast({
        title: "Copy failed",
        description: "Could not copy image to clipboard. Please try the copy button instead.",
        variant: "destructive",
      })
    }
  }

  const handleNativeShare = async () => {
    if (!imageUrl) return

    try {
      const response = await fetch(imageUrl)
      if (!response.ok) {
        throw new Error("Failed to fetch image")
      }
      
      const blob = await response.blob()
      const file = new File([blob], `vinylverdict-${assistantType}-${Date.now()}.png`, { type: "image/png" })

      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: "My Music Taste Verdict",
          text: "Check out my music taste verdict from VinylVerdict.fm!",
          files: [file],
        })
      } else if (navigator.share) {
        await navigator.share({
          title: "My Music Taste Verdict",
          text: "Check out my music taste verdict from VinylVerdict.fm!",
          url: window.location.origin,
        })
      } else {
        toast({
          title: "Share not available",
          description: "Native sharing is not supported on this device.",
          variant: "destructive",
        })
      }
    } catch (error) {
      if (error instanceof Error && error.name !== "AbortError") {
        console.error('Native share error:', error)
        toast({
          title: "Share failed",
          description: "Could not share the image. Please try copying or downloading instead.",
          variant: "destructive",
        })
      }
    }
  }

  const handleSendEmail = async () => {
    if (!userProfile) {
      toast({
        title: "Profile not loaded",
        description: "Please wait for your profile to load before sending email.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSendingEmail(true)

      const response = await fetch("/api/send-verdict-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          verdictText: text,
          assistantType: assistantType,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to send email")
      }

      const result = await response.json()
      showInstantNotification('email')
      // Don't close modal - let user continue sharing

    } catch (error) {
      toast({
        title: "Email failed",
        description: error instanceof Error ? error.message : "Could not send email. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSendingEmail(false)
    }
  }

  const handleDownloadImage = async () => {
    if (!imageUrl) return

    try {
      const filename = `vinylverdict-${assistantType}-${Date.now()}.png`
      showInstantNotification('download')
      await downloadImage(imageUrl, filename)
      // Don't close modal - let user continue sharing
    } catch (error) {
      console.error('Download failed:', error)
      // Hide the notification if download failed
      setNotifications(prev => ({ ...prev, download: false }))
      toast({
        title: "Download failed",
        description: "Could not download image. Please try copying to clipboard instead.",
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="w-[95vw] max-w-[450px] h-auto bg-zinc-900 border-zinc-800 p-3 sm:p-4 md:p-6 [&_button.absolute.right-4.top-4]:hidden"
        style={{
          minHeight: `${MODAL_DIMENSIONS.totalHeight + 150}px` // Add extra height for header, footer, and buttons
        }}
      >
        <DialogTitle className="sr-only">
          {getShareTitle()}
        </DialogTitle>
        
        <DialogDescription className="sr-only">
          Share your music taste verdict as an image. You can email, copy to clipboard, or download the image.
        </DialogDescription>
        
        {/* Custom purple X button - positioned like the default but styled purple */}
        <button
          onClick={onClose}
          className="absolute right-3 top-3 sm:right-4 sm:top-4 w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-purple-600/20 hover:bg-purple-600/40 border border-purple-500/30 hover:border-purple-400 flex items-center justify-center transition-all duration-200 hover:scale-105 group z-10"
          aria-label="Close share modal"
        >
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5 text-white group-hover:text-white transition-colors"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        {/* Header */}
        <div className="flex items-center justify-center gap-2 text-white mb-3 sm:mb-4">
          <Share2 className="h-4 w-4 mt-2 sm:h-5 sm:w-5 text-purple-500" />
          <span className="text-sm sm:text-base mt-2">{getShareTitle()}</span>
        </div>

        {/* Main content area */}
        <div className="flex items-center justify-center mb-3 sm:mb-4">
          <div className="w-full max-w-full">
            <div 
              className="w-full mx-auto relative rounded-lg overflow-hidden"
              style={{
                maxWidth: `${MODAL_DIMENSIONS.width}px`,
                height: `${MODAL_DIMENSIONS.height}px`,
                minHeight: `${MODAL_DIMENSIONS.height}px`,
                backgroundColor: 'rgb(24, 24, 27)' // bg-zinc-900 equivalent
              }}
            >
              {isLoading ? (
                // Loading state with fancy vinyl spinner
                <div className="absolute inset-0 bg-zinc-900 rounded-lg flex flex-col items-center justify-center p-4 sm:p-6 text-center">
                  {/* Fancy Vinyl Spinner */}
                  <div className="relative mb-4 sm:mb-6">
                    <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-44 md:h-44">
                      <VinylRecord />
                    </div>
                  </div>
                  
                  <p className="text-purple-300 font-medium text-sm sm:text-base md:text-lg mb-1 sm:mb-2">{loadingMessages[loadingMessageIndex]}</p>
                  <p className="text-zinc-400 text-xs sm:text-sm">Creating your vinyl verdict...</p>
                </div>
              ) : (
                // Final image state
                <div className="absolute inset-0">
                  <div className="relative w-full h-full">
                    {/* Loading overlay - shown until image is fully loaded with same styling as first loading state */}
                    {imageLoading && (
                      <div className="absolute inset-0 bg-zinc-900 rounded-lg flex flex-col items-center justify-center p-4 sm:p-6 text-center z-10">
                        {/* Fancy Vinyl Spinner - same size as first loading state */}
                        <div className="relative mb-4 sm:mb-6">
                          <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-44 md:h-44">
                            <VinylRecord />
                          </div>
                        </div>
                        
                        <p className="text-purple-300 font-medium text-sm sm:text-base md:text-lg mb-1 sm:mb-2">Almost ready to drop...</p>
                        <p className="text-zinc-400 text-xs sm:text-sm">Creating your vinyl verdict...</p>
                      </div>
                    )}
                    
                    {/* Image content - hidden until loaded to prevent flickering */}
                    {imageUrl && (
                      // Only apply mobile-specific logic after client hydration
                      !isClient ? (
                        // Server-side and pre-hydration: render desktop version to match initial render
                        <div
                          className={`relative cursor-pointer group w-full h-full transition-opacity duration-300 ${imageLoading ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                          onClick={() => copyImageToClipboard(imageUrl)}
                        >
                          <img
                            src={imageUrl}
                            alt="Generated verdict image"
                            className="w-full h-full object-contain rounded-lg transition-opacity group-hover:opacity-90"
                            style={{ aspectRatio: imageUrl ? 'auto' : '3/4', maxHeight: '60vh' }}
                            onLoad={() => setImageLoading(false)}
                          />
                          
                          {/* Hover overlay with copy instruction */}
                          <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg flex items-center justify-center">
                            <div className="text-white text-center">
                              <Copy className="h-8 w-8 mx-auto mb-2" />
                              <p className="text-sm font-medium">Click to copy</p>
                            </div>
                          </div>
                        </div>
                      ) : isMobile ? (
                        // Mobile: Show normal image without click/hover effects
                        <img
                          src={imageUrl}
                          alt="Generated verdict image"
                          className={`w-full h-full object-contain rounded-lg transition-opacity duration-300 ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
                          style={{ aspectRatio: 'auto', maxHeight: '60vh' }}
                          onLoad={() => setImageLoading(false)}
                        />
                      ) : (
                        // Desktop: Maintain existing click-to-copy behavior
                        <div
                          className={`relative cursor-pointer group w-full h-full transition-opacity duration-300 ${imageLoading ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                          onClick={() => copyImageToClipboard(imageUrl)}
                        >
                          <img
                            src={imageUrl}
                            alt="Generated verdict image"
                            className="w-full h-full object-contain rounded-lg transition-opacity group-hover:opacity-90"
                            style={{ aspectRatio: imageUrl ? 'auto' : '3/4', maxHeight: '60vh' }}
                            onLoad={() => setImageLoading(false)}
                          />
                          
                          {/* Hover overlay with copy instruction */}
                          <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg flex items-center justify-center">
                            <div className="text-white text-center">
                              <Copy className="h-8 w-8 mx-auto mb-2" />
                              <p className="text-sm font-medium">Click to copy</p>
                            </div>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer buttons */}
        <div className="space-y-2 sm:space-y-3">
          {/* Share button */}
          {isClient && supportsNativeShare && (
          <Button
            onClick={handleNativeShare}
              disabled={isLoading}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 h-10 sm:h-12 text-sm sm:text-base text-white font-medium relative overflow-hidden bg-purple-gradient hover:scale-105 transition-all duration-300 border-0 shadow-lg"
              aria-label="Share your verdict using device share menu"
          >
            <div className="absolute inset-0 holographic-shimmer"></div>
            <div className="relative z-10 flex items-center justify-center">
              <Share className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              Share Your Verdict
            </div>
          </Button>
        )}

          {/* Three buttons in a row */}
          <div className="flex gap-1.5 sm:gap-2 w-full">
            <div className="relative flex-1">
              <Button
                onClick={handleSendEmail}
                disabled={isLoading || isSendingEmail}
                variant="outline"
                className="w-full text-white border-zinc-700 hover:bg-zinc-800 text-xs sm:text-sm py-2 h-9 sm:h-10"
                aria-label="Send verdict via email"
              >
                {isSendingEmail ? (
                  <>
                    <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-white mr-1"></div>
                    <span className="hidden sm:inline">Sending...</span>
                    <span className="sm:hidden">...</span>
                  </>
                ) : (
                  <>
                    <Mail className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
                    Email
                  </>
                )}
              </Button>
              
              {/* Email notification */}
              {notifications.email && (
                <div className="absolute -top-8 sm:-top-10 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-2 sm:px-3 py-1 rounded-full text-xs font-medium animate-in fade-in-0 slide-in-from-bottom-2 duration-200 whitespace-nowrap">
                  ✓ Email sent!
                </div>
              )}
            </div>

            {/* Copy button - hidden on mobile after hydration */}
            <div className={`relative flex-1 ${isClient && isMobile ? 'hidden' : ''}`}>
              <Button
                onClick={handleCopyToClipboard}
                disabled={isLoading}
                variant="outline"
                className="w-full text-white border-zinc-700 hover:bg-zinc-800 text-xs sm:text-sm py-2 h-9 sm:h-10"
                aria-label="Copy verdict image to clipboard"
              >
                <Copy className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
                Copy
              </Button>
              
              {/* Copy notification */}
              {notifications.copy && (
                <div className="absolute -top-8 sm:-top-10 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-2 sm:px-3 py-1 rounded-full text-xs font-medium animate-in fade-in-0 slide-in-from-bottom-2 duration-200 whitespace-nowrap">
                  ✓ Copied to clipboard!
                </div>
              )}
            </div>

            <div className="relative flex-1">
              <Button
                onClick={handleDownloadImage}
                disabled={isLoading}
                variant="outline"
                className="w-full text-white border-zinc-700 hover:bg-zinc-800 text-xs sm:text-sm py-2 h-9 sm:h-10"
                aria-label="Save verdict image"
              >
                <Download className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
                Save
              </Button>
              
              {/* Download notification */}
              {notifications.download && (
                <div className="absolute -top-8 sm:-top-10 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-2 sm:px-3 py-1 rounded-full text-xs font-medium animate-in fade-in-0 slide-in-from-bottom-2 duration-200 whitespace-nowrap">
                  ✓ Downloaded!
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
