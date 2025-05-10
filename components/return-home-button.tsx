"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"

interface ReturnHomeButtonProps {
  className?: string
}

export function ReturnHomeButton({ className = "" }: ReturnHomeButtonProps) {
  const router = useRouter()
  const { isAuthenticated } = useAuth()

  const handleReturn = () => {
    // Redirect to dashboard if authenticated, otherwise to home page
    if (isAuthenticated) {
      router.push("/dashboard")
    } else {
      router.push("/")
    }
  }

  return (
    <Button onClick={handleReturn} variant="ghost" className={`flex items-center gap-2 hover:bg-zinc-800 ${className}`}>
      <ArrowLeft className="h-4 w-4" />
      <span>{isAuthenticated ? "Return to Dashboard" : "Return to Home"}</span>
    </Button>
  )
}
