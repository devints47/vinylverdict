import { VinylLogo } from "./vinyl-logo"
import Link from "next/link"
import { PolicyNavLink } from "./policy-nav-link"

export function Footer() {
  return (
    <footer className="bg-black text-zinc-400 py-12 border-t border-zinc-800 w-full relative z-20">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="flex items-center gap-1 mb-4 hover:opacity-90 transition-opacity">
              <VinylLogo size={48} />
              <span className="font-bold text-2xl text-purple-gradient tracking-tight">SnobScore</span>
            </Link>
            <p className="text-sm">
              Your personal music taste critic, powered by our resident Music Snob and your Spotify listening history.
            </p>
          </div>

          <div>
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

          <div>
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

          <div>
            <h3 className="font-bold text-white mb-4">Connect</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Twitter
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
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
        </div>

        <div className="mt-12 pt-8 border-t border-zinc-800 text-sm text-center">
          <p>© {new Date().getFullYear()} SnobScore. All rights reserved.</p>
          <p className="mt-2">Not affiliated with Spotify. Spotify is a trademark of Spotify AB.</p>
        </div>
      </div>
    </footer>
  )
}
