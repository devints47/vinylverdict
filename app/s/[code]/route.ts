import { type NextRequest, NextResponse } from "next/server"
import { get } from "@vercel/blob"

interface UrlMapping {
  originalUrl: string
  createdAt: number
  expiresAt: number
}

export async function GET(request: NextRequest, { params }: { params: { code: string } }) {
  try {
    const code = params.code

    if (!code) {
      return NextResponse.redirect(new URL("/", request.url))
    }

    // Try to get the mapping from Vercel Blob
    try {
      const blob = await get(`url-mapping-${code}.json`)

      if (!blob) {
        // If mapping doesn't exist, redirect to home
        return NextResponse.redirect(new URL("/", request.url))
      }

      // Parse the mapping
      const text = await blob.text()
      const mapping: UrlMapping = JSON.parse(text)

      // Check if the URL has expired
      if (mapping.expiresAt < Date.now()) {
        return NextResponse.redirect(new URL("/", request.url))
      }

      // Redirect to the original URL
      return NextResponse.redirect(mapping.originalUrl)
    } catch (error) {
      console.error("Error retrieving URL mapping:", error)
      return NextResponse.redirect(new URL("/", request.url))
    }
  } catch (error) {
    console.error("Error in redirect handler:", error)
    return NextResponse.redirect(new URL("/", request.url))
  }
}
