import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getShareData } from '@/lib/share-storage'

interface PageProps {
  params: { id: string }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const shareData = await getShareData(params.id)
  
  if (!shareData) {
    return {
      title: 'Share Not Found',
      description: 'This share link has expired or does not exist.',
    }
  }
  
  const getPersonalityName = (type: string): string => {
    switch (type) {
      case "worshipper":
        return "The Taste Validator"
      case "historian":
        return "The Music Historian"
      case "snob":
      default:
        return "The Music Snob"
    }
  }
  
  const personalityName = getPersonalityName(shareData.type)
  const title = `Music Taste Verdict from VinylVerdict`
  const description = shareData.text.substring(0, 160).replace(/[#*]/g, '') + '...'
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://vinylverdict.fm'
  const shareUrl = `${baseUrl}/s/${params.id}`
  
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: shareUrl,
      siteName: 'VinylVerdict.fm',
      images: shareData.imageUrl ? [
        {
          url: shareData.imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        }
      ] : [],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: shareData.imageUrl ? [shareData.imageUrl] : [],
    },
    other: {
      'og:image:width': '1200',
      'og:image:height': '630',
      'og:image:type': 'image/png',
    },
  }
}

export default async function SharePage({ params }: PageProps) {
  const shareData = await getShareData(params.id)
  
  if (!shareData) {
    notFound()
  }
  
  const getPersonalityName = (type: string): string => {
    switch (type) {
      case "worshipper":
        return "The Taste Validator"
      case "historian":
        return "The Music Historian"
      case "snob":
      default:
        return "The Music Snob"
    }
  }
  
  const personalityName = getPersonalityName(shareData.type)
  
  return (
    <div className="min-h-screen bg-zinc-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-purple-400 mb-4">
              {personalityName}'s Verdict
            </h1>
            <p className="text-zinc-400">
              Get your own music taste verdict at{' '}
              <a href="/" className="text-purple-400 hover:underline">
                VinylVerdict.fm
              </a>
            </p>
          </div>
          
          {shareData.imageUrl && (
            <div className="mb-8 text-center">
              <img
                src={shareData.imageUrl || "/placeholder.svg"}
                alt="Music Taste Verdict"
                className="max-w-full h-auto rounded-lg border border-zinc-700 mx-auto"
                style={{ maxWidth: '600px' }}
              />
            </div>
          )}
          
          <div className="bg-zinc-800 rounded-lg p-6 border border-zinc-700">
            <div className="prose prose-invert max-w-none">
              <div 
                dangerouslySetInnerHTML={{ 
                  __html: shareData.text
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/\*(.*?)\*/g, '<em>$1</em>')
                    .replace(/\n\n/g, '</p><p>')
                    .replace(/^(.+)$/gm, '<p>$1</p>')
                    .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold text-purple-400 mb-4">$1</h1>')
                    .replace(/^## (.*$)/gm, '<h2 class="text-xl font-bold text-purple-400 mb-3">$1</h2>')
                    .replace(/^### (.*$)/gm, '<h3 class="text-lg font-bold text-purple-400 mb-2">$1</h3>')
                }}
              />
            </div>
          </div>
          
          <div className="text-center mt-8">
            <a
              href="/"
              className="inline-flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors"
            >
              Get Your Own Verdict
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
