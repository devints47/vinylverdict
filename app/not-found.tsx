import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">404</h1>
        <h2 className="text-2xl font-bold text-white mb-6">Page Not Found</h2>
        <p className="text-zinc-400 mb-8">The page you're looking for doesn't exist or has been moved.</p>
        <Link
          href="/"
          className="btn-gradient holographic-shimmer text-white font-bold py-3 px-8 rounded-full text-lg transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 shadow-lg inline-flex"
        >
          Go Home
        </Link>
      </div>
    </div>
  )
}
