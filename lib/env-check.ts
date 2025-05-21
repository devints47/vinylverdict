// Environment variable validation
export function validateEnvironment() {
  const requiredVars = [
    "NEXT_PUBLIC_SPOTIFY_CLIENT_ID",
    "NEXT_PUBLIC_REDIRECT_URI",
    "OPENAI_API_KEY",
    "OPENAI_MUSIC_SNOB_ID",
    "OPENAI_TASTE_VALIDATOR_ID",
    "OPENAI_HISTORIAN_ID", // Added new Historian ID
  ]

  const missingVars = requiredVars.filter((varName) => !process.env[varName])

  if (missingVars.length > 0) {
    console.warn(`Missing environment variables: ${missingVars.join(", ")}`)
    return false
  }

  return true
}

// Check for OpenAI assistant IDs
export function checkOpenAIAssistants() {
  const assistantVars = {
    OPENAI_MUSIC_SNOB_ID: process.env.OPENAI_MUSIC_SNOB_ID,
    OPENAI_TASTE_VALIDATOR_ID: process.env.OPENAI_TASTE_VALIDATOR_ID,
    OPENAI_HISTORIAN_ID: process.env.OPENAI_HISTORIAN_ID, // Added new Historian ID
  }

  const missingAssistants = Object.entries(assistantVars)
    .filter(([_, value]) => !value)
    .map(([key, _]) => key)

  if (missingAssistants.length > 0) {
    console.warn(`Missing OpenAI assistant IDs: ${missingAssistants.join(", ")}`)
    return false
  }

  return true
}

// Check authentication environment variables
export async function checkAuth() {
  try {
    const authVars = ["NEXT_PUBLIC_SPOTIFY_CLIENT_ID", "NEXT_PUBLIC_REDIRECT_URI"]

    const missingAuthVars = authVars.filter((varName) => !process.env[varName])

    if (missingAuthVars.length > 0) {
      console.warn(`Missing authentication environment variables: ${missingAuthVars.join(", ")}`)
      return { isAuthenticated: false, error: "Missing authentication environment variables" }
    }

    // Check OpenAI API key validity
    if (!process.env.OPENAI_API_KEY) {
      console.warn("Missing OpenAI API key")
      return { isAuthenticated: false, error: "Missing OpenAI API key" }
    }

    // Check if the API key format is valid (starts with "sk-")
    if (!process.env.OPENAI_API_KEY.startsWith("sk-")) {
      console.warn("Invalid OpenAI API key format")
      return { isAuthenticated: false, error: "Invalid OpenAI API key format" }
    }

    return { isAuthenticated: true }
  } catch (error) {
    console.error("Error in checkAuth:", error)
    return { isAuthenticated: false, error: "Authentication check failed" }
  }
}

// Validate OpenAI API key
export async function validateOpenAIKey() {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return { isValid: false, error: "Missing OpenAI API key" }
    }

    // Make a simple request to the OpenAI API to check if the key is valid
    const response = await fetch("https://api.openai.com/v1/models", {
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
    })

    if (!response.ok) {
      const error = await response.json()
      return { isValid: false, error: error.error?.message || "Invalid API key" }
    }

    return { isValid: true }
  } catch (error: any) {
    return { isValid: false, error: error.message || "Failed to validate OpenAI API key" }
  }
}
