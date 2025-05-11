import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ReturnHomeButton } from "@/components/return-home-button"
import { ScrollToTop } from "@/components/scroll-to-top"

export default function CookiePolicyPage() {
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
              <h1 className="text-3xl font-bold mb-6 text-white">Cookie Policy</h1>
              <div className="prose prose-invert max-w-none">
                <p className="text-sm text-zinc-400">Last Updated: May 8, 2025</p>

                <h2 className="text-2xl font-bold mt-8 mb-4 text-purple-gradient">Introduction</h2>
                <p>
                  This Cookie Policy explains how SnobScore ("we," "our," or "us") uses cookies and similar technologies
                  to recognize you when you visit our website. It explains what these technologies are and why we use
                  them, as well as your rights to control our use of them.
                </p>

                <h2 className="text-2xl font-bold mt-8 mb-4 text-purple-gradient">What Are Cookies?</h2>
                <p>
                  Cookies are small data files that are placed on your computer or mobile device when you visit a
                  website. Cookies are widely used by website owners to make their websites work, or to work more
                  efficiently, as well as to provide reporting information.
                </p>

                <h2 className="text-2xl font-bold mt-8 mb-4 text-purple-gradient">Types of Cookies We Use</h2>
                <p>We use the following types of cookies:</p>
                <ul className="list-disc pl-6 space-y-2 my-4">
                  <li>
                    <strong>Essential Cookies:</strong> These cookies are necessary for the website to function
                    properly. They enable core functionality such as security, network management, and authentication.
                    You may not opt-out of these cookies.
                  </li>
                  <li>
                    <strong>Authentication Cookies:</strong> We use these cookies to authenticate your Spotify account
                    and maintain your login session. These cookies are essential for the functioning of our service.
                  </li>
                  <li>
                    <strong>Preference Cookies:</strong> These cookies remember your preferences and settings, such as
                    your selected time range for top tracks and artists.
                  </li>
                  <li>
                    <strong>Analytics Cookies:</strong> We use these cookies to collect information about how you
                    interact with our website, which pages you visit, and if you experience any errors. This helps us
                    improve our service.
                  </li>
                </ul>

                <h2 className="text-2xl font-bold mt-8 mb-4 text-purple-gradient">Spotify Authentication Cookies</h2>
                <p>
                  Snobcore.ME uses secure HTTP-only cookies to store authentication tokens received from Spotify. These
                  cookies are essential for the functioning of our service and allow us to:
                </p>
                <ul className="list-disc pl-6 space-y-2 my-4">
                  <li>Maintain your authenticated session with Spotify</li>
                  <li>Securely store access and refresh tokens</li>
                  <li>Automatically refresh your access token when it expires</li>
                </ul>
                <p>These authentication cookies include:</p>
                <ul className="list-disc pl-6 space-y-2 my-4">
                  <li>
                    <code className="bg-zinc-800 px-2 py-1 rounded text-sm">spotify_access_token</code>: Stores your
                    Spotify access token
                  </li>
                  <li>
                    <code className="bg-zinc-800 px-2 py-1 rounded text-sm">spotify_refresh_token</code>: Stores your
                    Spotify refresh token
                  </li>
                  <li>
                    <code className="bg-zinc-800 px-2 py-1 rounded text-sm">spotify_token_expiry</code>: Stores the
                    expiration time of your access token
                  </li>
                  <li>
                    <code className="bg-zinc-800 px-2 py-1 rounded text-sm">spotify_code_verifier</code>: Temporarily
                    stores the PKCE code verifier during authentication
                  </li>
                  <li>
                    <code className="bg-zinc-800 px-2 py-1 rounded text-sm">spotify_auth_state</code>: Temporarily
                    stores the state parameter for CSRF protection during authentication
                  </li>
                </ul>

                <h2 className="text-2xl font-bold mt-8 mb-4 text-purple-gradient">Third-Party Cookies</h2>
                <p>We may use third-party services that use cookies on our website, including:</p>
                <ul className="list-disc pl-6 space-y-2 my-4">
                  <li>
                    <strong>Analytics providers</strong> (like Google Analytics) to help us understand how users
                    interact with our website
                  </li>
                  <li>
                    <strong>Error monitoring services</strong> to help us identify and fix issues with our application
                  </li>
                </ul>

                <h2 className="text-2xl font-bold mt-8 mb-4 text-purple-gradient">How to Control Cookies</h2>
                <p>
                  Most web browsers allow you to control cookies through their settings preferences. However, if you
                  limit the ability of websites to set cookies, you may worsen your overall user experience and/or lose
                  access to certain functions of our website.
                </p>
                <p>
                  To opt out of Google Analytics tracking, you can install the{" "}
                  <a
                    href="https://tools.google.com/dlpage/gaoptout"
                    className="text-bright-purple hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Google Analytics Opt-out Browser Add-on
                  </a>
                  .
                </p>

                <h2 className="text-2xl font-bold mt-8 mb-4 text-purple-gradient">Essential Cookies</h2>
                <p>
                  Please note that essential cookies, including authentication cookies, cannot be disabled as they are
                  necessary for the functioning of our service. If you wish to stop the use of these cookies, you can
                  log out of Snobcore.ME, which will clear the authentication cookies from your browser.
                </p>

                <h2 className="text-2xl font-bold mt-8 mb-4 text-purple-gradient">Cookie Lifespan</h2>
                <p>
                  Cookies can remain on your computer or mobile device for different periods of time. Some cookies are
                  'session cookies', which exist only while your browser is open and are deleted automatically once you
                  close your browser. Other cookies are 'persistent cookies', which survive after your browser is closed
                  and can be used by websites to recognize your computer when you re-open your browser later.
                </p>
                <p>Our authentication cookies have the following lifespans:</p>
                <ul className="list-disc pl-6 space-y-2 my-4">
                  <li>
                    <code className="bg-zinc-800 px-2 py-1 rounded text-sm">spotify_access_token</code>: 1 hour (or
                    less, depending on Spotify's token expiry)
                  </li>
                  <li>
                    <code className="bg-zinc-800 px-2 py-1 rounded text-sm">spotify_refresh_token</code>: Session cookie
                    (deleted when browser is closed)
                  </li>
                  <li>
                    <code className="bg-zinc-800 px-2 py-1 rounded text-sm">spotify_token_expiry</code>: 1 hour
                  </li>
                  <li>
                    <code className="bg-zinc-800 px-2 py-1 rounded text-sm">spotify_code_verifier</code>: 10 minutes
                    (used only during authentication)
                  </li>
                  <li>
                    <code className="bg-zinc-800 px-2 py-1 rounded text-sm">spotify_auth_state</code>: 10 minutes (used
                    only during authentication)
                  </li>
                </ul>

                <h2 className="text-2xl font-bold mt-8 mb-4 text-purple-gradient">Changes to This Cookie Policy</h2>
                <p>
                  We may update this Cookie Policy from time to time to reflect changes in technology, regulation, or
                  our business practices. Any changes will become effective when we post the revised Cookie Policy on
                  this page with an updated "Last Updated" date.
                </p>

                <h2 className="text-2xl font-bold mt-8 mb-4 text-purple-gradient">Contact Us</h2>
                <p>If you have any questions about our use of cookies or this Cookie Policy, please contact us at:</p>
                <p className="pl-4 border-l-4 border-bright-purple/30 my-4">Email: privacy@snobscore.me</p>
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
