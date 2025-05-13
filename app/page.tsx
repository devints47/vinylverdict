"use client"

import { Navbar } from "@/components/navbar"
import { SpotifyLoginButton } from "@/components/spotify-login-button"
import { VinylCollection } from "@/components/vinyl-collection"
import { AudioWave } from "@/components/audio-wave"
import { Testimonial } from "@/components/testimonial"
import { Footer } from "@/components/footer"
import { TechGridBackground } from "@/components/tech-grid-background"
import { AlertCircle, Music, Zap, Share2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useAuth } from "@/contexts/auth-context"
import { useVinyl } from "@/contexts/vinyl-context"
import { useRouter } from "next/navigation"
import { useEffect, useState, useRef } from "react"
import { AnimatedDescription } from "@/components/animated-description"
import { VinylVerdictLogo } from "@/components/vinyl-verdict-logo"

export default function LandingPage() {
  const { isAuthenticated, error, isLoading } = useAuth()
  const { selectedVinyl } = useVinyl()
  const router = useRouter()
  const [currentDescription, setCurrentDescription] = useState("")
  const vinylRef = useRef<HTMLDivElement>(null)
  const [vinylWidth, setVinylWidth] = useState(0)

  // We no longer automatically redirect authenticated users to the dashboard
  // This allows them to view the landing page while logged in
  useEffect(() => {
    // Only log authentication status, but don't redirect
    if (isAuthenticated && !isLoading) {
      console.log("User is authenticated, but staying on landing page")
    }
  }, [isAuthenticated, isLoading])

  // Update description when vinyl changes
  useEffect(() => {
    if (selectedVinyl) {
      setCurrentDescription(selectedVinyl.description)
    }
  }, [selectedVinyl])

  // Measure vinyl width
  useEffect(() => {
    const updateVinylWidth = () => {
      if (vinylRef.current) {
        // Get the width of the vinyl container
        const width = vinylRef.current.offsetWidth
        setVinylWidth(width)
      }
    }

    // Initial measurement
    updateVinylWidth()

    // Set up resize observer to update measurements when window resizes
    const resizeObserver = new ResizeObserver(updateVinylWidth)
    if (vinylRef.current) {
      resizeObserver.observe(vinylRef.current)
    }

    return () => {
      resizeObserver.disconnect()
    }
  }, [])

  // Handle scrolling to section based on hash in URL
  useEffect(() => {
    // Check if there's a hash in the URL
    if (typeof window !== "undefined") {
      const hash = window.location.hash
      if (hash) {
        // Remove the # character
        const id = hash.substring(1)
        // Find the element with the id
        const element = document.getElementById(id)
        // If the element exists, scroll to it
        if (element) {
          // Add a small delay to ensure the page is fully loaded
          setTimeout(() => {
            element.scrollIntoView({ behavior: "smooth" })
          }, 100)
        }
      }
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-zinc-900 text-white">
      <Navbar />

      {/* Combined Hero and Features Section with shared grid */}
      <section className="relative overflow-hidden">
        <TechGridBackground />

        {/* Hero Content */}
        <div className="pt-32 pb-20 px-4">
          <div className="container mx-auto relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                  <span className="text-purple-gradient">VinylVerdict</span> - Your Personal Music Taste Critic
                </h1>
                <p className="text-xl text-zinc-400 mb-8 max-w-lg">
                  Connect your Spotify account and choose from one of our resident Music Snobs to analyze your listening
                  habits with brutal honesty and witty commentary.
                </p>

                {/* Button container - completely restructured for proper mobile centering */}
                <div className="w-full flex flex-col items-center sm:items-start gap-4">
                  <div className="w-full flex justify-center sm:justify-start">
                    <SpotifyLoginButton text="Face Judgement" showHoverEffect={true} />
                  </div>
                  <p className="text-sm text-zinc-500 text-center sm:text-left">
                    No judgment. (Just kidding, lots of judgment.)
                  </p>
                </div>

                {error && (
                  <Alert variant="destructive" className="mt-6 bg-red-900/50 border-red-800">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
              </div>

              <div className="relative flex flex-col items-center">
                {/* Vinyl Collection with ref */}
                <div ref={vinylRef}>
                  <VinylCollection />
                </div>

                {/* Animated Description Box */}
                <div
                  style={{
                    width: vinylWidth > 0 ? `${vinylWidth * 2.0}px` : "100%",
                    maxWidth: "100%", // Ensure it doesn't overflow on small screens
                  }}
                >
                  <AnimatedDescription
                    description={currentDescription}
                    labelColor={selectedVinyl?.labelColor || "purple"}
                    className="mt-4 mb-6"
                  />
                </div>
              </div>
            </div>

            {/* Audio Wave - Moved below the hero content and centered */}
            <div className="mt-8 max-w-4xl mx-auto">
              <AudioWave />
            </div>
          </div>
        </div>

        {/* Features Content */}
        <div id="features" className="py-20 px-4 bg-black/30">
          <div className="container mx-auto relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-purple-gradient flex items-center justify-center gap-3">
                Why You Need a Music Snob
                <VinylVerdictLogo size={40} className="inline-block" />
              </h2>
              <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
                Because sometimes you need someone to tell you that your playlist is basic.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Custom Feature Card with Gradient - Instant Results */}
              <div className="bg-gradient-to-r from-zinc-900/80 to-black/80 border border-zinc-800 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm h-full">
                <div className="p-6">
                  <div className="bg-bright-purple/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                    <Zap className="h-6 w-6 text-bright-purple" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-white">Instant Results</h3>
                </div>
                <div className="px-6 pb-6">
                  <p className="text-zinc-400 text-base">
                    Get your musical roast in seconds, no waiting around for your ego to be crushed.
                  </p>
                </div>
              </div>

              {/* Custom Feature Card with Gradient - Spotify Integration */}
              <div className="bg-gradient-to-r from-zinc-900/80 to-black/80 border border-zinc-800 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm h-full">
                <div className="p-6">
                  <div className="bg-bright-purple/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                    <Music className="h-6 w-6 text-bright-purple" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-white">Spotify Integration</h3>
                </div>
                <div className="px-6 pb-6">
                  <p className="text-zinc-400 text-base">
                    Securely connect your Spotify account to analyze your recently played tracks and top artists.
                  </p>
                </div>
              </div>

              {/* Custom Feature Card with Gradient - Share Your Roast */}
              <div className="bg-gradient-to-r from-zinc-900/80 to-black/80 border border-zinc-800 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm h-full">
                <div className="p-6">
                  <div className="bg-bright-purple/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                    <Share2 className="h-6 w-6 text-bright-purple" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-white">Share Your Roast</h3>
                </div>
                <div className="px-6 pb-6">
                  <p className="text-zinc-400 text-base">
                    Brave enough to share your musical shame? Export and share your critique with friends.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Built Using Spotify Web API Section - WITH GRID */}
      <section className="relative py-12 px-4 bg-black overflow-hidden">
        <TechGridBackground />
        <div className="container mx-auto relative z-10">
          <div className="bg-black py-6 px-4 rounded-xl max-w-3xl mx-auto">
            {/* Mobile layout (stacked vertically) */}
            <div className="flex flex-col items-center text-center md:hidden gap-4">
              <p className="text-2xl text-zinc-300 font-medium">Built Using the</p>
              <div className="py-3">
                <a href="https://www.spotify.com" target="_blank" rel="noopener noreferrer" title="Visit Spotify">
                  <img src="/spotify_full_logo.svg" alt="Spotify" className="h-[80px] w-auto" loading="lazy" />
                </a>
              </div>
              <p className="text-2xl text-zinc-300 font-medium">Web API</p>
            </div>

            {/* Desktop layout (horizontal) */}
            <div className="hidden md:flex flex-row items-center justify-center">
              <p className="text-2xl md:text-3xl text-zinc-300 mr-8 font-medium">Built Using the</p>
              <div className="px-3">
                <a href="https://www.spotify.com" target="_blank" rel="noopener noreferrer" title="Visit Spotify">
                  <img
                    src="/spotify_full_logo.svg"
                    alt="Spotify"
                    className="h-[70px] min-h-[70px] w-auto"
                    loading="lazy"
                  />
                </a>
              </div>
              <p className="text-2xl md:text-3xl text-zinc-300 ml-8 font-medium">Web API</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section - WITH GRID */}
      <section id="testimonials" className="relative py-20 px-4 bg-black overflow-hidden">
        <TechGridBackground />
        <div className="container mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-purple-gradient">What Users Are Saying</h2>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto">People who have faced the music (critic)</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Testimonial
              quote="I never knew my obsession with 80s power ballads made me so basic. Thanks for the existential crisis, VinylVerdict!"
              name="Alex Johnson"
              title="Reformed Music Listener"
              avatar="/diverse-group.png"
            />
            <Testimonial
              quote="The Music Snob told me my taste was 'aggressively mediocre with hints of trying too hard.' Harsh but fair."
              name="Sam Rodriguez"
              title="Indie Music Fan"
              avatar="/person-with-glasses.png"
            />
            <Testimonial
              quote="I showed my VinylVerdict roast to my friends and now they won't let me control the playlist anymore. 10/10 would recommend."
              name="Jamie Smith"
              title="Former DJ"
              avatar="/person-with-headphones.png"
            />
          </div>
        </div>
      </section>

      {/* How It Works Section - NO GRID - HIDDEN FOR NOW */}
      <section id="how-it-works" className="hidden py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-purple-gradient">How It Works</h2>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
              Three simple steps to musical self-awareness (or self-loathing)
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-bright-purple/20 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-gradient">1</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Connect Account</h3>
              <p className="text-zinc-400">Securely log in with your music streaming account.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-bright-purple/20 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-gradient">2</span>
              </div>
              <h3 className="text-xl font-bold mb-2">View Your Stats</h3>
              <p className="text-zinc-400">See your recently played tracks and top artists/songs.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-bright-purple/20 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-gradient">3</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Get Roasted</h3>
              <p className="text-zinc-400">Receive a witty critique from our resident Music Snob.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - WITH GRID */}
      <section className="relative py-20 px-4 bg-black overflow-hidden cta-section">
        <TechGridBackground />
        <div className="container mx-auto max-w-4xl relative z-10">
          <div className="bg-gradient-to-r from-zinc-900/80 to-black/80 p-8 md:p-12 rounded-2xl border border-zinc-800 text-center backdrop-blur-sm">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-purple-gradient">Ready to Face the Music?</h2>
            <p className="text-xl text-zinc-400 mb-8 max-w-2xl mx-auto">
              Connect your account and discover what your playlist says about you. If you dare.
            </p>
            <div className="flex justify-center">
              <SpotifyLoginButton text="I'm Ready" />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
