// Route segment config
export const runtime = "edge"

// Image metadata
export const alt = "VinylVerdict - Shared Music Taste Verdict"
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = "image/png"

// Dynamic image generation
export default async function Image({ params }: { params: Record<string, string> }) {
  // Get the app URL from environment variable or use a default
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://vinylverdict.fm"

  // Forward to the API route that handles the dynamic OG image generation
  const searchParams = new URLSearchParams(params)
  const apiUrl = `${appUrl}/api/og?${searchParams.toString()}`

  // Redirect to the API route
  return new Response(null, {
    status: 302,
    headers: {
      Location: apiUrl,
    },
  })
}
