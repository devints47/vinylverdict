import { type NextRequest, NextResponse } from "next/server"
import { put } from "@vercel/blob"

export async function POST(request: NextRequest) {
  try {
    console.log("Upload API called")

    const body = await request.json()
    const { imageData, timestamp, prefix = "vinyl-verdict-gen-image", format = "jpeg" } = body

    if (!imageData) {
      console.error("No image data provided")
      return NextResponse.json({ error: "No image data provided" }, { status: 400 })
    }

    // Validate the data URL format
    if (!imageData.startsWith("data:image/")) {
      console.error("Invalid image data format")
      return NextResponse.json({ error: "Invalid image data format" }, { status: 400 })
    }

    // Extract the base64 data
    const base64Data = imageData.split(",")[1]
    if (!base64Data) {
      console.error("Could not extract base64 data")
      return NextResponse.json({ error: "Could not extract base64 data" }, { status: 400 })
    }

    // Convert base64 to buffer
    const buffer = Buffer.from(base64Data, "base64")
    console.log("Image buffer size:", buffer.length)

    // Use provided timestamp or generate new one
    const fileTimestamp = timestamp || Date.now()
    console.log("Using timestamp for filename:", fileTimestamp)

    // Determine file extension and content type based on format
    const fileExtension = format === "jpeg" ? "jpg" : format
    const contentType = format === "jpeg" ? "image/jpeg" : `image/${format}`

    // Generate filename with custom prefix and format
    const filename = `${prefix}-${fileTimestamp}.${fileExtension}`
    console.log("Generated filename:", filename)

    // Upload to Vercel Blob
    const blob = await put(filename, buffer, {
      access: "public",
      contentType: contentType,
    })

    console.log("Upload successful, URL:", blob.url)

    return NextResponse.json({
      url: blob.url,
      filename: filename,
      timestamp: fileTimestamp,
      format: format,
    })
  } catch (error) {
    console.error("Error in upload API:", error)
    return NextResponse.json(
      { error: "Failed to upload image", details: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    )
  }
}
