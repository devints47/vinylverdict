import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: Promise<{ code: string }> }) {
  try {
    const { code } = await params

    if (!code) {
      return NextResponse.redirect(new URL("/", request.url))
    }

    // Decode the base64 URL (with some simple obfuscation)
    const decodedData = Buffer.from(code, "base64").toString("utf-8")
    const [timestamp, imageUrl] = decodedData.split("|")

    // Validate the timestamp (optional: check if it's expired)
    const urlTimestamp = Number.parseInt(timestamp, 10)
    const now = Date.now()

    // If the URL is older than 30 days, redirect to home
    if (now - urlTimestamp > 30 * 24 * 60 * 60 * 1000) {
      return NextResponse.redirect(new URL("/", request.url))
    }

    // Redirect to the image URL
    return NextResponse.redirect(new URL(imageUrl))
  } catch (error) {
    console.error("Error in s/[code] route:", error)
    return NextResponse.redirect(new URL("/", request.url))
  }
}
