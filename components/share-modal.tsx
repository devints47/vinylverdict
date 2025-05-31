"use client"

import { useState, useEffect, useRef } from "react"
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { Mail, Copy, Share2, Share, Download } from "lucide-react"

interface ShareModalProps {
  isOpen: boolean
  onClose: () => void
  text: string
  assistantType: string
  onShare: (platform: string) => void
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
  const [showingImage, setShowingImage] = useState(false)
  const [imageFullyLoaded, setImageFullyLoaded] = useState(false)
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0)
  const [userProfile, setUserProfile] = useState<any>(null)
  const [isSendingEmail, setIsSendingEmail] = useState(false)
  const [supportsNativeShare, setSupportsNativeShare] = useState(false)
  const loadingIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const cleanupTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Detect Web Share API support on client side only to avoid hydration errors
  useEffect(() => {
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
      console.log("🔄 Modal opened, resetting states")
      setImageUrl("")
      setShowingImage(false)
      setImageFullyLoaded(false)
      setIsSendingEmail(false)

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
          
          // Create a new image element to preload the server-generated image
          const img = new Image()
          img.crossOrigin = "anonymous"
          
          // Wait for the image to load before showing it
          await new Promise((resolve, reject) => {
            img.onload = () => {
              console.log("✅ Preload image loaded successfully")
              setImageUrl(imageApiUrl)
              setShowingImage(true)
              
              // Add a small delay to ensure UI image renders properly, then mark as fully loaded
              setTimeout(() => {
                console.log("✅ UI image should be rendered now")
                setImageFullyLoaded(true)
                if (loadingIntervalRef.current) {
                  clearInterval(loadingIntervalRef.current)
                }
              }, 100)
              
              resolve(img)
            }
            img.onerror = () => {
              console.log("❌ Preload image failed to load")
              reject(new Error("Failed to load generated image"))
            }
            console.log("🔄 Starting preload of image:", imageApiUrl)
            img.src = imageApiUrl
          })
          
        } catch (error) {
          console.error('Error generating share image:', error)
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
      if (cleanupTimeoutRef.current) {
        clearTimeout(cleanupTimeoutRef.current)
      }
    }
  }, [isOpen, text, assistantType, userProfile])

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
      await copyImageToClipboard(imageUrl)
      toast({
        title: "Image copied!",
        description: "The verdict image has been copied to your clipboard.",
      })
      onClose()
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Could not copy image to clipboard. Please try downloading instead.",
        variant: "destructive",
      })
    }
  }

  const handleImageClick = async () => {
    if (!imageUrl) return

    try {
      await copyImageToClipboard(imageUrl)
      toast({
        title: "Image copied!",
        description: "Clicked to copy! The image has been copied to your clipboard.",
      })
    } catch (error) {
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

      toast({
        title: "Email sent!",
        description: `Your verdict has been sent to ${result.email}`,
      })

      onClose()
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
      await downloadImage(imageUrl, filename)
      toast({
        title: "Download successful",
        description: "Your verdict image has been downloaded.",
      })
      onClose()
    } catch (error) {
      toast({
        title: "Download failed",
        description: "Could not download image. Please try copying to clipboard instead.",
        variant: "destructive",
      })
    }
  }

  // Handle when the UI image element finishes loading (backup)
  const handleImageLoad = () => {
    console.log("✅ UI image onLoad event fired (backup)")
    if (!imageFullyLoaded) {
      setImageFullyLoaded(true)
      if (loadingIntervalRef.current) {
        clearInterval(loadingIntervalRef.current)
      }
    }
  }

  // Handle image load error in UI
  const handleImageError = () => {
    console.log("❌ UI image failed to load")
    setImageFullyLoaded(false)
    if (loadingIntervalRef.current) {
      clearInterval(loadingIntervalRef.current)
    }
    toast({
      title: "Preview failed",
      description: "Could not load image preview.",
      variant: "destructive",
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="w-[95vw] max-w-[500px] lg:max-w-[550px] max-h-[95vh] bg-zinc-900 border-zinc-800 p-0 overflow-hidden [&_button.absolute.right-4.top-4]:hidden mx-auto"
      >
        <DialogTitle className="sr-only">
          {getShareTitle()}
        </DialogTitle>
        
        <DialogDescription className="sr-only">
          Share your music taste verdict as an image. You can email, copy to clipboard, or download the image.
        </DialogDescription>
        
        <div className="flex flex-col min-h-0">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-1.5 z-10 bg-zinc-900/80 backdrop-blur-sm border-b border-zinc-800 flex-shrink-0">
            <div className="flex items-center justify-center gap-2 text-white flex-1">
              <Share2 className="h-5 w-5 text-purple-500" />
              {getShareTitle()}
            </div>
            
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-purple-600/20 hover:bg-purple-600/40 border border-purple-500/30 hover:border-purple-400 flex items-center justify-center transition-all duration-200 hover:scale-105 group"
              aria-label="Close share modal"
            >
              <svg
                className="w-4 h-4 text-purple-400 group-hover:text-purple-300 transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Main content area */}
          <div className="flex items-center justify-center p-4 flex-shrink-0">
            {!showingImage || !imageFullyLoaded ? (
              <div className="w-full max-w-[350px] aspect-[3/4] bg-zinc-800 rounded-lg flex flex-col items-center justify-center p-6 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mb-4"></div>
                <p className="text-purple-300 font-medium text-lg">{loadingMessages[loadingMessageIndex]}</p>
                <p className="text-zinc-400 text-sm mt-2">This may take a few moments</p>
                {/* Debug info */}
                <p className="text-xs text-zinc-600 mt-2">
                  Debug: showingImage={showingImage.toString()}, imageFullyLoaded={imageFullyLoaded.toString()}
                </p>
              </div>
            ) : (
              <div className="w-full max-w-[350px]">
                <div className="relative group w-full overflow-hidden rounded-lg bg-transparent">
                  <img
                    ref={imgRef}
                    src={imageUrl || "/music-snob-vinyl.png"}
                    alt="Share preview of your music taste verdict"
                    className="w-full h-auto rounded-lg border border-zinc-700 object-contain cursor-pointer hover:opacity-90 transition-all duration-200 group-hover:scale-[1.02] block bg-transparent"
                    style={{ backgroundColor: 'transparent' }}
                    onClick={handleImageClick}
                    onLoad={handleImageLoad}
                    onError={handleImageError}
                  />
                  
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-200 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="bg-black/80 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 backdrop-blur-sm">
                      <Copy className="h-4 w-4" />
                      Click to copy
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer buttons */}
          <div className="bg-zinc-900/80 backdrop-blur-sm border-t border-zinc-800 flex flex-col items-center justify-center px-4 py-2 pb-3 space-y-1.5 flex-shrink-0">
            {/* Share button above the row */}
            {supportsNativeShare && (
              <Button
                onClick={handleNativeShare}
                disabled={!imageFullyLoaded}
                className="px-6 py-3 h-12 text-white font-medium relative overflow-hidden bg-purple-gradient hover:scale-105 transition-all duration-300 border-0 shadow-lg"
                aria-label="Share your verdict using device share menu"
              >
                <div className="absolute inset-0 holographic-shimmer"></div>
                <div className="relative z-10 flex items-center justify-center">
                  <Share className="mr-2 h-4 w-4" />
                  Share Your Verdict
                </div>
              </Button>
            )}

            {/* Three buttons in a row */}
            <div className="flex gap-2 w-full max-w-[400px]">
              <Button
                onClick={handleSendEmail}
                disabled={!imageFullyLoaded || isSendingEmail}
                variant="outline"
                className="flex-1 text-white border-zinc-700 hover:bg-zinc-800 text-sm"
                aria-label="Send verdict via email"
              >
                {isSendingEmail ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-1"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail className="mr-1 h-4 w-4" />
                    Email
                  </>
                )}
              </Button>

              <Button
                onClick={handleCopyToClipboard}
                disabled={!imageFullyLoaded}
                variant="outline"
                className="flex-1 text-white border-zinc-700 hover:bg-zinc-800 text-sm"
                aria-label="Copy verdict image to clipboard"
              >
                <Copy className="mr-1 h-4 w-4" />
                Copy
              </Button>

              <Button
                onClick={handleDownloadImage}
                disabled={!imageFullyLoaded}
                variant="outline"
                className="flex-1 text-white border-zinc-700 hover:bg-zinc-800 text-sm"
                aria-label="Download verdict image"
              >
                <Download className="mr-1 h-4 w-4" />
                Download
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
