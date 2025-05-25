import { put } from "@vercel/blob"

export interface ShareData {
  id: string
  text: string
  type: string
  imageUrl?: string
  createdAt: string
  expiresAt?: string
}

// Generate a short, URL-safe ID
export function generateShortId(): string {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let result = ""
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

// Store share data and return short ID
export async function storeShareData(text: string, type: string, imageUrl?: string): Promise<string> {
  const id = generateShortId()

  const shareData: ShareData = {
    id,
    text,
    type,
    imageUrl,
    createdAt: new Date().toISOString(),
    // Optional: Set expiration (e.g., 30 days from now)
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  }

  try {
    // Store in Vercel Blob as JSON
    const blob = await put(`shares/${id}.json`, JSON.stringify(shareData), {
      access: "public",
      contentType: "application/json",
    })

    return id
  } catch (error) {
    console.error("Error storing share data:", error)
    throw new Error("Failed to create share link")
  }
}

// Retrieve share data by ID
export async function getShareData(id: string): Promise<ShareData | null> {
  try {
    // Check if the blob exists first
    const blobUrl = `https://blob.vercel-storage.com/shares/${id}.json`

    const response = await fetch(blobUrl)
    if (!response.ok) {
      return null
    }

    const shareData: ShareData = await response.json()

    // Check if expired
    if (shareData.expiresAt && new Date(shareData.expiresAt) < new Date()) {
      return null
    }

    return shareData
  } catch (error) {
    console.error("Error retrieving share data:", error)
    return null
  }
}

// Alternative: Use a simple in-memory store for development
// In production, you'd want to use a proper database
const shareStore = new Map<string, ShareData>()

export async function storeShareDataMemory(text: string, type: string, imageUrl?: string): Promise<string> {
  const id = generateShortId()

  const shareData: ShareData = {
    id,
    text,
    type,
    imageUrl,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  }

  shareStore.set(id, shareData)
  return id
}

export async function getShareDataMemory(id: string): Promise<ShareData | null> {
  const shareData = shareStore.get(id)

  if (!shareData) {
    return null
  }

  // Check if expired
  if (shareData.expiresAt && new Date(shareData.expiresAt) < new Date()) {
    shareStore.delete(id)
    return null
  }

  return shareData
}
