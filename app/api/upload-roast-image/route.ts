import { put } from "@vercel/blob"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const filename = searchParams.get("filename")

    if (!filename) {
      return NextResponse.json({ error: "Filename is required" }, { status: 400 })
    }

    // Get the image data from the request body
    const blob = await request.blob()

    // Upload to Vercel Blob with a unique filename
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
