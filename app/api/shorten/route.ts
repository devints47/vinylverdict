import { type NextRequest, NextResponse } from "next/server"
import { put } from "@vercel/blob"
import crypto from "crypto"

// Interface for our URL mapping
interface UrlMapping {
  originalUrl: string
  createdAt: number
  expiresAt: number
}

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json({ error: "No URL provided" }, { status: 400 })
    }

    // Generate a short code (8 characters)
    const shortCode = crypto.randomBytes(4).toString("hex")

    // Create mapping with 30-day expiration
    const mapping: UrlMapping = {
      originalUrl: url,
      createdAt: Date.now(),
      expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days
    }

    // Store the mapping in Vercel Blob
    // Using a consistent naming pattern: url-mapping-{shortCode}.json
    await put(`url-mapping-${shortCode}.json`, JSON.stringify(mapping), {
      contentType: "application/json",
      access: "public",
    })

    // Return the short URL
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://vinylverdict.fm"
    const shortUrl = `${baseUrl}/s/${shortCode}`

    return NextResponse.json({ shortUrl, shortCode })
  } catch (error) {
    console.error("Error creating short URL:", error)
    return NextResponse.json({ error: "Failed to create short URL" }, { status: 500 })
  }
}
