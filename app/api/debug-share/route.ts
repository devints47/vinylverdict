import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get("code")

  if (!code) {
    return NextResponse.json({ error: "No code provided" }, { status: 400 })
  }

  try {
    // Decode the share code
    const decodedData = Buffer.from(code, "base64").toString("utf-8")
    const parts = decodedData.split("|")

    if (parts.length !== 2) {
      return NextResponse.json(
        {
          error: "Invalid format",
          decodedData,
          reason: "Decoded data doesn't have two parts separated by |",
        },
        { status: 400 },
      )
    }

    const [timestamp, imageUrl] = parts

    // Test if the image URL is accessible
    let imageAccessible = false
    let imageStatus = 0

    try {
      const imageResponse = await fetch(imageUrl, { method: "HEAD" })
      imageAccessible = imageResponse.ok
      imageStatus = imageResponse.status
    } catch (fetchError) {
      console.error("Error testing image accessibility:", fetchError)
    }

    return NextResponse.json({
      code,
      decodedData,
      timestamp: Number.parseInt(timestamp),
      imageUrl,
      imageAccessible,
      imageStatus,
      date: new Date(Number.parseInt(timestamp)).toISOString(),
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to decode",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
