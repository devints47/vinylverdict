import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ReturnHomeButton } from "@/components/return-home-button"
import { ScrollToTop } from "@/components/scroll-to-top"

export default function PrivacyPolicyPage() {
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
              <h1 className="text-3xl font-bold mb-6 text-white">Privacy Policy</h1>
              <div className="prose prose-invert max-w-none">
                <p className="text-sm text-zinc-400">Last Updated: May 8, 2025</p>

                <h2 className="text-2xl font-bold mt-8 mb-4 text-purple-gradient">Introduction</h2>
                <p>
                  Welcome to VinylVerdict ("we," "our," or "us"). We respect your privacy and are committed to
                  protecting your personal data. This privacy policy explains how we collect, use, and safeguard your
                  information when you use our service.
                </p>

                <h2 className="text-2xl font-bold mt-8 mb-4 text-purple-gradient">Spotify Integration</h2>
                <p>
                  VinylVerdict.fm is a third-party application that connects to Spotify's API. We adhere to Spotify's
                  Developer Terms of Service and User Data requirements. Our application:
                </p>
                <ul className="list-disc pl-6 space-y-2 my-4">
                  <li>
                    Accesses your Spotify data only after you explicitly authorize us through Spotify's OAuth
                    authentication process
                  </li>
                  <li>Only requests the minimum permissions (scopes) necessary to provide our service</li>
                  <li>Does not store your Spotify credentials (username and password)</li>
                  <li>Uses secure authentication methods (PKCE flow) as recommended by Spotify</li>
                </ul>

                <h2 className="text-2xl font-bold mt-8 mb-4 text-purple-gradient">Information We Collect</h2>
                <p>We collect the following information through your Spotify account:</p>
                <ul className="list-disc pl-6 space-y-2 my-4">
                  <li>Basic profile information (display name, profile image)</li>
                  <li>Your recently played tracks</li>
                  <li>Your top artists and tracks</li>
                  <li>Your country and subscription type</li>
                </ul>

                <h2 className="text-2xl font-bold mt-8 mb-4 text-purple-gradient">How We Use Your Information</h2>
                <p>We use your information to:</p>
                <ul className="list-disc pl-6 space-y-2 my-4">
                  <li>Display your music listening statistics</li>
                  <li>Generate personalized "roasts" about your music taste</li>
                  <li>Improve our service and user experience</li>
                  <li>Troubleshoot issues and respond to user inquiries</li>
                </ul>

                <h2 className="text-2xl font-bold mt-8 mb-4 text-purple-gradient">Data Storage and Security</h2>
                <p>
                  We prioritize the security of your data. Authentication tokens are stored in secure HTTP-only cookies
                  that cannot be accessed by client-side JavaScript. We do not permanently store your Spotify listening
                  data on our servers. Data is fetched from Spotify's API when you use our service and is cached only
                  for the duration of your session.
                </p>

                <h2 className="text-2xl font-bold mt-8 mb-4 text-purple-gradient">Third-Party Services</h2>
                <p>We use the following third-party services:</p>
                <ul className="list-disc pl-6 space-y-2 my-4">
                  <li>
                    <strong>Spotify API</strong>: To access your music listening data
                  </li>
                </ul>
                <p>
                  Each of these services has their own privacy policies governing how they handle your data. We
                  encourage you to review their privacy policies as well.
                </p>

                <h2 className="text-2xl font-bold mt-8 mb-4 text-purple-gradient">Your Rights</h2>
                <p>Depending on your location, you may have the following rights regarding your data:</p>
                <ul className="list-disc pl-6 space-y-2 my-4">
                  <li>The right to access your personal data</li>
                  <li>The right to correct inaccurate data</li>
                  <li>The right to request deletion of your data</li>
                  <li>The right to restrict or object to our processing of your data</li>
                  <li>The right to data portability</li>
                </ul>
                <p>To exercise these rights, please contact us using the information provided below.</p>

                <h2 className="text-2xl font-bold mt-8 mb-4 text-purple-gradient">Revoking Access</h2>
                <p>You can revoke VinylVerdict.fm's access to your Spotify account at any time by:</p>
                <ol className="list-decimal pl-6 space-y-2 my-4">
                  <li>Logging out of VinylVerdict.fm using the logout button</li>
                  <li>
                    Visiting your{" "}
                    <a
                      href="https://www.spotify.com/account/apps/"
                      className="text-bright-purple hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Spotify Account Apps page
                    </a>{" "}
                    and removing access for VinylVerdict.fm
                  </li>
                </ol>

                <h2 className="text-2xl font-bold mt-8 mb-4 text-purple-gradient">Children's Privacy</h2>
                <p>
                  Our service is not intended for individuals under the age of 13 (or the minimum age required for
                  creating a Spotify account in your country). We do not knowingly collect personal information from
                  children.
                </p>

                <h2 className="text-2xl font-bold mt-8 mb-4 text-purple-gradient">Changes to This Privacy Policy</h2>
                <p>
                  We may update this privacy policy from time to time. We will notify you of any changes by posting the
                  new privacy policy on this page and updating the "Last Updated" date.
                </p>

                <h2 className="text-2xl font-bold mt-8 mb-4 text-purple-gradient">Contact Us</h2>
                <p>If you have any questions about this privacy policy or our data practices, please contact us at:</p>
                <p className="pl-4 border-l-4 border-bright-purple/30 my-4">Email: privacy@vinylverdict.fm</p>
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
