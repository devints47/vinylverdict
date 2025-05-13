"use client"

import { useEffect } from "react"
import { SpotifyLoginButton } from "@/components/spotify-login-button"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { VinylRecord } from "@/components/vinyl-record"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { VinylVerdictLogo } from "@/components/vinyl-verdict-logo"

export default function LoginPage() {
  const { isAuthenticated, error, isLoading } = useAuth()
  const router = useRouter()

  // If user is already authenticated, redirect to dashboard
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      router.push("/dashboard")
    }
  }, [isAuthenticated, isLoading, router])

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-zinc-900 flex flex-col">
      <header className="p-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <VinylVerdictLogo size={32} />
          <span className="font-bold text-xl text-white">VinylVerdict</span>
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <VinylVerdictLogo size={80} className="mb-6" />
            <h1 className="text-3xl font-bold mb-4">Welcome Back</h1>
            <p className="text-zinc-400">
              Connect with your music streaming account to continue your journey of self-discovery (and mild
              humiliation).
            </p>
          </div>

          <div className="mb-8">
            <VinylRecord />
          </div>

          <div className="flex flex-col items-center gap-4">
            <SpotifyLoginButton />

            {error && (
              <Alert variant="destructive" className="mt-6 bg-red-900/50 border-red-800 w-full">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <p className="mt-6 text-sm text-zinc-500 text-center">
              By continuing, you agree to our{" "}
              <Link href="/terms-of-service" className="underline hover:text-white">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy-policy" className="underline hover:text-white">
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </main>

      <footer className="p-4 text-center text-sm text-zinc-600">
        <p>© {new Date().getFullYear()} Snobcore.ME. Not affiliated with Spotify.</p>
      </footer>
    </div>
  )
}
