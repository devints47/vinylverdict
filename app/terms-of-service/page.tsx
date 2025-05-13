import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ReturnHomeButton } from "@/components/return-home-button"
import { ScrollToTop } from "@/components/scroll-to-top"

export default function TermsOfServicePage() {
  return (
    <ScrollToTop>
      <div className="min-h-screen bg-black flex flex-col">
        <Navbar />

        <main className="flex-1 container mx-auto px-4 py-12 mt-16">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <ReturnHomeButton />
            </div>

            <div className="bg-gradient-to-r from-zinc-900 to-black rounded-lg p-8 shadow-lg border border-zinc-800">
              <h1 className="text-3xl font-bold mb-6 text-white">Terms of Service</h1>
              <div className="prose prose-invert max-w-none">
                <p className="text-sm text-zinc-400">Last Updated: May 8, 2025</p>

                <h2 className="text-2xl font-bold mt-8 mb-4 text-purple-gradient">Introduction</h2>
                <p>
                  Welcome to VinylVerdict. These Terms of Service ("Terms") govern your use of our website and services.
                  By accessing or using VinylVerdict, you agree to be bound by these Terms. If you disagree with any
                  part of the Terms, you may not access the service.
                </p>

                <h2 className="text-2xl font-bold mt-8 mb-4 text-purple-gradient">Spotify Integration</h2>
                <p>
                  VinylVerdict.fm is a third-party application that integrates with Spotify's API. Our use of Spotify's
                  API and your Spotify data is governed by{" "}
                  <a
                    href="https://developer.spotify.com/terms"
                    className="text-bright-purple hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Spotify's Developer Terms of Service
                  </a>
                  . By using VinylVerdict.fm, you also agree to Spotify's Terms of Use and Privacy Policy.
                </p>
                <p>In accordance with Spotify's requirements:</p>
                <ul className="list-disc pl-6 space-y-2 my-4">
                  <li>We clearly identify that VinylVerdict.fm is powered by Spotify</li>
                  <li>We do not modify or filter the metadata returned by Spotify's API</li>
                  <li>We provide attribution to Spotify and the relevant artists</li>
                  <li>We do not transfer Spotify content to third parties without explicit permission</li>
                  <li>We do not use Spotify data to target advertising</li>
                  <li>We do not cache Spotify content longer than permitted by Spotify's Developer Terms</li>
                </ul>

                <h2 className="text-2xl font-bold mt-8 mb-4 text-purple-gradient">User Accounts and Authorization</h2>
                <p>
                  To use VinylVerdict.fm, you must authorize our application to access your Spotify account data. You
                  are responsible for maintaining the confidentiality of your Spotify account credentials and for all
                  activities that occur under your account.
                </p>
                <p>
                  You may revoke VinylVerdict.fm's access to your Spotify account at any time through your Spotify
                  account settings or by logging out of VinylVerdict.fm.
                </p>

                <h2 className="text-2xl font-bold mt-8 mb-4 text-purple-gradient">Acceptable Use</h2>
                <p>When using VinylVerdict.fm, you agree not to:</p>
                <ul className="list-disc pl-6 space-y-2 my-4">
                  <li>Use the service in any way that violates any applicable laws or regulations</li>
                  <li>Attempt to gain unauthorized access to any part of the service</li>
                  <li>Use the service to distribute malware or other harmful code</li>
                  <li>Interfere with or disrupt the integrity or performance of the service</li>
                  <li>
                    Scrape, crawl, or otherwise extract data from the service beyond what is available through the user
                    interface
                  </li>
                  <li>Use the service in a manner that could disable, overburden, or impair the service</li>
                </ul>

                <h2 className="text-2xl font-bold mt-8 mb-4 text-purple-gradient">Intellectual Property</h2>
                <p>
                  VinylVerdict.fm and its original content, features, and functionality are owned by VinylVerdict.fm and
                  are protected by international copyright, trademark, patent, trade secret, and other intellectual
                  property laws.
                </p>
                <p>
                  The Spotify name, logo, and related marks are trademarks of Spotify AB and are used with permission.
                  We do not claim any ownership rights to Spotify content, including but not limited to album artwork,
                  artist images, and track metadata.
                </p>

                <h2 className="text-2xl font-bold mt-8 mb-4 text-purple-gradient">User-Generated Content</h2>
                <p>
                  The "roasts" generated by our service are based on your music listening data and are created using
                  artificial intelligence. While we strive to make these roasts humorous and entertaining, they are not
                  intended to be offensive or harmful. We do not guarantee the accuracy, quality, or appropriateness of
                  these generated roasts.
                </p>

                <h2 className="text-2xl font-bold mt-8 mb-4 text-purple-gradient">Disclaimer of Warranties</h2>
                <p>
                  VinylVerdict.fm is provided "as is" and "as available" without any warranties of any kind, either
                  express or implied. We do not guarantee that the service will be uninterrupted, timely, secure, or
                  error-free.
                </p>

                <h2 className="text-2xl font-bold mt-8 mb-4 text-purple-gradient">Limitation of Liability</h2>
                <p>
                  In no event shall VinylVerdict.fm, its directors, employees, partners, agents, suppliers, or
                  affiliates be liable for any indirect, incidental, special, consequential, or punitive damages,
                  including without limitation, loss of profits, data, use, goodwill, or other intangible losses,
                  resulting from your access to or use of or inability to access or use the service.
                </p>

                <h2 className="text-2xl font-bold mt-8 mb-4 text-purple-gradient">Changes to Terms</h2>
                <p>
                  We reserve the right to modify or replace these Terms at any time. If a revision is material, we will
                  provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material
                  change will be determined at our sole discretion.
                </p>

                <h2 className="text-2xl font-bold mt-8 mb-4 text-purple-gradient">Governing Law</h2>
                <p>
                  These Terms shall be governed by and construed in accordance with the laws of the United States,
                  without regard to its conflict of law provisions.
                </p>

                <h2 className="text-2xl font-bold mt-8 mb-4 text-purple-gradient">Contact Us</h2>
                <p>If you have any questions about these Terms, please contact us at:</p>
                <p className="pl-4 border-l-4 border-bright-purple/30 my-4">Email: terms@vinylverdict.fm</p>
              </div>
            </div>

            <div className="mt-6">
              <ReturnHomeButton />
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </ScrollToTop>
  )
}
