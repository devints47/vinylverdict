"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { Mail, Copy, Share2, Share, Download } from "lucide-react"
import html2canvas from "html2canvas"

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
  const [blobUrl, setBlobUrl] = useState<string>("")
  const [shortUrl, setShortUrl] = useState<string>("")
  const [showingImage, setShowingImage] = useState(false)
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0)
  const [userProfile, setUserProfile] = useState<any>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isSendingEmail, setIsSendingEmail] = useState(false)
  const loadingIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const templateRef = useRef<HTMLDivElement>(null)
  const cleanupTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Fetch user profile when modal opens - using same pattern as dashboard
  useEffect(() => {
    if (isOpen) {
      const fetchProfile = async () => {
        try {
          // Use the server API endpoint - same as dashboard
          const response = await fetch("/api/auth/me")

          if (!response.ok) {
            console.warn(`Profile fetch failed with status: ${response.status}`)
            return
          }

          const data = await response.json()
          setUserProfile(data) // Data is returned directly, not wrapped in user property
        } catch (err) {
          console.error("Error fetching profile:", err)
          // Don't throw error, just continue without profile data
        }
      }

      fetchProfile()
    }
  }, [isOpen])

  useEffect(() => {
    if (isOpen) {
      // Reset states
      setImageUrl("")
      setBlobUrl("")
      setShortUrl("")
      setShowingImage(false)
      setIsUploading(false)
      setIsSendingEmail(false)

      // Start cycling through loading messages
      setLoadingMessageIndex(0)
      if (loadingIntervalRef.current) {
        clearInterval(loadingIntervalRef.current)
      }

      loadingIntervalRef.current = setInterval(() => {
        setLoadingMessageIndex((prev) => (prev + 1) % loadingMessages.length)
      }, 2000)

      // Create the template element directly in the DOM
      const templateContainer = document.createElement("div")
      templateContainer.id = "share-image-template"
      templateContainer.style.position = "fixed"
      templateContainer.style.left = "-9999px"
      templateContainer.style.top = "-9999px"
      templateContainer.style.width = "1080px"
      templateContainer.style.minHeight = "1920px"
      templateContainer.style.backgroundColor = "#121212"
      templateContainer.style.backgroundImage = "url(/waveform-bg.png)"
      templateContainer.style.backgroundSize = "cover"
      templateContainer.style.backgroundPosition = "center"
      templateContainer.style.display = "flex"
      templateContainer.style.flexDirection = "column"
      templateContainer.style.justifyContent = "center"
      templateContainer.style.alignItems = "center"
      templateContainer.style.padding = "60px 40px"
      templateContainer.style.fontFamily = "'Inter', sans-serif"
      templateContainer.style.color = "white"
      templateContainer.style.zIndex = "-1000"
      // Add a unique class for easier identification
      templateContainer.className = "vinyl-verdict-share-template"
      document.body.appendChild(templateContainer)

      // Calculate optimal font size based on text length
      const textLength = text.length
      let fontSize = 32 // Default font size

      // Adjust font size based on text length - more nuanced scaling
      if (textLength > 3000) {
        fontSize = 18
      } else if (textLength > 2500) {
        fontSize = 20
      } else if (textLength > 2000) {
        fontSize = 22
      } else if (textLength > 1500) {
        fontSize = 24
      } else if (textLength > 1000) {
        fontSize = 26
      } else if (textLength > 700) {
        fontSize = 28
      } else if (textLength > 500) {
        fontSize = 30
      }

      // Create header with vinyl logo
      const header = document.createElement("div")
      header.style.display = "flex"
      header.style.flexDirection = "column"
      header.style.alignItems = "center"
      header.style.marginBottom = "40px"
      header.style.width = "100%"
      header.style.maxWidth = "800px"

      // Add vinyl logo centered above subtitle with purple glow
      const vinylLogo = document.createElement("img")
      vinylLogo.src = "/vinyl-favicon.png"
      vinylLogo.alt = "VinylVerdict Logo"
      vinylLogo.style.height = "120px"
      vinylLogo.style.width = "120px"
      vinylLogo.style.marginBottom = "20px"
      vinylLogo.style.filter = "drop-shadow(0 0 20px rgba(147, 51, 234, 0.6))"
      vinylLogo.crossOrigin = "anonymous"

      // Create subtitle with purple colors instead of gradient
      const subtitle = document.createElement("div")
      subtitle.style.textAlign = "center"
      subtitle.style.width = "100%"

      const subtitleText = document.createElement("h2")
      const personalityName = getPersonalityName(assistantType)
      const username = userProfile?.display_name || userProfile?.id || "Your Music"

      // Create the subtitle with purple styling for both personality and username
      subtitleText.innerHTML = `<span style="color: #c026d3; font-weight: bold;">${personalityName}</span>'s analysis of <span style="color: #c026d3; font-weight: bold;">${username}</span>`

      subtitleText.style.fontSize = "32px"
      subtitleText.style.fontWeight = "600"
      subtitleText.style.color = "#d4d4d8"
      subtitleText.style.margin = "0"
      subtitleText.style.padding = "0"
      subtitleText.style.lineHeight = "1.4"

      subtitle.appendChild(subtitleText)
      header.appendChild(vinylLogo)
      header.appendChild(subtitle)
      templateContainer.appendChild(header)

      // Create content area with no minHeight - only as tall as content
      const content = document.createElement("div")
      content.style.backgroundColor = "rgba(24, 24, 27, 0.8)"
      content.style.borderRadius = "12px"
      content.style.padding = "40px"
      content.style.border = "1px solid rgba(147, 51, 234, 0.3)"
      content.style.width = "100%"
      content.style.maxWidth = "800px"
      content.style.boxSizing = "border-box"
      content.style.marginBottom = "30px" // Reduced from 40px to 30px

      // Convert markdown to HTML with the calculated font size
      content.innerHTML = convertMarkdownToHtml(text, fontSize)
      templateContainer.appendChild(content)

      // Create footer with logo and VinylVerdict.FM
      const footer = document.createElement("div")
      footer.style.display = "flex"
      footer.style.flexDirection = "column"
      footer.style.alignItems = "center"
      footer.style.width = "100%"
      footer.style.maxWidth = "800px"

      // Logo and title container
      const logoContainer = document.createElement("div")
      logoContainer.style.display = "flex"
      logoContainer.style.alignItems = "center"
      logoContainer.style.gap = "16px"
      logoContainer.style.marginBottom = "16px"

      const logoImg = document.createElement("img")
      logoImg.src = "/vinyl-favicon.png"
      logoImg.alt = "VinylVerdict Logo"
      logoImg.style.height = "60px"
      logoImg.style.width = "60px"
      logoImg.crossOrigin = "anonymous"

      const title = document.createElement("h1")
      title.textContent = "VinylVerdict.FM"
      title.style.fontSize = "42px"
      title.style.fontWeight = "bold"
      title.style.color = "#c026d3" // Use solid purple color instead of gradient
      title.style.margin = "0"
      title.style.padding = "0"
      title.style.lineHeight = "1"
      title.style.marginBottom = "8px" // Add margin bottom to align with logo center

      // Add promotional sub-text
      const promoText = document.createElement("p")
      promoText.textContent = "Get your own personalized verdict at VinylVerdict.FM"
      promoText.style.fontSize = "18px"
      promoText.style.color = "#9ca3af"
      promoText.style.margin = "0"
      promoText.style.padding = "0"
      promoText.style.textAlign = "center"
      promoText.style.fontWeight = "400"

      logoContainer.appendChild(logoImg)
      logoContainer.appendChild(title)
      footer.appendChild(logoContainer)
      footer.appendChild(promoText)
      templateContainer.appendChild(footer)

      // Wait for images to load and content to render
      const generateImage = () => {
        // Double-check that the element still exists
        const existingContainer = document.getElementById("share-image-template")
        if (!existingContainer) {
          console.warn("Template container not found during image generation")
          return
        }

        // Adjust container height based on actual content
        const actualHeight = existingContainer.scrollHeight
        existingContainer.style.height = `${Math.max(actualHeight, 1920)}px`

        // Generate image from the template with improved options - use PNG for better clipboard support
        html2canvas(existingContainer, {
          allowTaint: true,
          useCORS: true,
          scale: 2,
          logging: false, // Disable html2canvas logging to reduce console noise
          backgroundColor: null,
          height: Math.max(actualHeight, 1920),
          windowHeight: Math.max(actualHeight, 1920),
          // Add these options to improve stability
          foreignObjectRendering: false,
          removeContainer: false, // Don't let html2canvas remove the container
        })
          .then((canvas) => {
            // Convert canvas to PNG data URL for better clipboard compatibility
            const imageUrl = canvas.toDataURL("image/png")
            setImageUrl(imageUrl)
            setShowingImage(true)

            // Clean up intervals
            if (loadingIntervalRef.current) {
              clearInterval(loadingIntervalRef.current)
            }

            // Schedule cleanup after a short delay to ensure html2canvas is completely done
            cleanupTimeoutRef.current = setTimeout(() => {
              const containerToRemove = document.getElementById("share-image-template")
              if (containerToRemove && containerToRemove.parentNode) {
                try {
                  document.body.removeChild(containerToRemove)
                } catch (error) {
                  console.warn("Error removing template container:", error)
                }
              }
            }, 100)
          })
          .catch((error) => {
            console.error("Error generating image:", error)
            toast({
              title: "Image generation failed",
              description: "Could not generate share image. Please try again.",
              variant: "destructive",
            })

            // Clean up on error
            const containerToRemove = document.getElementById("share-image-template")
            if (containerToRemove && containerToRemove.parentNode) {
              try {
                document.body.removeChild(containerToRemove)
              } catch (cleanupError) {
                console.warn("Error removing template container after error:", cleanupError)
              }
            }
          })
      }

      // Wait for both logo images to load before generating
      let imagesLoaded = 0
      const totalImages = 2

      const checkImagesLoaded = () => {
        imagesLoaded++
        if (imagesLoaded === totalImages) {
          setTimeout(generateImage, 500)
        }
      }

      // Header vinyl logo
      vinylLogo.onload = checkImagesLoaded
      vinylLogo.onerror = () => {
        console.warn("Header vinyl logo failed to load")
        checkImagesLoaded()
      }

      // Footer logo
      logoImg.onload = checkImagesLoaded
      logoImg.onerror = () => {
        console.warn("Footer logo failed to load")
        checkImagesLoaded()
      }

      // If images are already cached, onload might not fire
      if (vinylLogo.complete) checkImagesLoaded()
      if (logoImg.complete) checkImagesLoaded()

      // Fallback timeout in case images don't load
      setTimeout(() => {
        if (imagesLoaded < totalImages) {
          console.warn("Some images didn't load, proceeding with image generation")
          setTimeout(generateImage, 500)
        }
      }, 3000)
    }

    return () => {
      // Clean up intervals
      if (loadingIntervalRef.current) {
        clearInterval(loadingIntervalRef.current)
      }

      // Clean up timeout
      if (cleanupTimeoutRef.current) {
        clearTimeout(cleanupTimeoutRef.current)
      }

      // Clean up any template containers that might be left
      const templateContainer = document.getElementById("share-image-template")
      if (templateContainer && templateContainer.parentNode) {
        try {
          templateContainer.parentNode.removeChild(templateContainer)
        } catch (error) {
          console.warn("Error cleaning up template container:", error)
        }
      }
    }
  }, [isOpen, text, assistantType, userProfile])

  // Get the personality name based on assistant type
  const getPersonalityName = (type: string): string => {
    switch (type) {
      case "worshipper":
        return "The Taste Validator"
      case "historian":
        return "The Music Historian"
      case "snob":
      default:
        return "The Music Snob"
    }
  }

  // Get the appropriate title based on assistant type
  const getAssistantTitle = (type: string): string => {
    switch (type) {
      case "worshipper":
        return "Music Taste Validation"
      case "historian":
        return "Music History Analysis"
      case "snob":
      default:
        return "Music Taste Verdict"
    }
  }

  // Convert markdown to HTML with proper styling and dynamic font size
  const convertMarkdownToHtml = (markdown: string, fontSize: number): string => {
    // Extract title from first line if it starts with #
    let title = ""
    let content = markdown

    // Check if the first line is a title
    const titleMatch = markdown.match(/^# (.+)$/m)
    if (titleMatch) {
      title = titleMatch[1]
      content = markdown.replace(/^# .+$/m, "") // Remove the title from content
    }

    // Basic markdown conversion with dynamic font size
    let html = content
      // Convert headers
      .replace(
        /^# (.*$)/gm,
        `<h1 style="color: #c026d3; font-size: ${fontSize * 1.3}px; font-weight: bold; margin-bottom: 20px; line-height: 1.4;">$1</h1>`,
      )
      .replace(
        /^## (.*$)/gm,
        `<h2 style="color: #c026d3; font-size: ${fontSize * 1.15}px; font-weight: bold; margin-bottom: 16px; line-height: 1.4;">$1</h2>`,
      )
      .replace(
        /^### (.*$)/gm,
        `<h3 style="color: #c026d3; font-size: ${fontSize * 1.05}px; font-weight: bold; margin-bottom: 12px; line-height: 1.4;">$1</h3>`,
      )
      // Convert bold and italic
      .replace(/\*\*(.*?)\*\*/g, `<strong style="color: white; font-weight: bold;">$1</strong>`)
      .replace(/\*(.*?)\*/g, `<em style="color: #d4d4d8; font-style: italic;">$1</em>`)
      // Convert paragraphs with dynamic font size
      .replace(
        /\n\n/g,
        `</p><p style="margin-bottom: ${fontSize * 0.8}px; color: #e4e4e7; font-size: ${fontSize}px; line-height: 1.6;">`,
      )
      // Convert lists
      .replace(
        /^- (.*$)/gm,
        `<li style="margin-left: 20px; color: #e4e4e7; font-size: ${fontSize}px; line-height: 1.6;">$1</li>`,
      )

    // Wrap in paragraph if not already
    if (!html.startsWith("<h1") && !html.startsWith("<p")) {
      html = `<p style="margin-bottom: ${fontSize * 0.8}px; color: #e4e4e7; font-size: ${fontSize}px; line-height: 1.6;">${html}</p>`
    }

    // If we extracted a title, add it back at the top with larger font
    if (title) {
      html =
        `<h1 style="color: #c026d3; font-size: ${fontSize * 1.5}px; font-weight: bold; margin-bottom: ${fontSize}px; text-align: center; line-height: 1.3;">${title}</h1>` +
        html
    }

    return html
  }

  // Function to copy image to clipboard - improved for better browser support
  const copyImageToClipboard = async (dataUrl: string): Promise<void> => {
    try {
      // Check if clipboard API is available
      if (!navigator.clipboard || !navigator.clipboard.write) {
        throw new Error("Clipboard API not supported")
      }

      // Convert data URL to blob
      const response = await fetch(dataUrl)
      const blob = await response.blob()

      // For better compatibility, try PNG format
      let finalBlob = blob
      if (blob.type === "image/jpeg") {
        // Convert JPEG to PNG for better clipboard support
        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d")
        const img = new Image()

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
                reject(new Error("Failed to convert to PNG"))
              }
            }, "image/png")
          }
          img.onerror = reject
          img.src = dataUrl
        })
      }

      // Create a ClipboardItem
      const item = new ClipboardItem({ [finalBlob.type]: finalBlob })

      // Write to clipboard
      await navigator.clipboard.write([item])
    } catch (error) {
      console.error("Error copying image to clipboard:", error)
      throw new Error("Failed to copy image to clipboard")
    }
  }

  // Function to download image
  const downloadImage = async (dataUrl: string, filename: string): Promise<void> => {
    try {
      // Create a download link
      const link = document.createElement("a")
      link.href = dataUrl
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error("Error downloading image:", error)
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

  // Detect if user is on iOS or macOS
  const isAppleDevice = () => {
    const userAgent = navigator.userAgent
    const platform = navigator.platform

    // Check for iOS
    const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream

    // Check for macOS
    const isMacOS = platform.toLowerCase().includes("mac")

    return isIOS || isMacOS
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

  const handleNativeShare = async () => {
    if (!imageUrl) return

    try {
      // Convert data URL to blob for native sharing
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      const file = new File([blob], `vinylverdict-${assistantType}-${Date.now()}.png`, { type: "image/png" })

      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: "My Music Taste Verdict",
          text: "Check out my music taste verdict from VinylVerdict.fm!",
          files: [file],
        })
      } else {
        // Fallback if file sharing is not supported
        toast({
          title: "Share not available",
          description: "File sharing is not supported on this device.",
          variant: "destructive",
        })
      }
    } catch (error) {
      if (error instanceof Error && error.name !== "AbortError") {
        toast({
          title: "Share failed",
          description: "Could not share the image. Please try another method.",
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
      console.error("Error sending email:", error)
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-zinc-900 border-zinc-800">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-white">
            <Share2 className="h-5 w-5 text-purple-500" />
            {getShareTitle()}
          </DialogTitle>
          <DialogDescription className="text-zinc-400">Your verdict is ready to share</DialogDescription>
        </DialogHeader>

        <div className="relative mx-auto w-full" style={{ maxWidth: "320px" }}>
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
                src={imageUrl || "/placeholder.svg"}
                alt="Share preview"
                className="w-full rounded-lg border border-zinc-700 object-contain"
                style={{ aspectRatio: "9/16" }}
                onError={() => {
                  toast({
                    title: "Preview failed",
                    description: "Could not load image preview.",
                    variant: "destructive",
                  })
                }}
              />
              <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">1080×1920</div>
            </div>
          )}
        </div>

        <div className="space-y-2 mt-4">
          {isAppleDevice() && (
            <Button
              onClick={handleNativeShare}
              disabled={!showingImage}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium"
            >
              <Share className="mr-2 h-4 w-4" />
              Share Your Verdict
            </Button>
          )}

          <Button
            onClick={handleCopyToClipboard}
            disabled={!showingImage}
            variant="outline"
            className="w-full text-white border-zinc-700 hover:bg-zinc-800"
          >
            <Copy className="mr-2 h-4 w-4" />
            Copy to Clipboard
          </Button>

          <Button
            onClick={handleDownloadImage}
            disabled={!showingImage}
            variant="outline"
            className="w-full text-white border-zinc-700 hover:bg-zinc-800"
          >
            <Download className="mr-2 h-4 w-4" />
            Download Verdict
          </Button>

          <Button
            onClick={handleSendEmail}
            disabled={!showingImage || isSendingEmail}
            variant="outline"
            className="w-full text-white border-zinc-700 hover:bg-zinc-800"
          >
            {isSendingEmail ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Sending...
              </>
            ) : (
              <>
                <Mail className="mr-2 h-4 w-4" />
                Send to my email
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
