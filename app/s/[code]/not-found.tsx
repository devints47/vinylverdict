import Link from "next/link"
import { Check } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Verdict Not Found</h1>
        <p className="text-zinc-400 mb-8">This shared verdict doesn't exist or has been removed.</p>
        <Link
          href="/"
          className="btn-gradient holographic-shimmer text-white font-bold py-3 px-6 rounded-full text-base transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 shadow-lg inline-flex"
        >
          Get Your Own Verdict
        </Link>
      </div>
    </div>
  )
}
