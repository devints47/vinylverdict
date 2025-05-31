import { ImageResponse } from "next/og"
import type { NextRequest } from "next/server"

export const runtime = "edge"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Get parameters from URL
    const rawText = searchParams.get("text") || "Your music taste is... interesting."
    const assistantType = searchParams.get("type") || "snob"
    const username = searchParams.get("username") || "Your Music"
    
    // Clean the text of any HTML tags that might have been included
    const text = rawText.replace(/<[^>]*>/g, '').trim()
    
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
    
    // Convert markdown-like text to styled elements with proper gradient styling
    const convertTextToElements = (markdown: string) => {
      const lines = markdown.split('\n').filter(line => line.trim())
      
      return lines.map((line, index) => {
        // Handle headers with gradient styling
        if (line.startsWith('# ')) {
          const content = line.replace('# ', '')
          // Split content to separate emojis from text
          const parts = content.split(/(\p{Emoji}+)/gu)
          
          return (
            <h1 key={index} style={{
              fontSize: '32px',
              fontWeight: 'bold',
              marginBottom: '16px',
              lineHeight: 1.4,
              display: 'flex',
              flexWrap: 'wrap'
            }}>
              {parts.map((part, i) => {
                if (/\p{Emoji}/u.test(part)) {
                  return (
                    <span key={i} style={{ 
                      color: 'inherit'
                    }}>
                      {part}
                    </span>
                  )
                }
                return (
                  <span key={i} style={{
                    background: 'linear-gradient(135deg, #9333ea, #a855f7, #c026d3, #a855f7, #9333ea)',
                    backgroundSize: '200% 200%',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}>
                    {part}
                  </span>
                )
              })}
            </h1>
          )
        }
        
        if (line.startsWith('## ')) {
          const content = line.replace('## ', '')
          const parts = content.split(/(\p{Emoji}+)/gu)
          
          return (
            <h2 key={index} style={{
              fontSize: '28px',
              fontWeight: 'bold',
              marginBottom: '12px',
              lineHeight: 1.4,
              display: 'flex',
              flexWrap: 'wrap'
            }}>
              {parts.map((part, i) => {
                if (/\p{Emoji}/u.test(part)) {
                  return (
                    <span key={i} style={{ 
                      color: 'inherit'
                    }}>
                      {part}
                    </span>
                  )
                }
                return (
                  <span key={i} style={{
                    background: 'linear-gradient(135deg, #9333ea, #a855f7, #c026d3, #a855f7, #9333ea)',
                    backgroundSize: '200% 200%',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}>
                    {part}
                  </span>
                )
              })}
            </h2>
          )
        }
        
        if (line.startsWith('### ')) {
          const content = line.replace('### ', '')
          const parts = content.split(/(\p{Emoji}+)/gu)
          
          return (
            <h3 key={index} style={{
              fontSize: '26px',
              fontWeight: 'bold',
              marginBottom: '10px',
              lineHeight: 1.4,
              display: 'flex',
              flexWrap: 'wrap'
            }}>
              {parts.map((part, i) => {
                if (/\p{Emoji}/u.test(part)) {
                  return (
                    <span key={i} style={{ 
                      color: 'inherit'
                    }}>
                      {part}
                    </span>
                  )
                }
                return (
                  <span key={i} style={{
                    background: 'linear-gradient(135deg, #9333ea, #a855f7, #c026d3, #a855f7, #9333ea)',
                    backgroundSize: '200% 200%',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}>
                    {part}
                  </span>
                )
              })}
            </h3>
          )
        }
        
        // Handle list items
        if (line.startsWith('- ')) {
          return (
            <p key={index} style={{
              color: '#e4e4e7',
              fontSize: '22px',
              lineHeight: 1.6,
              marginBottom: '8px',
              marginLeft: '20px'
            }}>
              • {line.replace('- ', '')}
            </p>
          )
        }
        
        // Regular paragraphs
        return (
          <p key={index} style={{
            color: '#e4e4e7',
            fontSize: '22px',
            lineHeight: 1.6,
            marginBottom: '16px'
          }}>
            {line}
          </p>
        )
      })
    }
    
    const personalityName = getPersonalityName(assistantType)
    const contentElements = convertTextToElements(text)
    
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
          zIndex: Number(2)
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
          zIndex: Number(2),
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
          zIndex: Number(2)
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
        height: 1650, // Increased by 10% from 1500px
      }
    )
  } catch (error) {
    console.error('Error generating share image:', error)
    
    return new Response('Failed to generate image', {
      status: 500,
    })
  }
} 