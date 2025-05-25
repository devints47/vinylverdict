import { NextRequest, NextResponse } from 'next/server'
import { storeShareData } from '@/lib/share-storage'

export async function POST(request: NextRequest) {
  try {
    const { text, type, imageUrl } = await request.json()
    
    if (!text || !type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    const shareData = {
      text,
      type,
      imageUrl,
      createdAt: Date.now(),
    }
    
    const id = await storeShareData(shareData)
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://vinylverdict.fm'
    const url = `${baseUrl}/s/${id}`
    
    return NextResponse.json({ url, id })
  } catch (error) {
    console.error('Error creating share:', error)
    return NextResponse.json(
      { error: 'Failed to create share' },
      { status: 500 }
    )
  }
}
