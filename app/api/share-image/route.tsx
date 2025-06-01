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
    const rawMarkdownText = searchParams.get("text") || "Your music taste is... interesting."
    const assistantType = searchParams.get("type") || "snob"
    const username = searchParams.get("username") || "Your Music"
    
    // Instagram Story dimensions (9:16 ratio)
    const INSTAGRAM_STORY_WIDTH = 1080
    const INSTAGRAM_STORY_MAX_HEIGHT = 1920
    
    // Base heights for fixed elements (header + footer)
    const HEADER_HEIGHT = 320 // Approximate height of the header section
    const FOOTER_HEIGHT = 150 // Approximate height of the footer section
    const PADDING_HEIGHT = 80  // Top and bottom padding (40px each)
    
    // Strip HTML content (especially the disclaimer) from the markdown text
    const stripHtmlFromMarkdown = (text: string): string => {
      return text
        // Remove HTML tags and their content
        .replace(/<[^>]*>/g, '')
        // Remove any remaining HTML entities
        .replace(/&[a-zA-Z0-9#]+;/g, '')
        // Clean up extra whitespace
        .replace(/\n\s*\n\s*\n/g, '\n\n')
        .trim()
    }
    
    const markdownText = stripHtmlFromMarkdown(rawMarkdownText)
    
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
    
    // Get the appropriate action text based on assistant type (without leading/trailing spaces)
    const getActionText = (type: string): string => {
      switch (type) {
        case "worshipper":
          return "validation of"
        case "historian":
          return "analysis of"
        case "therapist":
          return "analysis of"
        case "snob":
        default:
          return "analysis of"
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
    
    // Estimate content height based on the text length and formatting
    const estimateContentHeight = (text: string): number => {
      const baseHeight = 120 // Base content container padding (44px * 2 + some buffer)
      const charsPerLine = 55 // Approximate chars per line for the given width (adjusted down for better estimation)
      const lineHeight = 36 // Approximate height per line (22px font size * 1.6 line height)
      
      // Process each line to account for headers and formatting
      const lines = text.split('\n').filter(line => line.trim())
      let totalHeight = 0
      
      lines.forEach((line, index) => {
        const trimmedLine = line.trim()
        
        // Headers take more vertical space
        if (trimmedLine.startsWith('# ')) {
          totalHeight += 70 // h1 height + margins
        } else if (trimmedLine.startsWith('## ')) {
          totalHeight += 55 // h2 height + margins
        } else if (trimmedLine.startsWith('### ')) {
          totalHeight += 48 // h3 height + margins
        } else if (trimmedLine.startsWith('- ')) {
          // List items
          const textLength = trimmedLine.length - 2 // Subtract the "- " prefix
          const estimatedLines = Math.max(1, Math.ceil(textLength / charsPerLine))
          totalHeight += estimatedLines * lineHeight + 12 // 12px margin bottom
        } else {
          // Regular paragraphs
          const textLength = trimmedLine.length
          const estimatedLines = Math.max(1, Math.ceil(textLength / charsPerLine))
          totalHeight += estimatedLines * lineHeight + 20 // 20px margin bottom
        }
        
        // Add extra spacing for paragraph breaks (only between paragraphs)
        if (index > 0 && index < lines.length - 1) {
          totalHeight += 8; // Additional spacing between paragraphs
        }
      })
      
      return baseHeight + totalHeight
    }
    
    // Calculate estimated content height
    const estimatedContentHeight = estimateContentHeight(markdownText)
    
    // Add a buffer to prevent content being cut off
    const contentHeightWithBuffer = estimatedContentHeight + 40
    
    // Calculate total image height (header + content + footer)
    const totalHeight = Math.min(
      HEADER_HEIGHT + contentHeightWithBuffer + FOOTER_HEIGHT + PADDING_HEIGHT,
      INSTAGRAM_STORY_MAX_HEIGHT
    )
    
    // Ensure minimum height for very short content
    const finalHeight = Math.max(totalHeight, 1200)
    
    // Log dimensions for debugging
    console.log(`Generating image with dimensions: ${INSTAGRAM_STORY_WIDTH}x${finalHeight}px`)
    console.log(`Content text length: ${markdownText.length} characters, ${markdownText.split('\n').filter(line => line.trim()).length} lines`)
    console.log(`Estimated content height: ${estimatedContentHeight}px (with buffer: ${contentHeightWithBuffer}px)`)
    
    // Fix zIndex warnings by ensuring all zIndex values are numbers
    const fixStyles = (jsx: any): any => {
      if (jsx && jsx.props && jsx.props.style && jsx.props.style.zIndex) {
        // Ensure zIndex is a number
        jsx.props.style.zIndex = Number(jsx.props.style.zIndex);
      }
      
      // Process children recursively
      if (jsx && jsx.props && jsx.props.children) {
        if (Array.isArray(jsx.props.children)) {
          jsx.props.children.forEach((child: any) => fixStyles(child));
        } else {
          fixStyles(jsx.props.children);
        }
      }
      
      return jsx;
    }
    
    // Create the JSX content
    const content = (
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
        
        {/* Content wrapper for vertical centering */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          maxWidth: '880px',
          gap: '20px',
          position: 'relative',
          zIndex: 2
        }}>
          {/* Header */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginBottom: '0',
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
                textAlign: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexWrap: 'wrap',
                gap: '8px'
              }}>
                <span style={{ 
                  color: '#c026d3', 
                  fontWeight: 'bold',
                  textShadow: '0 0 20px rgba(192, 38, 211, 0.5)' 
                }}>
                  {personalityName + "'s"}
                </span>
                <span style={{
                  color: '#e2e8f0'
                }}>
                  {getActionText(assistantType)}
                </span>
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
            margin: '0',
            flex: '0 0 auto',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            zIndex: 2,
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
            overflow: 'hidden'
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
            zIndex: 2,
            marginTop: '0'
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
        </div>
      </div>
    );
    
    // Fix any zIndex issues before rendering
    fixStyles(content);
    
    return new ImageResponse(content, {
      width: INSTAGRAM_STORY_WIDTH,
      height: finalHeight,
    })
  } catch (error) {
    console.error('Error generating share image:', error)
    
    return new Response('Failed to generate image', {
      status: 500,
    })
  }
} 