"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { exchangeCodeForTokens } from "@/lib/auth-utils"
import { VinylRecord } from "@/components/vinyl-record"

export default function CallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState<string | null>(null)
  const [status, setStatus] = useState<string>("Initializing...")
  const [detailedLogs, setDetailedLogs] = useState<string[]>([])

  const addLog = (message: string) => {
    console.log(message)
    setDetailedLogs((prev) => [...prev, message])
  }

  useEffect(() => {
    const handleCallback = async () => {
      try {
        addLog("Starting callback handler")
        setStatus("Checking for errors...")

        // Check for errors from Spotify
        const errorParam = searchParams.get("error")
        if (errorParam) {
          addLog(`Spotify returned an error: ${errorParam}`)

          // If the error is "access_denied" (user clicked Cancel), redirect to homepage
          if (errorParam === "access_denied") {
            addLog("User denied access. Redirecting to homepage...")
            window.location.href = "/"
            return
          }

          throw new Error(`Spotify authorization error: ${errorParam}`)
        }

        setStatus("Getting authorization code...")
        // Get the authorization code
        const code = searchParams.get("code")
        if (!code) {
          addLog("No authorization code found in URL")
          throw new Error("No authorization code found in the callback URL")
        }
        addLog(`Got authorization code: ${code.substring(0, 5)}...`)

        setStatus("Verifying state...")
        // State verification is now handled server-side
        const state = searchParams.get("state")
        if (!state) {
          addLog("Missing state parameter in URL")
          throw new Error("Missing state parameter in URL - authorization flow may have been interrupted")
        }

        setStatus("Exchanging code for tokens...")
        addLog("Starting token exchange")

        try {
          // Exchange the code for tokens
          const success = await exchangeCodeForTokens(code)

          if (!success) {
            addLog("Token exchange failed")
            throw new Error("Failed to exchange code for tokens")
          }

          addLog("Token exchange successful")

          setStatus("Redirecting to dashboard...")
          // Add a small delay before redirecting
          setTimeout(() => {
            // Use window.location.href for a hard redirect
            window.location.href = "/dashboard"
          }, 1000)
        } catch (exchangeError) {
          addLog(`Token exchange error: ${exchangeError instanceof Error ? exchangeError.message : "Unknown error"}`)
          throw new Error(
            `Failed to exchange code for tokens: ${exchangeError instanceof Error ? exchangeError.message : "Unknown error"}`,
          )
        }
      } catch (err) {
        console.error("Callback error:", err)
        const errorMessage = err instanceof Error ? err.message : "An unknown error occurred"
        setError(errorMessage)
        addLog(`Error: ${errorMessage}`)

        // Redirect to login page after a delay
        setTimeout(() => {
          window.location.href = "/login"
        }, 10000) // Longer delay to allow reading the error
      }
    }

    handleCallback()
  }, [router, searchParams])

  if (error) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
        <div className="bg-red-900/30 border border-red-800 rounded-lg p-6 max-w-md w-full text-center">
          <h1 className="text-xl font-bold text-white mb-4">Authentication Error</h1>
          <p className="text-red-300 mb-6">{error}</p>
          <p className="text-zinc-400">Redirecting to login page in 10 seconds...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      <div className="flex flex-col items-center">
        <div className="w-32 h-32 mb-8">
          <VinylRecord size={128} color="#9333ea" labelColor="#9333ea" showShadow={true} rpm={33.33} />
        </div>
        <h1 className="text-2xl font-bold text-white mb-4">Authenticating with Spotify</h1>
        <p className="text-zinc-300 mb-4 text-center">Connecting you with our resident Music Snob</p>
        <p className="text-zinc-500 text-sm">{status}</p>
      </div>
    </div>
  )
}
