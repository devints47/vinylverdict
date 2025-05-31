import { ImageResponse } from "next/og"
import type { NextRequest } from "next/server"

export const runtime = "edge"

/**
 * Share Image Generation API
 * 
 * Current approach (simplified and working):
 * 1. Receives raw markdown text via URL parameter
 * 2. Strips inline formatting (**bold**, *italic*, _italic_) to prevent spacing issues
 * 3. Preserves structure (headers, paragraphs, lists)
 * 4. Headers render with solid purple color (#c026d3)
 * 5. Body text renders as clean paragraphs with proper spacing
 * 6. Emojis are preserved and display correctly
 */

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Get parameters from URL
    const markdownText = searchParams.get("text") || "Your music taste is... interesting."
    const assistantType = searchParams.get("type") || "snob"
    const username = searchParams.get("username") || "Your Music"
    
    // Get the app URL for image assets
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    
    // Get personality name based on assistant type
    const getPersonalityName = (type: string): string => {
      switch (type) {
        case "worshipper":
          return "The Taste Validator"
        case "historian":
          return "The Music Historian"
        case "therapist":
          return "The Armchair Therapist"
        case "snob":
        default:
          return "The Music Snob"
      }
    }
    
    // Convert markdown to structured content, keeping headers and paragraphs but stripping inline formatting
    const parseMarkdownToElements = (markdown: string) => {
      const lines = markdown.split('\n').filter(line => line.trim())
      const elements: any[] = []
      
      lines.forEach((line, index) => {
        const trimmedLine = line.trim()
        if (!trimmedLine) return
        
        // Strip inline formatting from any line before processing
        const cleanText = (text: string) => {
          return text
            // Remove bold
            .replace(/\*\*(.*?)\*\*/g, '$1')
            // Remove italic (both asterisk and underscore)
            .replace(/\*(.*?)\*/g, '$1')
            .replace(/_(.*?)_/g, '$1')
        }
        
        // Handle headers
        if (trimmedLine.startsWith('### ')) {
          const content = cleanText(trimmedLine.replace(/^### /, ''))
          elements.push(
            <h3 key={`h3-${index}`} style={{
              fontSize: '26px',
              fontWeight: 'bold',
              marginBottom: '10px',
              marginTop: index > 0 ? '20px' : '0',
              lineHeight: 1.4,
              color: '#c026d3'
            }}>
              {content}
            </h3>
          )
        } else if (trimmedLine.startsWith('## ')) {
          const content = cleanText(trimmedLine.replace(/^## /, ''))
          elements.push(
            <h2 key={`h2-${index}`} style={{
              fontSize: '28px',
              fontWeight: 'bold',
              marginBottom: '12px',
              marginTop: index > 0 ? '24px' : '0',
              lineHeight: 1.4,
              color: '#c026d3'
            }}>
              {content}
            </h2>
          )
        } else if (trimmedLine.startsWith('# ')) {
          const content = cleanText(trimmedLine.replace(/^# /, ''))
          elements.push(
            <h1 key={`h1-${index}`} style={{
              fontSize: '32px',
              fontWeight: 'bold',
              marginBottom: '16px',
              marginTop: index > 0 ? '28px' : '0',
              lineHeight: 1.4,
              color: '#c026d3'
            }}>
              {content}
            </h1>
          )
        } else if (trimmedLine.startsWith('- ')) {
          const content = cleanText(trimmedLine.replace(/^- /, ''))
          elements.push(
            <p key={`li-${index}`} style={{
              color: '#e4e4e7',
              fontSize: '22px',
              lineHeight: 1.6,
              marginBottom: '8px',
              marginLeft: '20px'
            }}>
              • {content}
            </p>
          )
        } else {
          // Regular paragraph content - strip inline formatting
          const content = cleanText(trimmedLine)
          elements.push(
            <p key={`p-${index}`} style={{
              color: '#e4e4e7',
              fontSize: '22px',
              lineHeight: 1.6,
              marginBottom: '16px'
            }}>
              {content}
            </p>
          )
        }
      })
      
      return elements
    }
    
    const personalityName = getPersonalityName(assistantType)
    const contentElements = parseMarkdownToElements(markdownText)
    
    return new ImageResponse(
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#121212',
          backgroundImage: `url(${appUrl}/waveform-bg.png)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          padding: '40px',
          fontFamily: 'Inter, sans-serif',
          color: 'white',
          position: 'relative'
        }}
      >
        {/* Dark overlay for better text readability */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          display: 'flex'
        }} />
        
        {/* Header */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginBottom: '20px',
          width: '100%',
          maxWidth: '880px',
          position: 'relative',
          zIndex: 2
        }}>
          {/* Vinyl Logo */}
          <img 
            src={`${appUrl}/music-snob-vinyl.png`}
            alt="VinylVerdict Logo"
            width="200"
            height="200"
            style={{
              marginBottom: '15px',
              filter: 'drop-shadow(0 0 20px rgba(147, 51, 234, 0.6))'
            }}
          />
          
          {/* Subtitle */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%'
          }}>
            <h2 style={{
              fontSize: '32px',
              fontWeight: '600',
              color: '#e2e8f0',
              margin: 0,
              lineHeight: 1.4,
              textShadow: '0 2px 10px rgba(0, 0, 0, 0.8)',
              textAlign: 'center'
            }}>
              <span style={{ 
                color: '#c026d3', 
                fontWeight: 'bold',
                textShadow: '0 0 20px rgba(192, 38, 211, 0.5)' 
              }}>
                {personalityName}
              </span>
              <span style={{ 
                color: '#c026d3', 
                fontWeight: 'bold',
                textShadow: '0 0 20px rgba(192, 38, 211, 0.5)' 
              }}>
                's
              </span>
              {' analysis of '}
              <span style={{ 
                color: '#c026d3', 
                fontWeight: 'bold',
                textShadow: '0 0 20px rgba(192, 38, 211, 0.5)' 
              }}>
                {username}
              </span>
            </h2>
          </div>
        </div>
        
        {/* Content Area */}
        <div style={{
          backgroundColor: 'rgba(24, 24, 27, 0.85)',
          borderRadius: '16px',
          padding: '44px',
          border: '1px solid rgba(147, 51, 234, 0.4)',
          width: '100%',
          maxWidth: '880px',
          marginBottom: '20px',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          zIndex: 2,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)'
        }}>
          {contentElements}
        </div>
        
        {/* Footer */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          maxWidth: '880px',
          position: 'relative',
          zIndex: 2
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '16px'
          }}>
            <img 
              src={`${appUrl}/music-snob-vinyl.png`}
              alt="VinylVerdict Logo"
              width="80"
              height="80"
              style={{
                filter: 'drop-shadow(0 0 15px rgba(147, 51, 234, 0.6))'
              }}
            />
            <h1 style={{
              fontSize: '42px',
              fontWeight: 'bold',
              color: '#c026d3',
              margin: 0,
              lineHeight: 1,
              textShadow: '0 0 20px rgba(192, 38, 211, 0.5)'
            }}>
              VinylVerdict.FM
            </h1>
          </div>
          <p style={{
            fontSize: '18px',
            color: '#94a3b8',
            margin: 0,
            textAlign: 'center',
            fontWeight: 400,
            textShadow: '0 2px 10px rgba(0, 0, 0, 0.8)'
          }}>
            Get your own personalized verdict at VinylVerdict.FM
          </p>
        </div>
      </div>,
      {
        width: 1080,
        height: 1815, // Increased by 10% from 1650px
      }
    )
  } catch (error) {
    console.error('Error generating share image:', error)
    
    return new Response('Failed to generate image', {
      status: 500,
    })
  }
} 