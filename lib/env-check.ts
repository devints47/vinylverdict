import { cookies } from "next/headers"

/**
 * Check if the required environment variables are set
 */
export function checkEnv() {
  const requiredVars = ["OPENAI_API_KEY", "OPENAI_MUSIC_SNOB_ID", "OPENAI_TASTE_VALIDATOR_ID", "OPENAI_HISTORIAN_ID"]

  const missingVars = requiredVars.filter((varName) => !process.env[varName])

  if (missingVars.length > 0) {
    console.warn(`Missing environment variables: ${missingVars.join(", ")}`)
    return {
      isValid: false,
      missingVars,
    }
  }

  return {
    isValid: true,
    missingVars: [],
  }
}

/**
 * Check if the user is authenticated
 */
export async function checkAuth() {
  try {
    // Get the access token from cookies
    const cookieStore = cookies()
    const accessToken = cookieStore.get("spotify_access_token")?.value

    if (!accessToken) {
      return {
        isAuthenticated: false,
        reason: "no_access_token",
      }
    }

    // Check if token is expired
    const tokenExpiry = cookieStore.get("spotify_token_expiry")?.value
    if (tokenExpiry && Number.parseInt(tokenExpiry) < Date.now()) {
      return {
        isAuthenticated: false,
        reason: "token_expired",
        expiryTime: new Date(Number.parseInt(tokenExpiry)).toISOString(),
      }
    }

    // Check environment variables
    const envCheck = checkEnv()
    if (!envCheck.isValid) {
      return {
        isAuthenticated: true, // User is authenticated but env vars are missing
        envIssue: true,
        missingVars: envCheck.missingVars,
      }
    }

    return { isAuthenticated: true }
  } catch (error) {
    console.error("Error in checkAuth:", error)
    return {
      isAuthenticated: false,
      reason: "auth_check_error",
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}
