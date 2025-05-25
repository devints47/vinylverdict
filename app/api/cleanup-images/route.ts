import { del, list } from "@vercel/blob"
import { NextResponse } from "next/server"

export async function POST() {
  try {
    console.log("Starting image cleanup job...")

    // List all blobs with our specific prefix
    const { blobs } = await list({
      prefix: "vinyl-verdict-gen-image-",
    })

    console.log(`Found ${blobs.length} generated images to check`)

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
            console.log(`Marking for deletion: ${filename} (${new Date(timestamp).toISOString()})`)
          }
        } else {
          console.log(`Skipping blob with unexpected filename format: ${filename}`)
        }
      } catch (error) {
        console.error(`Error processing blob ${blob.pathname}:`, error)
      }
    }

    console.log(`Found ${blobsToDelete.length} images older than 14 days`)

    // Delete the old blobs
    let deletedCount = 0
    let errorCount = 0

    for (const blobUrl of blobsToDelete) {
      try {
        await del(blobUrl)
        deletedCount++
        console.log(`Deleted: ${blobUrl}`)
      } catch (error) {
        errorCount++
        console.error(`Failed to delete ${blobUrl}:`, error)
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

    console.log("Cleanup job completed:", result)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Cleanup job failed:", error)
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
