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
export function checkAuth() {
  const authVars = ["NEXT_PUBLIC_SPOTIFY_CLIENT_ID", "NEXT_PUBLIC_REDIRECT_URI"]

  const missingAuthVars = authVars.filter((varName) => !process.env[varName])

  if (missingAuthVars.length > 0) {
    console.warn(`Missing authentication environment variables: ${missingAuthVars.join(", ")}`)
    return false
  }

  return true
}
