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
import { SimpleDescription } from "@/components/simple-description"
import { VinylVerdictLogo } from "@/components/vinyl-verdict-logo"

// Structured data for the homepage
const homepageStructuredData = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "VinylVerdict.FM - Your Personal Music Taste Analyst",
  url: "https://vinylverdict.fm",
  description: "Ready to face the music? Connect your Spotify account for personalized music insights, track analysis, and a shareable analysis. From brutal honesty to historical insights - prepare for your verdict.",
  mainEntity: {
    "@type": "SoftwareApplication",
    name: "VinylVerdict.fm",
    applicationCategory: "EntertainmentApplication",
    operatingSystem: "Web Browser",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD"
    }
  },
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [{
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: "https://vinylverdict.fm"
    }]
  },
  potentialAction: {
    "@type": "UseAction",
    name: "Analyze Music Taste",
    object: {
      "@type": "WebApplication",
      name: "VinylVerdict.fm"
    }
  }
}

export default function LandingPage() {
  const { isAuthenticated, isLoading } = useAuth()
  const { selectedVinyl } = useVinyl()
  const router = useRouter()
  const [currentDescription, setCurrentDescription] = useState("")

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

  return (
    <>
      {/* Homepage Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homepageStructuredData) }}
      />
      
      <div className="min-h-screen bg-gradient-to-b from-black to-zinc-900 text-white">
        <Navbar />

        {/* Combined Hero and Features Section with shared grid */}
        <main>
          <section className="relative overflow-hidden">
            <TechGridBackground />

            {/* Hero Content */}
            <div className="pt-32 pb-20 px-4">
              <div className="container mx-auto relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  <header>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
                      <span className="text-purple-gradient">VinylVerdict.FM</span>
                    </h1>
                    <h2 className="text-2xl mb-4 md:text-3xl lg:text-4xl font-bold leading-tight">
                      Your Music Taste — Personified
                    </h2>
                    <p className="text-xl text-zinc-400 mb-8 max-w-lg">
                      Connect your Spotify account and choose from one of our resident music analysts to provide personalized
                      insight into your listening habits with distinct perspectives, from brutal honesty to historical retrospection.
                    </p>

                    {/* Button container - completely restructured for proper mobile centering */}
                    <div className="w-full flex flex-col items-center sm:items-start gap-4">
                      <div className="w-full flex justify-center sm:justify-start">
                        <SpotifyLoginButton text="Analyze My Music" showHoverEffect={true} />
                      </div>
                      <p className="text-sm text-zinc-500 text-center sm:text-left">
                        From recently played to all-time favorites. (Prepare for judgment.)
                      </p>
                    </div>
                  </header>

                  <div className="relative flex flex-col items-center">
                    {/* Vinyl Collection */}
                    <div>
                      <VinylCollection />
                    </div>

                    {/* Simple Description Box */}
                    <div className="mt-4 mb-6 w-full max-w-[644px] px-4 sm:px-0">
                      <SimpleDescription
                        description={currentDescription}
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
            <section id="features" className="py-20 px-4 bg-black/30">
              <div className="container mx-auto relative z-10">
                <header className="text-center mb-16">
                  <h2 className="text-3xl md:text-4xl font-bold mb-4 text-purple-gradient flex items-center justify-center gap-3">
                    Choose Your Music Analyst
                    <VinylVerdictLogo size={40} className="inline-block" />
                  </h2>
                  <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
                    Because different perspectives reveal different truths about your musical journey.
                  </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Custom Feature Card with Gradient - Multiple Personalities */}
                  <article className="bg-gradient-to-r from-zinc-900/80 to-black/80 border border-zinc-800 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm h-full">
                    <div className="p-6">
                      <div className="bg-bright-purple/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                        <Zap className="h-6 w-6 text-bright-purple" />
                      </div>
                      <h3 className="text-xl font-bold mb-2 text-white">Multiple Perspectives</h3>
                    </div>
                    <div className="px-6 pb-6">
                      <p className="text-zinc-400 text-base">
                        From critical Music Snob to mystical Historian, each personality offers a unique take on your
                        music taste with personalized insights.
                      </p>
                    </div>
                  </article>

                  {/* Custom Feature Card with Gradient - Spotify Integration */}
                  <article className="bg-gradient-to-r from-zinc-900/80 to-black/80 border border-zinc-800 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm h-full">
                    <div className="p-6">
                      <div className="bg-bright-purple/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                        <Music className="h-6 w-6 text-bright-purple" />
                      </div>
                      <h3 className="text-xl font-bold mb-2 text-white">Complete Spotify Analysis</h3>
                    </div>
                    <div className="px-6 pb-6">
                      <p className="text-zinc-400 text-base">
                        Toggle between recently played tracks and your all-time favorites to get a comprehensive view of
                        your music taste and listening patterns.
                      </p>
                    </div>
                  </article>

                  {/* Custom Feature Card with Gradient - Share Your Analysis */}
                  <article className="bg-gradient-to-r from-zinc-900/80 to-black/80 border border-zinc-800 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm h-full">
                    <div className="p-6">
                      <div className="bg-bright-purple/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                        <Share2 className="h-6 w-6 text-bright-purple" />
                      </div>
                      <h3 className="text-xl font-bold mb-2 text-white">Share Your Analysis</h3>
                    </div>
                    <div className="px-6 pb-6">
                      <p className="text-zinc-400 text-base">
                        Brave enough to share your musical profile? Export and share your personalized analysis with
                        friends on social media.
                      </p>
                    </div>
                  </article>
                </div>
              </div>
            </section>
          </section>

          {/* Built Using Spotify Web API Section */}
          <section className="relative py-12 px-4 bg-black overflow-hidden">
            <TechGridBackground />
            <div className="container mx-auto relative z-10">
              <div className="bg-black py-6 px-4 rounded-xl max-w-3xl mx-auto">
                <div className="flex flex-col items-center text-center gap-4">
                  <p className="text-2xl md:text-3xl text-zinc-300 font-medium">Built Using the Spotify Web API</p>
                  <div className="mt-6">
                    <a href="https://www.spotify.com" target="_blank" rel="noopener noreferrer" title="Visit Spotify">
                      <img
                        src="/spotify_full_logo.svg"
                        alt="Spotify"
                        className="h-[60px] md:h-[70px] w-auto"
                        width="240"
                        height="70"
                        loading="lazy"
                      />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Testimonials Section */}
          <section id="testimonials" className="relative py-20 px-4 bg-black overflow-hidden">
            <TechGridBackground />
            <div className="container mx-auto relative z-10">
              <header className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-purple-gradient">What Users Are Saying</h2>
                <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
                  People who have explored their musical identities
                </p>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Testimonial
                  quote="I never knew my obsession with 80s power ballads made me so basic. Thanks for the existential crisis, VinylVerdict!"
                  name="Alex Johnson"
                  title="Reformed Music Listener"
                  avatar="/person-with-headphones-2.png"
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
                  avatar="/dj-portrait.png"
                />
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="relative py-20 px-4 bg-black overflow-hidden cta-section">
            <TechGridBackground />
            <div className="container mx-auto max-w-4xl relative z-10">
              <div className="bg-gradient-to-r from-zinc-900/80 to-black/80 p-8 md:p-12 rounded-2xl border border-zinc-800 text-center backdrop-blur-sm">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-purple-gradient">Ready to Face the Music?</h2>
                <p className="text-xl text-zinc-400 mb-8 max-w-2xl mx-auto">
                  Connect your account and explore your listening habits through multiple perspectives. Choose your
                  analyst.
                </p>
                <div className="flex justify-center">
                  <SpotifyLoginButton text="I'm Ready" />
                </div>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  )
}
