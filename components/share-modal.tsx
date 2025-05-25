"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  IconButton,
  HStack,
  useClipboard,
  Tooltip,
  useToast,
} from "@chakra-ui/react"
import { EmailIcon, FacebookIcon, WhatsappIcon, TwitterIcon, TelegramIcon } from "react-share"

interface ShareModalProps {
  isOpen: boolean
  onClose: () => void
  roastText: string
  title: string
  assistantType: string
  imageUrl?: string
}

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, roastText, title, assistantType, imageUrl }) => {
  const toast = useToast()
  const [shareUrl, setShareUrl] = useState<string>("")
  const { hasCopied, onCopy } = useClipboard(shareUrl)

  useEffect(() => {
    if (isOpen && !shareUrl) {
      createShareUrl().then(setShareUrl)
    }
  }, [isOpen, shareUrl])

  const createShareUrl = async (): Promise<string> => {
    try {
      const response = await fetch("/api/share", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: roastText,
          type: assistantType,
          imageUrl: imageUrl,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create share URL")
      }

      const data = await response.json()
      return data.url
    } catch (error) {
      console.error("Error creating share URL:", error)
      return ""
    }
  }

  const handleShare = (platform: string) => {
    switch (platform) {
      case "email":
        window.open(
          `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(roastText + "\n" + shareUrl)}`,
          "_blank",
        )
        break
      case "facebook":
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, "_blank")
        break
      case "whatsapp":
        window.open(
          `https://api.whatsapp.com/send?text=${encodeURIComponent(title + "\n" + roastText + "\n" + shareUrl)}`,
          "_blank",
        )
        break
      case "twitter":
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(title + "\n" + roastText + "\n" + shareUrl)}`,
          "_blank",
        )
        break
      case "telegram":
        window.open(
          `https://telegram.me/share/url?text=${encodeURIComponent(
            title + "\n" + roastText,
          )}&url=${encodeURIComponent(shareUrl)}`,
          "_blank",
        )
        break
      case "messages":
        if (shareUrl) {
          const messageText = `${title}\n${shareUrl}`
          const smsUrl = `sms:?&body=${encodeURIComponent(messageText)}`
          window.open(smsUrl, "_blank")
        }
        break
      default:
        break
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Share</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <HStack spacing={4} justify="center">
            <Tooltip label="Share via Email">
              <IconButton
                aria-label="Share via Email"
                icon={<EmailIcon size="1.5rem" round />}
                onClick={() => handleShare("email")}
              />
            </Tooltip>
            <Tooltip label="Share via Facebook">
              <IconButton
                aria-label="Share via Facebook"
                icon={<FacebookIcon size="1.5rem" round />}
                onClick={() => handleShare("facebook")}
              />
            </Tooltip>
            <Tooltip label="Share via WhatsApp">
              <IconButton
                aria-label="Share via WhatsApp"
                icon={<WhatsappIcon size="1.5rem" round />}
                onClick={() => handleShare("whatsapp")}
              />
            </Tooltip>
            <Tooltip label="Share via Twitter">
              <IconButton
                aria-label="Share via Twitter"
                icon={<TwitterIcon size="1.5rem" round />}
                onClick={() => handleShare("twitter")}
              />
            </Tooltip>
            <Tooltip label="Share via Telegram">
              <IconButton
                aria-label="Share via Telegram"
                icon={<TelegramIcon size="1.5rem" round />}
                onClick={() => handleShare("telegram")}
              />
            </Tooltip>
            <Tooltip label="Share via Messages">
              <Button onClick={() => handleShare("messages")}>Messages</Button>
            </Tooltip>
          </HStack>
          <HStack mt={4}>
            <Button onClick={onCopy} isDisabled={!shareUrl}>
              {hasCopied ? "Copied" : "Copy Link"}
            </Button>
            {shareUrl && (
              <a href={shareUrl} target="_blank" rel="noopener noreferrer">
                Open Link
              </a>
            )}
          </HStack>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export { ShareModal }
