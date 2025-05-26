import { VinylLogo } from "./vinyl-logo"
import Link from "next/link"
import { PolicyNavLink } from "./policy-nav-link"

export function Footer() {
  return (
    <footer className="bg-black text-zinc-400 py-12 border-t border-zinc-800 w-full relative z-20">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Mobile Footer - 3 Column Grid */}
        <div className="md:hidden">
          <div className="mb-8">
            <Link href="/" className="flex items-center gap-1 mb-4 hover:opacity-90 transition-opacity">
              <VinylLogo size={48} />
              <span className="font-bold text-2xl text-purple-gradient tracking-tight">VinylVerdict</span>
            </Link>
            <p className="text-sm">
              Your personal music taste critic, powered by our resident Music Snob and your Spotify listening history.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-6 mb-8">
            <div>
              <h3 className="font-bold text-white mb-3">Links</h3>
              <ul className="space-y-2">
                <li>
                  <PolicyNavLink href="#features" className="hover:text-white transition-colors text-sm">
                    Features
                  </PolicyNavLink>
                </li>
                <li>
                  <PolicyNavLink href="#how-it-works" className="hover:text-white transition-colors text-sm">
                    How It Works
                  </PolicyNavLink>
                </li>
                <li>
                  <PolicyNavLink href="#testimonials" className="hover:text-white transition-colors text-sm">
                    Testimonials
                  </PolicyNavLink>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-white mb-3">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/privacy-policy" className="hover:text-white transition-colors text-sm">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms-of-service" className="hover:text-white transition-colors text-sm">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/cookie-policy" className="hover:text-white transition-colors text-sm">
                    Cookie Policy
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-white mb-3">Connect</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:text-white transition-colors text-sm">
                    Twitter
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors text-sm">
                    GitHub
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors text-sm">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Desktop Footer - 5 Column Layout with adjusted spacing */}
        <div className="hidden md:flex md:flex-row md:gap-0">
          {/* First column - SnobScore */}
          <div className="w-[22%] pr-4">
            <Link href="/" className="flex items-center gap-1 mb-4 hover:opacity-90 transition-opacity">
              <VinylLogo size={48} />
              <span className="font-bold text-2xl text-purple-gradient tracking-tight">VinylVerdict</span>
            </Link>
            <p className="text-sm">
              Your personal music taste critic, powered by our resident Music Snob and your Spotify listening history.
            </p>
          </div>

          {/* Second column - Links */}
          <div className="w-[19%] pr-4">
            <h3 className="font-bold text-white mb-4">Links</h3>
            <ul className="space-y-2">
              <li>
                <PolicyNavLink href="#features" className="hover:text-white transition-colors">
                  Features
                </PolicyNavLink>
              </li>
              <li>
                <PolicyNavLink href="#how-it-works" className="hover:text-white transition-colors">
                  How It Works
                </PolicyNavLink>
              </li>
              <li>
                <PolicyNavLink href="#testimonials" className="hover:text-white transition-colors">
                  Testimonials
                </PolicyNavLink>
              </li>
            </ul>
          </div>

          {/* Third column - Legal */}
          <div className="w-[19%] pr-4">
            <h3 className="font-bold text-white mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy-policy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-of-service" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/cookie-policy" className="hover:text-white transition-colors">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Fourth column - Connect (narrower) */}
          <div className="w-[12%] pr-0">
            <h3 className="font-bold text-white mb-4">Connect</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Twitter
                </a>
              </li>
              <li>
                <a href="https://github.com/devints47" className="hover:text-white transition-colors">
                  GitHub
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Fifth column - Spotify API (wider) */}
          <div className="w-[28%] flex flex-col items-center justify-center pl-0">
            <p className="text-white text-lg font-medium mb-6 text-center">Built Using the Spotify Web API</p>
            <div className="flex flex-col items-center">
              <a
                href="https://spotify.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-80 transition-opacity"
                aria-label="Visit Spotify Developer Portal"
              >
                <img src="/spotify_full_logo.svg" alt="Spotify" className="h-12" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-zinc-800 text-sm text-center">
          <p>© {new Date().getFullYear()} VinylVerdict. All rights reserved.</p>
          <p className="mt-2">
            This app is an independent tool using Spotify's Web API. It is not affiliated with Spotify. All critiques
            are generated for entertainment purposes.
          </p>
        </div>
      </div>
    </footer>
  )
}
