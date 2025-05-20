import { Loader2 } from "lucide-react"

interface ContentLoadingProps {
  message?: string
}

export function ContentLoading({ message = "Loading your music..." }: ContentLoadingProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <Loader2 className="h-12 w-12 text-bright-purple animate-spin mb-4" />
      <p className="text-zinc-400 text-lg">{message}</p>
      <p className="text-zinc-500 text-sm mt-2">This may take a moment as we analyze your Spotify data</p>
    </div>
  )
}
