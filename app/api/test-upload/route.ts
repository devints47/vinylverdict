import { NextResponse } from "next/server"
import { put } from "@vercel/blob"

export async function GET() {
  try {
    // Create a simple test image (1x1 pixel PNG)
    const testImageBase64 =
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChAI9jU77yQAAAABJRU5ErkJggg=="
    const buffer = Buffer.from(testImageBase64, "base64")

    const filename = `test-upload-${Date.now()}.png`

    const { url } = await put(filename, buffer, {
      access: "public",
      contentType: "image/png",
    })

    return NextResponse.json({
      success: true,
      url,
      message: "Test upload successful",
    })
  } catch (error) {
    console.error("Test upload failed:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
