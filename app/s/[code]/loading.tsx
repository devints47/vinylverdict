export default function Loading() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Loading Verdict...</h1>
          <p className="text-zinc-400">Retrieving your music taste analysis</p>
        </div>

        <div className="relative bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800 aspect-[9/16] flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
        </div>

        <div className="text-center mt-8">
          <p className="text-zinc-400">Want your own personalized music taste analysis?</p>
          <a
            href="/"
            className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors mt-4"
          >
            Get Your Verdict at VinylVerdict.fm
          </a>
        </div>
      </div>
    </div>
  )
}
