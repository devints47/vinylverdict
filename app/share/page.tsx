"use client"

import React from "react"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import ReactMarkdown from "react-markdown"
import rehypeRaw from "rehype-raw"
import Link from "next/link"
import { VinylRecord } from "@/components/vinyl-record"
import { Loader2 } from "lucide-react"

export default function SharePage() {
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(true)

  // Get the text and type from the URL parameters
  const text = searchParams.get("text") || "No verdict found."
  const type = searchParams.get("type") || "snob"

  // Get title based on assistant type
  let title = "The Music Snob's Hot Take"
  if (type === "worshipper") {
    title = "The Taste Validator's Adoration"
  } else if (type === "historian") {
    title = "The Historian's Analysis"
  }

  // Get emoji based on assistant type
  let emoji = "🔥"
  if (type === "worshipper") {
    emoji = "✨"
  } else if (type === "historian") {
    emoji = "📚"
  }

  // Custom components for ReactMarkdown to preserve emoji colors
  const components = {
    h1: ({ node, ...props }) => {
      // Process children to wrap text (but not emojis) in styled spans
      const children = React.Children.toArray(props.children).map((child) => {
        if (typeof child === "string") {
          // Use regex to find emojis
          return child.split(/(\p{Emoji}+)/gu).map((part, i) => {
            // Check if this part is an emoji
            if (/\p{Emoji}/u.test(part)) {
              return (
                <span key={i} className="emoji">
                  {part}
                </span>
              )
            }
            // Regular text gets the gradient
            return (
              <span key={i} className="text-purple-gradient">
                {part}
              </span>
            )
          })
        }
        return child
      })

      return <h1 {...props}>{children}</h1>
    },
    h2: ({ node, ...props }) => {
      // Similar processing for h2
      return <h2 {...props}>{props.children}</h2>
    },
    h3: ({ node, ...props }) => {
      // Similar processing for h3
      return <h3 {...props}>{props.children}</h3>
    },
  }

  // Simulate loading for a better UX
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  // Get footer text based on the assistant type
  const getFooterText = () => {
    switch (type) {
      case "worshipper":
        return "This validation is a celebration of personal listening habits. It's all in good fun and meant to highlight the positive aspects of music taste."
      case "historian":
        return "This analysis examines music in its historical and cultural context. It's meant to be educational and thought-provoking, not judgmental."
      case "snob":
      default:
        return "This roast is a satirical critique of personal listening habits. It's all in good fun and not intended to insult any artists or fans."
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8 flex flex-col items-center justify-center">
        <div className="max-w-3xl w-full">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 text-purple-gradient">
            <span className="mr-2">{emoji}</span>
            Shared Music Verdict
            <span className="ml-2">{emoji}</span>
          </h1>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <VinylRecord size={120} isPlaying={true} />
              <p className="mt-4 text-zinc-400 flex items-center">
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Loading verdict...
              </p>
            </div>
          ) : (
            <Card className="card-holographic bg-gradient-to-r from-zinc-900 to-black">
              <CardContent className="pt-6 pb-2">
                <div className="markdown-content text-sm sm:text-base md:text-lg">
                  <ReactMarkdown
                    className="prose prose-invert max-w-none text-zinc-300 prose-strong:text-white prose-em:text-zinc-400 prose-li:marker:text-purple-gradient"
                    rehypePlugins={[rehypeRaw]}
                    components={components}
                  >
                    {decodeURIComponent(text)}
                  </ReactMarkdown>
                </div>
              </CardContent>

              <CardFooter className="flex flex-col gap-4">
                <p className="text-sm text-zinc-500 italic">{getFooterText()}</p>

                <div className="flex justify-center w-full mt-2">
                  <Link href="/" passHref>
                    <Button className="btn-gradient holographic-shimmer text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2 shadow-lg transition-all hover:shadow-xl">
                      Get Your Own Verdict
                    </Button>
                  </Link>
                </div>
              </CardFooter>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
