// Client-side authentication utilities that interact with server-side auth endpoints

/**
 * Get a valid access token from the server
 * The server will handle token refresh if needed
 */
export async function getValidAccessToken(): Promise<string | null> {
  try {
    const response = await fetch("/api/auth/token")

    if (!response.ok) {
      console.error("Failed to get valid access token:", response.status)
      return null
    }

    const data = await response.json()
    return data.accessToken || null
  } catch (error) {
    console.error("Error getting valid access token:", error)
    return null
  }
}

/**
 * Redirect to the server endpoint that will handle Spotify authorization
 */
export async function redirectToSpotifyAuthorize() {
  try {
    console.log("Initiating Spotify authorization...")

    // Call our server-side API to get the authorization URL
    const response = await fetch("/api/auth/authorize")

    if (!response.ok) {
      const error = await response.json()
      throw new Error(`Failed to get authorization URL: ${error.error || response.statusText}`)
    }

    const { authUrl } = await response.json()

    // Redirect to Spotify's authorization page
    window.location.href = authUrl
  } catch (error) {
    console.error("Error starting authorization:", error)
    throw error
  }
}

/**
 * Exchange authorization code for tokens (server-side)
 */
export async function exchangeCodeForTokens(code: string): Promise<boolean> {
  try {
    console.log("Exchanging code for tokens...")

    const response = await fetch("/api/auth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code }),
    })

    if (!response.ok) {
      // Try to parse the error response
      let errorMessage = "Unknown error"
      try {
        const errorData = await response.json()
        errorMessage = errorData.error || `HTTP error ${response.status}`
      } catch (parseError) {
        errorMessage = `Failed to parse error response: ${response.statusText}`
      }

      throw new Error(`Token exchange failed: ${errorMessage}`)
    }

    const result = await response.json()
    return result.success
  } catch (error) {
    console.error("Error exchanging code for tokens:", error)
    throw error // Re-throw to allow the caller to handle it
  }
}

/**
 * Validate the current access token
 */
export async function validateAccessToken(): Promise<{
  isValid: boolean
  reason?: string
}> {
  try {
    const response = await fetch("/api/auth/validate")

    if (!response.ok) {
      return { isValid: false, reason: "request_failed" }
    }

    return await response.json()
  } catch (error) {
    console.error("Error validating access token:", error)
    return { isValid: false, reason: "request_failed" }
  }
}

/**
 * Check if the user is authenticated
 */
export async function checkAuthentication(): Promise<boolean> {
  try {
    const { isValid, reason } = await validateAccessToken()

    if (!isValid) {
      console.log(`Token invalid, reason: ${reason}`)
      return false
    }

    return true
  } catch (error) {
    console.error("Error checking authentication:", error)
    return false
  }
}

/**
 * Logout (clear server-side cookies)
 */
export async function logout(): Promise<boolean> {
  try {
    const response = await fetch("/api/auth/logout", {
      method: "POST",
    })

    return response.ok
  } catch (error) {
    console.error("Error logging out:", error)
    return false
  }
}

/**
 * Get the current user's profile
 */
export async function getCurrentUser() {
  try {
    const response = await fetch("/api/auth/me")

    if (!response.ok) {
      return null
    }

    return await response.json()
  } catch (error) {
    console.error("Error getting current user:", error)
    return null
  }
}
