import { put, head } from '@vercel/blob'

export interface ShareData {
  text: string
  type: string
  imageUrl?: string
  createdAt: number
}

// Generate a random 8-character ID
export function generateShareId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

// Store share data in Vercel Blob
export async function storeShareData(data: ShareData): Promise<string> {
  const id = generateShareId()
  
  try {
    const blob = await put(`shares/${id}.json`, JSON.stringify(data), {
      access: 'public',
      addRandomSuffix: false,
    })
    
    return id
  } catch (error) {
    console.error('Error storing share data:', error)
    throw new Error('Failed to store share data')
  }
}

// Retrieve share data from Vercel Blob
export async function getShareData(id: string): Promise<ShareData | null> {
  try {
    const response = await fetch(`https://blob.vercel-storage.com/shares/${id}.json`)
    
    if (!response.ok) {
      return null
    }
    
    const data = await response.json()
    
    // Check if data is expired (30 days)
    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000)
    if (data.createdAt < thirtyDaysAgo) {
      return null
    }
    
    return data
  } catch (error) {
    console.error('Error retrieving share data:', error)
    return null
  }
}
