// Server-side authentication utilities

// Generate a random string for the code verifier
export function generateCodeVerifier(length: number): string {
  let text = ""
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~"

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  }

  return text
}

// Generate a code challenge from the code verifier
export async function generateCodeChallenge(codeVerifier: string): Promise<string> {
  try {
    // In Node.js environment, use the crypto module
    const crypto = require("crypto")
    const base64URLEncode = (str: Buffer) =>
      str.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "")

    const sha256 = crypto.createHash("sha256").update(codeVerifier).digest()
    return base64URLEncode(sha256)
  } catch (error) {
    console.error("Error generating code challenge:", error)
    throw new Error("Failed to generate code challenge for PKCE flow")
  }
}

// Verify that the state parameter matches what we expect
export function verifyState(storedState: string | undefined, receivedState: string): boolean {
  if (!storedState) {
    console.error("No stored state found")
    return false
  }

  const isMatch = storedState === receivedState
  if (!isMatch) {
    console.error("State mismatch - possible CSRF attack")
  }

  return isMatch
}
