import { del, list } from "@vercel/blob"
import { NextResponse } from "next/server"

export async function POST() {
  try {
    // List all blobs with our specific prefix
    const { blobs } = await list({
      prefix: "vinyl-verdict-gen-image-",
    })

    const fourteenDaysAgo = Date.now() - 14 * 24 * 60 * 60 * 1000 // 14 days in milliseconds
    const blobsToDelete: string[] = []

    for (const blob of blobs) {
      try {
        // Extract timestamp from filename: vinyl-verdict-gen-image-1234567890.jpg
        const filename = blob.pathname.split("/").pop() || ""
        const timestampMatch = filename.match(/vinyl-verdict-gen-image-(\d+)\.jpg$/)

        if (timestampMatch) {
          const timestamp = Number.parseInt(timestampMatch[1])

          if (timestamp < fourteenDaysAgo) {
            blobsToDelete.push(blob.url)
          }
        }
      } catch (error) {
        // Continue processing other blobs if one fails
        continue
      }
    }

    // Delete the old blobs
    let deletedCount = 0
    let errorCount = 0

    for (const blobUrl of blobsToDelete) {
      try {
        await del(blobUrl)
        deletedCount++
      } catch (error) {
        errorCount++
      }
    }

    const result = {
      success: true,
      totalChecked: blobs.length,
      markedForDeletion: blobsToDelete.length,
      successfullyDeleted: deletedCount,
      errors: errorCount,
      timestamp: new Date().toISOString(),
    }

    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}

// Allow manual triggering via GET for testing
export async function GET() {
  return POST()
}
