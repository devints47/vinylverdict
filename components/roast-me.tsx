"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CursorTypewriter } from "./cursor-typewriter"

export function RoastMe() {
  const [prompt, setPrompt] = useState("")
  const [response, setResponse] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isTyping, setIsTyping] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!prompt.trim() || isLoading) return

    setIsLoading(true)
    setResponse("")

    try {
      const res = await fetch("/api/roast", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      })

      if (!res.ok) {
        throw new Error("Failed to fetch response")
      }

      const data = await res.json()
      setResponse(data.response)
      setIsTyping(true)
    } catch (error) {
      console.error("Error:", error)
      setResponse("Sorry, something went wrong. Please try again.")
      setIsTyping(true)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-3xl mx-auto bg-zinc-900/60 border-zinc-800">
      <CardHeader>
        <CardTitle className="text-purple-gradient">Roast My Music Taste</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="prompt">What would you like our AI music critic to roast?</Label>
            <Input
              id="prompt"
              placeholder="e.g., My top artists are Taylor Swift, The Weeknd, and Drake"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="bg-zinc-800 border-zinc-700"
              disabled={isLoading || isTyping}
            />
          </div>
          <Button
            type="submit"
            disabled={isLoading || isTyping || !prompt.trim()}
            className="bg-purple-gradient hover:bg-purple-600 text-white"
          >
            {isLoading ? "Generating roast..." : "Roast Me"}
          </Button>
        </form>

        {response && (
          <div className="mt-6 p-4 bg-zinc-800/50 rounded-lg">
            <CursorTypewriter markdown={response} speed={30} onComplete={() => setIsTyping(false)} />
          </div>
        )}
      </CardContent>
      <CardFooter className="text-sm text-zinc-500 pt-2">
        This roast is a satirical critique of your personal listening habits. It's all in good fun and not intended to
        insult any artists or fans.
      </CardFooter>
    </Card>
  )
}
