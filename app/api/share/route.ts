import { type NextRequest, NextResponse } from "next/server"
import { storeShareData } from "@/lib/share-storage"

export async function POST(request: NextRequest) {
  try {
    const { text, type, imageUrl } = await request.json()

    if (!text || !type) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Store the share data and get a short ID
    const shareId = await storeShareData(text, type, imageUrl)

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://vinylverdict.fm"
    const shortUrl = `${appUrl}/s/${shareId}`

    return NextResponse.json({
      id: shareId,
      url: shortUrl,
    })
  } catch (error) {
    console.error("Error creating share:", error)
    return NextResponse.json({ error: "Failed to create share link" }, { status: 500 })
  }
}
