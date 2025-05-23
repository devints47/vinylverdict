import type { NextRequest } from "next/server"

export const runtime = "edge"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type") || "snob"

    // Determine which static image to serve based on type
    let imagePath = "fallback-story-snob.png"

    if (type === "worshipper") {
      imagePath = "fallback-story-worshipper.png"
    } else if (type === "historian") {
      imagePath = "fallback-story-historian.png"
    }

    // Redirect to the static image
    return new Response(null, {
      status: 302,
      headers: {
        Location: `/${imagePath}`,
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    })
  } catch (error) {
    console.error("Error in static route:", error)
    return new Response("Error redirecting to static image", { status: 500 })
  }
}
