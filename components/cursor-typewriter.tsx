"use client"

import type React from "react"
import { useState, useEffect } from "react"

interface CursorTypewriterProps {
  text: string
  typingSpeed?: number
  cursorChar?: string
}

const CursorTypewriter: React.FC<CursorTypewriterProps> = ({ text, typingSpeed = 50, cursorChar = "|" }) => {
  const [output, setOutput] = useState("")
  const [isComplete, setIsComplete] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    let timeoutId: NodeJS.Timeout

    if (currentIndex < text.length && !isComplete) {
      timeoutId = setTimeout(() => {
        setOutput((prevOutput) => prevOutput + text[currentIndex])
        setCurrentIndex((prevIndex) => prevIndex + 1)
      }, typingSpeed)
    } else if (currentIndex === text.length && !isComplete) {
      setIsComplete(true)
    }

    return () => clearTimeout(timeoutId)
  }, [currentIndex, text, typingSpeed, isComplete])

  useEffect(() => {
    if (isComplete) {
      return
    }

    let timeoutId: NodeJS.Timeout

    if (currentIndex < text.length) {
      timeoutId = setTimeout(() => {
        setOutput((prevOutput) => prevOutput + text[currentIndex])
        setCurrentIndex((prevIndex) => prevIndex + 1)
      }, typingSpeed)
    } else if (currentIndex === text.length) {
      setIsComplete(true)
    }

    return () => clearTimeout(timeoutId)
  }, [currentIndex, text, typingSpeed, isComplete])

  const renderedOutput = output

  return (
    <div className="text-sm sm:text-base md:text-lg">
      {renderedOutput}
      {!isComplete && <span className="cursor">{cursorChar}</span>}
    </div>
  )
}

export default CursorTypewriter
