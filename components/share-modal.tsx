"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { Facebook, Instagram, Mail, Copy, Share2, Linkedin, X, Share, MessageCircle } from "lucide-react"
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
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null)
  const [showingImage, setShowingImage] = useState(false)
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0)
  const [userProfile, setUserProfile] = useState<any>(null)
  const [isUploading, setIsUploading] = useState(false)
  const loadingIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const templateRef = useRef<HTMLDivElement>(null)
  const cleanupTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Fetch user profile when modal opens
  useEffect(() => {
    if (isOpen) {
      const fetchProfile = async () => {
        try {
          const response = await fetch("/api/auth/me")
          if (!response.ok) {
            console.warn(`Profile fetch failed with status: ${response.status}`)
            return
          }
          const data = await response.json()
          setUserProfile(data)
        } catch (err) {
          console.error("Error fetching profile:", err)
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
      setShowingImage(false)
      setIsUploading(false)

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
      // Updated dimensions for social media optimization (1200x630 aspect ratio)
      templateContainer.style.width = "1200px"
      templateContainer.style.height = "630px"
      templateContainer.style.backgroundColor = "#121212"
      templateContainer.style.backgroundImage = "url(/waveform-bg.png)"
      templateContainer.style.backgroundSize = "cover"
      templateContainer.style.backgroundPosition = "center"
      templateContainer.style.display = "flex"
      templateContainer.style.flexDirection = "row" // Changed to row for landscape layout
      templateContainer.style.justifyContent = "space-between"
      templateContainer.style.alignItems = "center"
      templateContainer.style.padding = "40px"
      templateContainer.style.fontFamily = "'Inter', sans-serif"
      templateContainer.style.color = "white"
      templateContainer.style.zIndex = "-1000"
      templateContainer.className = "vinyl-verdict-share-template"
      document.body.appendChild(templateContainer)

      // Calculate optimal font size based on text length for landscape format
      const textLength = text.length
      let fontSize = 18 // Smaller default for landscape

      if (textLength > 2000) {
        fontSize = 14
      } else if (textLength > 1500) {
        fontSize = 16
      } else if (textLength > 1000) {
        fontSize = 18
      } else if (textLength > 500) {
        fontSize = 20
      }

      // Left side - Branding
      const leftSide = document.createElement("div")
      leftSide.style.display = "flex"
      leftSide.style.flexDirection = "column"
      leftSide.style.alignItems = "center"
      leftSide.style.justifyContent = "center"
      leftSide.style.width = "300px"
      leftSide.style.height = "100%"

      // Vinyl logo
      const vinylLogo = document.createElement("img")
      vinylLogo.src = "/vinyl-favicon.png"
      vinylLogo.alt = "VinylVerdict Logo"
      vinylLogo.style.height = "120px"
      vinylLogo.style.width = "120px"
      vinylLogo.style.marginBottom = "20px"
      vinylLogo.style.filter = "drop-shadow(0 0 20px rgba(147, 51, 234, 0.6))"
      vinylLogo.crossOrigin = "anonymous"

      // Title
      const title = document.createElement("h1")
      title.textContent = "VinylVerdict"
      title.style.fontSize = "36px"
      title.style.fontWeight = "bold"
      title.style.color = "#c026d3"
      title.style.margin = "0 0 10px 0"
      title.style.textAlign = "center"

      // Subtitle
      const subtitle = document.createElement("p")
      const personalityName = getPersonalityName(assistantType)
      subtitle.textContent = `${personalityName}'s Verdict`
      subtitle.style.fontSize = "18px"
      subtitle.style.color = "#d4d4d8"
      subtitle.style.margin = "0"
      subtitle.style.textAlign = "center"

      leftSide.appendChild(vinylLogo)
      leftSide.appendChild(title)
      leftSide.appendChild(subtitle)

      // Right side - Content
      const rightSide = document.createElement("div")
      rightSide.style.flex = "1"
      rightSide.style.height = "100%"
      rightSide.style.marginLeft = "40px"
      rightSide.style.display = "flex"
      rightSide.style.flexDirection = "column"
      rightSide.style.justifyContent = "center"

      const content = document.createElement("div")
      content.style.backgroundColor = "rgba(24, 24, 27, 0.8)"
      content.style.borderRadius = "12px"
      content.style.padding = "30px"
      content.style.border = "1px solid rgba(147, 51, 234, 0.3)"
      content.style.maxHeight = "500px"
      content.style.overflowY = "hidden"

      // Convert markdown to HTML with the calculated font size
      content.innerHTML = convertMarkdownToHtml(text, fontSize)
      rightSide.appendChild(content)

      templateContainer.appendChild(leftSide)
      templateContainer.appendChild(rightSide)

      // Generate image after a short delay
      const generateImage = () => {
        const existingContainer = document.getElementById("share-image-template")
        if (!existingContainer) {
          console.warn("Template container not found during image generation")
          return
        }

        html2canvas(existingContainer, {
          allowTaint: true,
          useCORS: true,
          scale: 1, // Lower scale for better performance with landscape format
          logging: false,
          backgroundColor: null,
          width: 1200,
          height: 630,
          foreignObjectRendering: false,
          removeContainer: false,
        })
          .then((canvas) => {
            const imageUrl = canvas.toDataURL("image/png", 1.0)
            setImageUrl(imageUrl)
            setShowingImage(true)

            if (loadingIntervalRef.current) {
              clearInterval(loadingIntervalRef.current)
            }

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
          })
      }

      // Wait for logo to load
      vinylLogo.onload = () => setTimeout(generateImage, 500)
      vinylLogo.onerror = () => setTimeout(generateImage, 500)
      if (vinylLogo.complete) setTimeout(generateImage, 500)

      // Fallback timeout
      setTimeout(() => {
        setTimeout(generateImage, 500)
      }, 2000)
    }

    return () => {
      if (loadingIntervalRef.current) {
        clearInterval(loadingIntervalRef.current)
      }
      if (cleanupTimeoutRef.current) {
        clearTimeout(cleanupTimeoutRef.current)
      }
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

  // Convert markdown to HTML with proper styling and dynamic font size
  const convertMarkdownToHtml = (markdown: string, fontSize: number): string => {
    let title = ""
    let content = markdown

    const titleMatch = markdown.match(/^# (.+)$/m)
    if (titleMatch) {
      title = titleMatch[1]
      content = markdown.replace(/^# .+$/m, "")
    }

    let html = content
      .replace(
        /^# (.*$)/gm,
        `<h1 style="color: #c026d3; font-size: ${fontSize * 1.3}px; font-weight: bold; margin-bottom: 15px; line-height: 1.3;">$1</h1>`,
      )
      .replace(
        /^## (.*$)/gm,
        `<h2 style="color: #c026d3; font-size: ${fontSize * 1.15}px; font-weight: bold; margin-bottom: 12px; line-height: 1.3;">$2</h2>`,
      )
      .replace(
        /^### (.*$)/gm,
        `<h3 style="color: #c026d3; font-size: ${fontSize * 1.05}px; font-weight: bold; margin-bottom: 10px; line-height: 1.3;">$1</h3>`,
      )
      .replace(/\*\*(.*?)\*\*/g, `<strong style="color: white; font-weight: bold;">$1</strong>`)
      .replace(/\*(.*?)\*/g, `<em style="color: #d4d4d8; font-style: italic;">$1</em>`)
      .replace(
        /\n\n/g,
        `</p><p style="margin-bottom: ${fontSize * 0.6}px; color: #e4e4e7; font-size: ${fontSize}px; line-height: 1.4;">`,
      )
      .replace(
        /^- (.*$)/gm,
        `<li style="margin-left: 15px; color: #e4e4e7; font-size: ${fontSize}px; line-height: 1.4;">$1</li>`,
      )

    if (!html.startsWith("<h1") && !html.startsWith("<p")) {
      html = `<p style="margin-bottom: ${fontSize * 0.6}px; color: #e4e4e7; font-size: ${fontSize}px; line-height: 1.4;">${html}</p>`
    }

    if (title) {
      html =
        `<h1 style="color: #c026d3; font-size: ${fontSize * 1.4}px; font-weight: bold; margin-bottom: ${fontSize * 0.8}px; line-height: 1.2;">${title}</h1>` +
        html
    }

    return html
  }

  // Upload image to Vercel Blob via server action
  const uploadImageToBlob = async (dataUrl: string): Promise<string> => {
    try {
      setIsUploading(true)

      const response = await fetch("/api/upload-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ imageData: dataUrl }),
      })

      if (!response.ok) {
        throw new Error("Failed to upload image")
      }

      const { url } = await response.json()

      setIsUploading(false)
      setBlobUrl(url)
      return url
    } catch (error) {
      console.error("Error uploading to Vercel Blob:", error)
      setIsUploading(false)
      throw new Error("Failed to upload image")
    }
  }

  // Function to copy image to clipboard
  const copyImageToClipboard = async (dataUrl: string): Promise<void> => {
    try {
      const response = await fetch(dataUrl)
      const blob = await response.blob()
      const item = new ClipboardItem({ [blob.type]: blob })
      await navigator.clipboard.write([item])
    } catch (error) {
      console.error("Error copying image to clipboard:", error)
      throw new Error("Failed to copy image to clipboard")
    }
  }

  // Function to download image
  const downloadImage = async (dataUrl: string, filename: string): Promise<void> => {
    try {
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
      description: "Share to Facebook",
    },
    {
      id: "instagram",
      name: "Instagram",
      icon: <Instagram className="h-6 w-6" />,
      color: "bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] hover:opacity-90",
      description: "Copy image for Instagram",
    },
    {
      id: "linkedin",
      name: "LinkedIn",
      icon: <Linkedin className="h-6 w-6" />,
      color: "bg-[#0077B5] hover:bg-[#006399]",
      description: "Share to LinkedIn",
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
      id: "copy-image",
      name: "Copy Image",
      icon: <Copy className="h-6 w-6" />,
      color: "bg-purple-600 hover:bg-purple-700",
      description: "Copy image to clipboard",
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
      id: "share",
      name: "Share...",
      icon: <Share2 className="h-6 w-6" />,
      color: "bg-zinc-700 hover:bg-zinc-600",
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

  const handleShareClick = async (option: ShareOption) => {
    // Handle copy image option
    if (option.id === "copy-image") {
      if (!imageUrl) {
        toast({
          title: "Image not ready",
          description: "Please wait for the image to generate first.",
          variant: "destructive",
        })
        return
      }

      try {
        await copyImageToClipboard(imageUrl)
        toast({
          title: "Image copied!",
          description: "The image has been copied to your clipboard. You can now paste it anywhere!",
        })
        onClose()
      } catch (error) {
        toast({
          title: "Copy failed",
          description: "Could not copy image to clipboard. Please try downloading instead.",
          variant: "destructive",
        })
      }
      return
    }

    // Handle Instagram specially - copy image to clipboard
    if (option.id === "instagram") {
      if (!imageUrl) {
        toast({
          title: "Image not ready",
          description: "Please wait for the image to generate first.",
          variant: "destructive",
        })
        return
      }

      try {
        await copyImageToClipboard(imageUrl)
        toast({
          title: "Image copied for Instagram!",
          description: "The image has been copied. Open Instagram and paste it in your story or post!",
        })
        onClose()
      } catch (error) {
        toast({
          title: "Copy failed",
          description: "Could not copy image to clipboard. Please try downloading instead.",
          variant: "destructive",
        })
      }
      return
    }

    // For options that need the image URL from Vercel Blob, create a shareable page
    if (["twitter", "facebook", "linkedin", "whatsapp", "share"].includes(option.id)) {
      if (!blobUrl && imageUrl) {
        try {
          // Upload to Vercel Blob if not already uploaded
          const url = await uploadImageToBlob(imageUrl)

          // Create a unique share ID and share URL
          const shareId = Date.now().toString()
          const appUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin
          const shareUrl = `${appUrl}/share/${shareId}?text=${encodeURIComponent(text)}&type=${assistantType}&image=${encodeURIComponent(url)}`

          // Share with the page URL that has proper meta tags
          shareWithUrl(option.id, shareUrl)
        } catch (error) {
          toast({
            title: "Upload failed",
            description: "Could not upload image. Please try again.",
            variant: "destructive",
          })
        }
        return
      } else if (blobUrl) {
        // Use existing blob URL if available
        const shareId = Date.now().toString()
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin
        const shareUrl = `${appUrl}/share/${shareId}?text=${encodeURIComponent(text)}&type=${assistantType}&image=${encodeURIComponent(blobUrl)}`
        shareWithUrl(option.id, shareUrl)
        return
      }
    }

    // Handle special cases that don't need image preview
    if (option.id === "email") {
      const subject = "Check out my music taste verdict from VinylVerdict.fm!"
      const body = `Check out my music taste verdict from VinylVerdict.fm!\n\n${text.substring(0, 200)}...\n\nGet your own at ${process.env.NEXT_PUBLIC_APP_URL || window.location.origin}`
      window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`)
      onClose()
      return
    }

    if (option.id === "messages") {
      const shareText = `Check out my music taste verdict from VinylVerdict.fm!`
      const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)

      if (isMobile) {
        if (blobUrl) {
          const shareId = Date.now().toString()
          const appUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin
          const shareUrl = `${appUrl}/share/${shareId}?text=${encodeURIComponent(text)}&type=${assistantType}&image=${encodeURIComponent(blobUrl)}`
          window.open(`sms:?&body=${encodeURIComponent(shareText + " " + shareUrl)}`, "_blank")
        } else if (imageUrl) {
          try {
            const url = await uploadImageToBlob(imageUrl)
            const shareId = Date.now().toString()
            const appUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin
            const shareUrl = `${appUrl}/share/${shareId}?text=${encodeURIComponent(text)}&type=${assistantType}&image=${encodeURIComponent(url)}`
            window.open(`sms:?&body=${encodeURIComponent(shareText + " " + shareUrl)}`, "_blank")
          } catch (error) {
            toast({
              title: "Upload failed",
              description: "Could not upload image. Please try again.",
              variant: "destructive",
            })
          }
        }
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

  // Share with URL for social media platforms (now with proper meta tags)
  const shareWithUrl = (platform: string, url: string) => {
    const shareText = "Check out my music taste verdict from VinylVerdict.fm!"

    switch (platform) {
      case "twitter":
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(url)}`,
          "_blank",
        )
        break
      case "facebook":
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, "_blank")
        break
      case "linkedin":
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, "_blank")
        break
      case "whatsapp":
        window.open(`https://wa.me/?text=${encodeURIComponent(shareText + " " + url)}`, "_blank")
        break
      case "share":
        if (navigator.share) {
          navigator
            .share({
              title: "My Music Taste Verdict",
              text: shareText,
              url: url,
            })
            .catch((err) => console.error("Share failed:", err))
        } else {
          navigator.clipboard.writeText(url)
          toast({
            title: "URL copied",
            description: "Share URL has been copied to clipboard!",
          })
        }
        break
    }

    onClose()
  }

  const handleDownloadImage = async () => {
    if (!imageUrl) return

    try {
      const filename = `vinylverdict-${assistantType}-${Date.now()}.png`
      await downloadImage(imageUrl, filename)

      toast({
        title: "Image downloaded",
        description: "Your image has been downloaded successfully!",
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

          <div className="relative mx-auto w-full" style={{ maxWidth: "400px" }}>
            {!showingImage ? (
              <div className="aspect-[1200/630] bg-zinc-800 rounded-lg flex flex-col items-center justify-center p-4 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mb-4"></div>
                <p className="text-purple-300 font-medium text-lg">{loadingMessages[loadingMessageIndex]}</p>
                <p className="text-zinc-400 text-sm mt-2">This may take a few moments</p>
              </div>
            ) : (
              <div className="relative">
                <img
                  ref={imgRef}
                  src={imageUrl || "/placeholder.svg"}
                  alt={`${platform.name} preview`}
                  className="w-full rounded-lg border border-zinc-700 object-contain"
                  style={{ aspectRatio: "1200/630" }}
                  onError={() => {
                    toast({
                      title: "Preview failed",
                      description: "Could not load image preview, but sharing should still work.",
                      variant: "destructive",
                    })
                  }}
                />
                <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">1200×630</div>
              </div>
            )}
          </div>

          <div className="space-y-2 mt-2">
            <Button
              onClick={async () => {
                if (!imageUrl) return

                try {
                  if (!blobUrl) {
                    const url = await uploadImageToBlob(imageUrl)
                    const shareId = Date.now().toString()
                    const appUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin
                    const shareUrl = `${appUrl}/share/${shareId}?text=${encodeURIComponent(text)}&type=${assistantType}&image=${encodeURIComponent(url)}`
                    shareWithUrl(selectedPlatform, shareUrl)
                  } else {
                    const shareId = Date.now().toString()
                    const appUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin
                    const shareUrl = `${appUrl}/share/${shareId}?text=${encodeURIComponent(text)}&type=${assistantType}&image=${encodeURIComponent(blobUrl)}`
                    shareWithUrl(selectedPlatform, shareUrl)
                  }
                } catch (error) {
                  toast({
                    title: "Sharing failed",
                    description: "Failed to share the image. Please try again.",
                    variant: "destructive",
                  })
                }
              }}
              disabled={!showingImage || isUploading}
              className={`w-full text-white font-medium ${platform.color.replace("hover:", "")}`}
            >
              {isUploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Uploading...
                </>
              ) : (
                <>
                  <Share className="mr-2 h-4 w-4" />
                  Share to {platform.name}
                </>
              )}
            </Button>

            <Button
              onClick={handleDownloadImage}
              disabled={!showingImage}
              variant="outline"
              className="w-full text-white border-zinc-700 hover:bg-zinc-800"
            >
              Download Image
            </Button>
          </div>
        </DialogContent>
      </Dialog>
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
