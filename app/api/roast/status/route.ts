import { type NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"
import { checkAuth } from "@/lib/env-check"

// Create OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const authResult = await checkAuth()
    if (!authResult.isAuthenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Parse request body
    const body = await request.json()
    const { threadId, runId } = body

    if (!threadId || !runId) {
      return NextResponse.json({ error: "Missing threadId or runId" }, { status: 400 })
    }

    // Get the run status
    const run = await openai.beta.threads.runs.retrieve(threadId, runId)

    // If the run is completed, get the messages
    if (run.status === "completed") {
      // Get the messages from the thread
      const messages = await openai.beta.threads.messages.list(threadId)

      // Find the assistant's response (should be the latest message)
      const assistantMessages = messages.data.filter((message) => message.role === "assistant")

      if (assistantMessages.length > 0) {
        // Get the latest assistant message
        const latestMessage = assistantMessages[0]

        // Extract the text content
        let roastContent = ""

        if (latestMessage.content && latestMessage.content.length > 0) {
          for (const contentPart of latestMessage.content) {
            if (contentPart.type === "text") {
              roastContent += contentPart.text.value
            }
          }
        }

        return NextResponse.json({
          status: "completed",
          roast: roastContent,
        })
      } else {
        return NextResponse.json({
          status: "completed",
          error: "No assistant response found",
        })
      }
    }

    // If the run is failed, return an error
    if (run.status === "failed") {
      return NextResponse.json({
        status: "failed",
        error: run.last_error?.message || "Run failed",
      })
    }

    // Otherwise, return the current status
    return NextResponse.json({
      status: run.status,
    })
  } catch (error: any) {
    console.error("Error in roast status API:", error)
    return NextResponse.json({ error: "Internal server error", details: error.message }, { status: 500 })
  }
}
