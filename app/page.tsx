"use client"

import { Suspense, lazy, useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { SpotifyLoginButton } from "@/components/spotify-login-button"
import { AudioWave } from "@/components/audio-wave"
import { FeatureCard } from "@/components/feature-card"
import { Testimonial } from "@/components/testimonial"
import { Footer } from "@/components/footer"
import { AlertCircle, BarChart3, Headphones, MessageSquare, Music, Zap, Share2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"

// Lazy load components that aren't needed immediately
const TechGridBackground = lazy(() =>
  import("@/components/tech-grid-background").then((mod) => ({ default: mod.TechGridBackground })),
)
const VinylCollectionUnified = lazy(() =>
  import("@/components/vinyl-collection-unified").then((mod) => ({ default: mod.VinylCollectionUnified })),
)

export default function LandingPage() {
  const { isAuthenticated, error, isLoading } = useAuth()
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)

  // We no longer automatically redirect authenticated users to the dashboard
  // This allows them to view the landing page while logged in
  useEffect(() => {
    // Only log authentication status, but don't redirect
    if (isAuthenticated && !isLoading) {
      console.log("User is authenticated, but staying on landing page")
    }

    // Set isClient to true once component mounts
    setIsClient(true)
  }, [isAuthenticated, isLoading])

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
  }, [isClient])

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-zinc-900 text-white">
      <Navbar />

      {/* Combined Hero and Features Section with shared grid */}
      <section className="relative overflow-hidden">
        <Suspense fallback={<div className="absolute inset-0 bg-black"></div>}>
          {isClient && <TechGridBackground />}
        </Suspense>

        {/* Hero Content */}
        <div className="pt-32 pb-20 px-4">
          <div className="container mx-auto relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                  Meet Your <span className="text-purple-gradient">Personal</span> Music Taste Critic
                </h1>
                <p className="text-xl text-zinc-400 mb-8 max-w-lg">
                  Connect your Spotify account and let our resident Music Snob analyze your listening habits with brutal
                  honesty and witty commentary.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 items-start">
                  <SpotifyLoginButton text="Face Judgement" showHoverEffect={true} />
                  <p className="text-sm text-zinc-500 mt-2">No judgment. (Just kidding, lots of judgment.)</p>
                </div>

                {error && (
                  <Alert variant="destructive" className="mt-6 bg-red-900/50 border-red-800">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
              </div>

              <div className="relative">
                <Suspense fallback={<div className="w-full h-[300px] bg-zinc-900/50 rounded-lg animate-pulse"></div>}>
                  {isClient && <VinylCollectionUnified />}
                </Suspense>
                <div className="mt-8">
                  <AudioWave />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Content */}
        <div id="features" className="py-20 px-4 bg-black/30">
          <div className="container mx-auto relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-purple-gradient">Why You Need a Music Snob</h2>
              <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
                Because sometimes you need someone to tell you that your playlist is basic.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard
                title="Brutally Honest Analysis"
                description="Get a no-holds-barred critique of your music taste from our resident Music Snob with a PhD in pretentiousness."
                icon={MessageSquare}
              />
              <FeatureCard
                title="Spotify Integration"
                description="Securely connect your Spotify account to analyze your recently played tracks and top artists."
                icon={Music}
              />
              <FeatureCard
                title="Personalized Insights"
                description="Discover patterns in your listening habits that reveal your true musical personality."
                icon={BarChart3}
              />
              <FeatureCard
                title="Time-Based Analysis"
                description="See how your music taste has evolved (or devolved) over different time periods."
                icon={Headphones}
              />
              <FeatureCard
                title="Instant Results"
                description="Get your musical roast in seconds, no waiting around for your ego to be crushed."
                icon={Zap}
              />
              <FeatureCard
                title="Share Your Roast"
                description="Brave enough to share your musical shame? Export and share your critique with friends."
                icon={Share2}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Built Using Spotify Web API Section - WITH GRID */}
      <section className="relative py-12 px-4 bg-black overflow-hidden">
        <Suspense fallback={null}>{isClient && <TechGridBackground />}</Suspense>
        <div className="container mx-auto relative z-10">
          <div className="bg-black py-1 px-4 rounded-xl max-w-3xl mx-auto">
            <div className="flex flex-row items-center justify-center">
              <p className="text-2xl md:text-3xl text-zinc-300 mr-8 font-medium">Built Using the</p>
              <div className="px-3">
                <img
                  src="/spotify_full_logo.svg"
                  alt="Spotify"
                  className="h-[70px] min-h-[70px] w-auto"
                  loading="lazy"
                />
              </div>
              <p className="text-2xl md:text-3xl text-zinc-300 ml-8 font-medium">Web API</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section - WITH GRID */}
      <section id="testimonials" className="relative py-20 px-4 bg-black overflow-hidden">
        <Suspense fallback={null}>{isClient && <TechGridBackground />}</Suspense>
        <div className="container mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-purple-gradient">What Users Are Saying</h2>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto">People who have faced the music (critic)</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Testimonial
              quote="I never knew my obsession with 80s power ballads made me so basic. Thanks for the existential crisis, SnobScore!"
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
              quote="I showed my SnobScore roast to my friends and now they won't let me control the playlist anymore. 10/10 would recommend."
              name="Jamie Smith"
              title="Former DJ"
              avatar="/person-with-headphones.png"
            />
          </div>
        </div>
      </section>

      {/* CTA Section - WITH GRID */}
      <section className="relative py-20 px-4 bg-black overflow-hidden">
        <Suspense fallback={null}>{isClient && <TechGridBackground />}</Suspense>
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
