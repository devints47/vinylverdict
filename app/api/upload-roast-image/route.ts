import { put } from "@vercel/blob"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    // Get the blob from the request
    const blob = await request.blob()

    if (!blob) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 })
    }

    // Generate a unique filename
    const filename = `roast-${Date.now()}-${Math.random().toString(36).substring(2, 15)}.png`

    // Upload to Vercel Blob
    const { url } = await put(filename, blob, {
      access: "public",
      contentType: "image/png",
    })

    return NextResponse.json({ url })
  } catch (error) {
    console.error("Error uploading image:", error)
    return NextResponse.json({ error: "Failed to upload image" }, { status: 500 })
  }
}
