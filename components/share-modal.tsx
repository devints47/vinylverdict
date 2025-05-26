"use client"
import { useState, useEffect, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
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
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0)
  const [userProfile, setUserProfile] = useState<any>(null)
  const [isSendingEmail, setIsSendingEmail] = useState(false)
  const loadingIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const cleanupTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Fetch user profile when modal opens
  useEffect(() => {
    if (isOpen) {
      const fetchProfile = async () => {
        try {
          const response = await fetch("/api/auth/me")

          if (!response.ok) {
            return
          }

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
      setShowingImage(false)
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
      templateContainer.style.padding = "40px 40px"
      templateContainer.style.fontFamily = "'Inter', sans-serif"
      templateContainer.style.color = "white"
      templateContainer.style.zIndex = "-1000"
      templateContainer.className = "vinyl-verdict-share-template"
      document.body.appendChild(templateContainer)

      // Calculate optimal font size based on text length
      const textLength = text.length
      let fontSize = 32

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
      header.style.marginBottom = "20px"
      header.style.width = "100%"
      header.style.maxWidth = "880px"

      const vinylLogo = document.createElement("img")
      vinylLogo.src = "/vinyl-favicon.png"
      vinylLogo.alt = "VinylVerdict Logo"
      vinylLogo.style.height = "120px"
      vinylLogo.style.width = "120px"
      vinylLogo.style.marginBottom = "20px"
      vinylLogo.style.filter = "drop-shadow(0 0 20px rgba(147, 51, 234, 0.6))"
      vinylLogo.crossOrigin = "anonymous"

      const subtitle = document.createElement("div")
      subtitle.style.textAlign = "center"
      subtitle.style.width = "100%"

      const subtitleText = document.createElement("h2")
      const personalityName = getPersonalityName(assistantType)
      const username = userProfile?.display_name || userProfile?.id || "Your Music"

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

      // Create content area
      const content = document.createElement("div")
      content.style.backgroundColor = "rgba(24, 24, 27, 0.8)"
      content.style.borderRadius = "12px"
      content.style.padding = "44px"
      content.style.border = "1px solid rgba(147, 51, 234, 0.3)"
      content.style.width = "100%"
      content.style.maxWidth = "880px"
      content.style.boxSizing = "border-box"
      content.style.marginBottom = "20px"

      content.innerHTML = convertMarkdownToHtml(text, fontSize)
      templateContainer.appendChild(content)

      // Create footer
      const footer = document.createElement("div")
      footer.style.display = "flex"
      footer.style.flexDirection = "column"
      footer.style.alignItems = "center"
      footer.style.width = "100%"
      footer.style.maxWidth = "880px"

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
      title.style.color = "#c026d3"
      title.style.margin = "0"
      title.style.padding = "0"
      title.style.lineHeight = "1"
      title.style.marginBottom = "8px"

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
      footer.appendChild(promoText)
      templateContainer.appendChild(footer)

      const generateImage = () => {
        const existingContainer = document.getElementById("share-image-template")
        if (!existingContainer) {
          return
        }

        const actualHeight = existingContainer.scrollHeight
        existingContainer.style.height = `${Math.max(actualHeight, 1920)}px`

        html2canvas(existingContainer, {
          allowTaint: true,
          useCORS: true,
          scale: 2,
          logging: false,
          backgroundColor: null,
          height: Math.max(actualHeight, 1920),
          windowHeight: Math.max(actualHeight, 1920),
          foreignObjectRendering: false,
          removeContainer: false,
        })
          .then((canvas) => {
            const imageUrl = canvas.toDataURL("image/png")
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
                  // Cleanup failed, continue
                }
              }
            }, 100)
          })
          .catch((error) => {
            toast({
              title: "Image generation failed",
              description: "Could not generate share image. Please try again.",
              variant: "destructive",
            })

            const containerToRemove = document.getElementById("share-image-template")
            if (containerToRemove && containerToRemove.parentNode) {
              try {
                document.body.removeChild(containerToRemove)
              } catch (cleanupError) {
                // Cleanup failed, continue
              }
            }
          })
      }

      let imagesLoaded = 0
      const totalImages = 2

      const checkImagesLoaded = () => {
        imagesLoaded++
        if (imagesLoaded === totalImages) {
          setTimeout(generateImage, 500)
        }
      }

      vinylLogo.onload = checkImagesLoaded
      vinylLogo.onerror = () => {
        checkImagesLoaded()
      }

      logoImg.onload = checkImagesLoaded
      logoImg.onerror = () => {
        checkImagesLoaded()
      }

      if (vinylLogo.complete) checkImagesLoaded()
      if (logoImg.complete) checkImagesLoaded()

      setTimeout(() => {
        if (imagesLoaded < totalImages) {
          setTimeout(generateImage, 500)
        }
      }, 3000)
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
          // Cleanup failed, continue
        }
      }
    }
  }, [isOpen, text, assistantType, userProfile])

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
        `<h1 style="color: #c026d3; font-size: ${fontSize * 1.3}px; font-weight: bold; margin-bottom: 20px; line-height: 1.4;">$1</h1>`,
      )
      .replace(
        /^## (.*$)/gm,
        `<h2 style="color: #c026d3; font-size: ${fontSize * 1.15}px; font-weight: bold; margin-bottom: 16px; line-height: 1.4;">$2</h2>`,
      )
      .replace(
        /^### (.*$)/gm,
        `<h3 style="color: #c026d3; font-size: ${fontSize * 1.05}px; font-weight: bold; margin-bottom: 12px; line-height: 1.4;">$1</h3>`,
      )
      .replace(/\*\*(.*?)\*\*/g, `<strong style="color: white; font-weight: bold;">$1</strong>`)
      .replace(/\*(.*?)\*/g, `<em style="color: #d4d4d8; font-style: italic;">$1</em>`)
      .replace(
        /\n\n/g,
        `</p><p style="margin-bottom: ${fontSize * 0.8}px; color: #e4e4e7; font-size: ${fontSize}px; line-height: 1.6;">`,
      )
      .replace(
        /^- (.*$)/gm,
        `<li style="margin-left: 20px; color: #e4e4e7; font-size: ${fontSize}px; line-height: 1.6;">$1</li>`,
      )

    if (!html.startsWith("<h1") && !html.startsWith("<p")) {
      html = `<p style="margin-bottom: ${fontSize * 0.8}px; color: #e4e4e7; font-size: ${fontSize}px; line-height: 1.6;">${html}</p>`
    }

    if (title) {
      html =
        `<h1 style="color: #c026d3; font-size: ${fontSize * 1.5}px; font-weight: bold; margin-bottom: ${fontSize}px; text-align: center; line-height: 1.3;">${title}</h1>` +
        html
    }

    return html
  }

  const copyImageToClipboard = async (dataUrl: string): Promise<void> => {
    try {
      if (!navigator.clipboard || !navigator.clipboard.write) {
        throw new Error("Clipboard API not supported")
      }

      const response = await fetch(dataUrl)
      const blob = await response.blob()

      let finalBlob = blob
      if (blob.type === "image/jpeg") {
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

      const item = new ClipboardItem({ [finalBlob.type]: finalBlob })
      await navigator.clipboard.write([item])
    } catch (error) {
      throw new Error("Failed to copy image to clipboard")
    }
  }

  const downloadImage = async (dataUrl: string, filename: string): Promise<void> => {
    try {
      const link = document.createElement("a")
      link.href = dataUrl
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
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

  const isAppleDevice = () => {
    const userAgent = navigator.userAgent
    const platform = navigator.platform

    const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream
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
      const blob = await response.blob()
      const file = new File([blob], `vinylverdict-${assistantType}-${Date.now()}.png`, { type: "image/png" })

      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: "My Music Taste Verdict",
          text: "Check out my music taste verdict from VinylVerdict.fm!",
          files: [file],
        })
      } else {
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
      <DialogContent className="w-[90vw] h-[90vh] max-w-none max-h-none bg-zinc-900 border-zinc-800 p-4 overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-white">
            <Share2 className="h-5 w-5 text-purple-500" />
            {getShareTitle()}
          </DialogTitle>
        </DialogHeader>

        <div className="relative mx-auto w-full flex-1 flex items-center justify-center min-h-0">
          {!showingImage ? (
            <div className="w-full max-w-[280px] aspect-[9/16] bg-zinc-800 rounded-lg flex flex-col items-center justify-center p-4 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mb-4"></div>
              <p className="text-purple-300 font-medium text-lg">{loadingMessages[loadingMessageIndex]}</p>
              <p className="text-zinc-400 text-sm mt-2">This may take a few moments</p>
            </div>
          ) : (
            <div className="relative w-full h-full flex items-center justify-center">
              <img
                ref={imgRef}
                src={imageUrl || "/placeholder.svg"}
                alt="Share preview"
                className="max-w-full max-h-full rounded-lg border border-zinc-700 object-contain cursor-pointer hover:opacity-90 transition-opacity"
                onClick={handleImageClick}
                onError={() => {
                  toast({
                    title: "Preview failed",
                    description: "Could not load image preview.",
                    variant: "destructive",
                  })
                }}
              />
              <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">1080×1920</div>
              <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded opacity-75">
                Click to copy
              </div>
            </div>
          )}
        </div>

        <div className="space-y-2 mt-4 flex-shrink-0">
          {isAppleDevice() && (
            <Button
              onClick={handleNativeShare}
              disabled={!showingImage}
              className="w-full text-white font-medium relative overflow-hidden bg-purple-gradient hover:scale-105 transition-all duration-300 border-0"
            >
              <div className="absolute inset-0 holographic-shimmer"></div>
              <div className="relative z-10 flex items-center justify-center">
                <Share className="mr-2 h-4 w-4" />
                Share Your Verdict
              </div>
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
