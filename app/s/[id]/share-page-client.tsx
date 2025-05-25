"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Share2, Download, Copy } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import ReactMarkdown from "react-markdown"

const SharePreview = ({ title, description, imageUrl }: { title: string; description: string; imageUrl?: string }) => (
  <div className="mb-8">
    <h3 className="text-lg font-semibold text-white mb-4">📱 How this looks when shared:</h3>
    <div className="bg-zinc-800 rounded-lg p-4 border border-zinc-700 max-w-md">
      {imageUrl && (
        <img src={imageUrl || "/placeholder.svg"} alt="Preview" className="w-full h-32 object-cover rounded mb-3" />
      )}
      <div className="text-sm">
        <div className="font-semibold text-white mb-1">{title}</div>
        <div className="text-zinc-300 text-xs mb-2">{description}</div>
        <div className="text-zinc-500 text-xs">vinylverdict.fm</div>
      </div>
    </div>
    <p className="text-xs text-zinc-500 mt-2">
      ✅ Works in: iMessage, WhatsApp, Telegram, Discord, Slack
      <br />❌ Plain text only: SMS
    </p>
  </div>
)

interface SharePageClientProps {
  text: string
  type: string
  imageUrl?: string
}

export default function SharePageClient({ text, type, imageUrl }: SharePageClientProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

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

  const getTitle = (type: string): string => {
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

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: getTitle(type),
          text: "Check out my music taste verdict from VinylVerdict!",
          url: window.location.href,
        })
      } catch (error) {
        console.error("Share failed:", error)
      }
    } else {
      // Fallback: copy URL to clipboard
      navigator.clipboard.writeText(window.location.href)
      toast({
        title: "URL copied!",
        description: "Share URL has been copied to your clipboard.",
      })
    }
  }

  const handleCopyText = () => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Text copied!",
      description: "The verdict text has been copied to your clipboard.",
    })
  }

  const handleDownloadImage = () => {
    if (imageUrl) {
      const link = document.createElement("a")
      link.href = imageUrl
      link.download = `vinylverdict-${type}-${Date.now()}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 p-4">
      <div className="max-w-4xl mx-auto py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <img src="/vinyl-favicon.png" alt="VinylVerdict" className="h-12 w-12" />
            <h1 className="text-3xl font-bold text-white">VinylVerdict</h1>
          </div>
          <h2 className="text-xl text-purple-300 mb-2">{getPersonalityName(type)}</h2>
          <p className="text-zinc-400">
            Get your own personalized music verdict at{" "}
            <a href="/" className="text-purple-400 hover:text-purple-300">
              VinylVerdict.fm
            </a>
          </p>
        </div>

        {/* Share Preview */}
        <SharePreview
          title={getTitle(type)}
          description={text.substring(0, 150).replace(/[#*]/g, "").trim() + (text.length > 150 ? "..." : "")}
          imageUrl={imageUrl}
        />

        {/* Image Preview */}
        {imageUrl && (
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <img
                src={imageUrl || "/placeholder.svg"}
                alt="Music Taste Verdict"
                className="rounded-lg border border-zinc-700 max-w-full h-auto"
                style={{ maxHeight: "400px" }}
              />
            </div>
          </div>
        )}

        {/* Content */}
        <Card className="bg-zinc-800/50 border-zinc-700 mb-8">
          <CardContent className="p-6">
            <div className="prose prose-invert prose-purple max-w-none">
              <ReactMarkdown
                components={{
                  h1: ({ children }) => <h1 className="text-2xl font-bold text-purple-300 mb-4">{children}</h1>,
                  h2: ({ children }) => <h2 className="text-xl font-bold text-purple-300 mb-3">{children}</h2>,
                  h3: ({ children }) => <h3 className="text-lg font-bold text-purple-300 mb-2">{children}</h3>,
                  p: ({ children }) => <p className="text-zinc-200 mb-4 leading-relaxed">{children}</p>,
                  strong: ({ children }) => <strong className="text-white font-bold">{children}</strong>,
                  em: ({ children }) => <em className="text-zinc-300 italic">{children}</em>,
                  ul: ({ children }) => (
                    <ul className="list-disc list-inside text-zinc-200 mb-4 space-y-1">{children}</ul>
                  ),
                  li: ({ children }) => <li className="text-zinc-200">{children}</li>,
                }}
              >
                {text}
              </ReactMarkdown>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 justify-center">
          <Button onClick={handleShare} className="bg-purple-600 hover:bg-purple-700">
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>

          <Button
            onClick={handleCopyText}
            variant="outline"
            className="border-zinc-600 text-zinc-200 hover:bg-zinc-800"
          >
            <Copy className="mr-2 h-4 w-4" />
            Copy Text
          </Button>

          {imageUrl && (
            <Button
              onClick={handleDownloadImage}
              variant="outline"
              className="border-zinc-600 text-zinc-200 hover:bg-zinc-800"
            >
              <Download className="mr-2 h-4 w-4" />
              Download Image
            </Button>
          )}

          <Button asChild variant="outline" className="border-purple-600 text-purple-300 hover:bg-purple-900/20">
            <a href="/">Get Your Own Verdict</a>
          </Button>
        </div>
      </div>
    </div>
  )
}
