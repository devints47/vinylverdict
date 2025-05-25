export default function NotFound() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Verdict Not Found</h1>
          <p className="text-zinc-400">This shared verdict may have expired or doesn't exist.</p>
        </div>

        <div className="relative bg-zinc-900 rounded-lg border border-zinc-800 p-12 mb-8">
          <div className="text-6xl mb-4">🎵</div>
          <p className="text-zinc-500">The music has stopped playing...</p>
        </div>

        <div className="space-y-4">
          <p className="text-zinc-400">Don't worry! You can create your own personalized music taste analysis.</p>
          <a
            href="/"
            className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
            Get Your Verdict at VinylVerdict.fm
          </a>
        </div>
      </div>
    </div>
  )
}
