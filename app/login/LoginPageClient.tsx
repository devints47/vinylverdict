"use client"

import { useEffect } from "react"
import { SpotifyLoginButton } from "@/components/spotify-login-button"
import { VinylRecord } from "@/components/vinyl-record"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { VinylVerdictLogo } from "@/components/vinyl-verdict-logo"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { ArrowLeft, ArrowRight } from "lucide-react"

const breadcrumbItems = [
  { label: "Home", href: "/" },
  { label: "Login", href: "/login" }
]

export default function LoginPageClient() {
  const { isAuthenticated, isLoading, login } = useAuth()
  const router = useRouter()

  // If user is already authenticated, redirect to dashboard
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      router.push("/dashboard")
    }
  }, [isAuthenticated, isLoading, router])

  const handleLogin = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    login()
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-zinc-900 flex flex-col">
      <header className="p-4 flex flex-col items-center justify-center">
        <VinylVerdictLogo size={80} className="mb-4" />
        <div className="flex flex-col items-center gap-4">
          <Breadcrumbs items={breadcrumbItems} />
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="btn-gradient holographic-shimmer text-white font-bold py-3 px-6 rounded-full text-base transition-all duration-300 hover:scale-105 flex items-center gap-2 shadow-lg"
            >
              <span><ArrowLeft className="inline-block" /> Home</span>
            </Link>
            <button
              onClick={handleLogin}
              disabled={isLoading}
              className="btn-gradient holographic-shimmer text-white font-bold py-3 px-6 rounded-full text-base transition-all duration-300 hover:scale-105 flex items-center gap-2 shadow-lg disabled:opacity-50"
            >
              <span>Log in <ArrowRight className="inline-block" /></span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
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
