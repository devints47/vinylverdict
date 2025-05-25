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
    const [timestamp, imageUrl] = decodedData.split("|")

    // Test if the image URL is accessible
    const imageResponse = await fetch(imageUrl, { method: "HEAD" })

    return NextResponse.json({
      code,
      decodedData,
      timestamp: Number.parseInt(timestamp),
      imageUrl,
      imageAccessible: imageResponse.ok,
      imageStatus: imageResponse.status,
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
