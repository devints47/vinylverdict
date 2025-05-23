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

    const { authUrl, codeVerifier, state } = await response.json()

    // Store code verifier and state in localStorage as a fallback for Safari iOS
    // This addresses the issue where Safari might drop cookies during redirects
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("spotify_code_verifier_fallback", codeVerifier)
        localStorage.setItem("spotify_auth_state_fallback", state)
        console.log("Stored auth fallback values in localStorage")
      } catch (storageError) {
        console.warn("Could not store auth fallback in localStorage:", storageError)
        // Continue even if localStorage fails - we'll still have cookies for most browsers
      }
    }

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
export async function exchangeCodeForTokens(code: string, fallbackVerifier?: string): Promise<boolean> {
  try {
    console.log("Exchanging code for tokens...")

    const payload: { code: string; codeVerifier?: string } = { code }

    // If a fallback verifier is provided, include it in the request
    // This allows the server to use it if the cookie is missing
    if (fallbackVerifier) {
      payload.codeVerifier = fallbackVerifier
      console.log("Using fallback code verifier")
    }

    const response = await fetch("/api/auth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
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
    const accessToken = localStorage.getItem("accessToken")

    if (!accessToken) {
      return false
    }

    // Check if token needs refreshing
    await refreshTokenIfNeeded()

    // Validate the token
    const response = await fetch("/api/auth/validate", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    return response.ok
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
    // Clear any localStorage fallback values
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem("spotify_code_verifier_fallback")
        localStorage.removeItem("spotify_auth_state_fallback")
      } catch (e) {
        // Ignore localStorage errors
      }
    }

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

/**
 * Refresh the access token if needed
 */
export async function refreshTokenIfNeeded(): Promise<boolean> {
  try {
    // Check if token is about to expire (within 10 minutes)
    const expiresAt = localStorage.getItem("expiresAt")

    if (!expiresAt) {
      return false
    }

    const expiresAtMs = Number.parseInt(expiresAt, 10)
    const now = Date.now()

    // If token expires in less than 10 minutes, refresh it
    if (expiresAtMs - now < 10 * 60 * 1000) {
      console.log("Token is about to expire, refreshing...")

      const response = await fetch("/api/auth/refresh", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (response.ok) {
        const data = await response.json()

        // Update token in localStorage
        localStorage.setItem("accessToken", data.accessToken)
        localStorage.setItem("refreshToken", data.refreshToken)
        localStorage.setItem("expiresAt", (Date.now() + data.expiresIn * 1000).toString())

        return true
      }

      return false
    }

    return true
  } catch (error) {
    console.error("Error refreshing token:", error)
    return false
  }
}
