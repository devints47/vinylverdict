"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { generateShortUrl } from "@/lib/generate-short-url"

interface ShareModalProps {
  imageUrl: string
}

export function ShareModal({ imageUrl }: ShareModalProps) {
  const [shareableLink, setShareableLink] = useState("")
  const [isCopied, setIsCopied] = useState(false)
  const { toast } = useToast()

  const handleShare = async () => {
    try {
      // After the image is uploaded to Vercel Blob
      const shortUrl = generateShortUrl(imageUrl)

      setShareableLink(shortUrl)
    } catch (error) {
      console.error("Error generating short URL:", error)
      toast({
        title: "Error",
        description: "Failed to generate shareable link.",
        variant: "destructive",
      })
    }
  }

  const handleCopyClick = () => {
    navigator.clipboard.writeText(shareableLink)
    setIsCopied(true)
    toast({
      title: "Copied!",
      description: "Link copied to clipboard.",
    })
    setTimeout(() => setIsCopied(false), 2000)
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">Share</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Share Image</AlertDialogTitle>
          <AlertDialogDescription>Generate a shareable link for your image.</AlertDialogDescription>
        </AlertDialogHeader>
        <div className="grid gap-2">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="link" className="text-right">
              Shareable Link
            </Label>
            <Input type="text" id="link" value={shareableLink} readOnly className="col-span-3" />
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={shareableLink ? handleCopyClick : handleShare} disabled={!imageUrl}>
            {shareableLink ? (isCopied ? "Copied!" : "Copy Link") : "Generate Link"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
