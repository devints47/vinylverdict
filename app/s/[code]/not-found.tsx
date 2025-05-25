import Link from "next/link"
import { Check } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
      <div className="max-w-md w-full text-center">
        <h1 className="text-3xl font-bold mb-2">Verdict Not Found</h1>
        <p className="text-zinc-400 mb-8">This shared verdict may have expired or doesn't exist.</p>

        <div className="bg-zinc-900 rounded-lg p-8 mb-8">
          <div className="text-6xl mb-4">🎵</div>
          <p className="text-zinc-500">The music has stopped playing...</p>
        </div>

        <p className="mb-6">Don't worry! You can create your own personalized music taste analysis.</p>

        <Link
          href="/"
          className="inline-flex items-center justify-center bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
        >
          <Check className="mr-2 h-5 w-5" />
          Get Your Verdict at VinylVerdict.fm
        </Link>
      </div>
    </div>
  )
}
