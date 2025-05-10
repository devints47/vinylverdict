import { Loader2 } from "lucide-react"
import { Navbar } from "@/components/navbar"

export default function Loading() {
  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="h-12 w-12 text-bright-purple animate-spin mb-4" />
          <h1 className="text-xl font-bold text-white mb-2">Loading dashboard</h1>
          <p className="text-zinc-400">Please wait while we prepare your experience...</p>
        </div>
      </div>
    </div>
  )
}
