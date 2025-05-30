"use client"

import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"
import { usePathname } from "next/navigation"

interface BreadcrumbItem {
  label: string
  href: string
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[]
  className?: string
}

export function Breadcrumbs({ items, className = "" }: BreadcrumbsProps) {
  const pathname = usePathname()

  // Generate breadcrumbs from pathname if items not provided
  const breadcrumbItems = items || generateBreadcrumbs(pathname)

  if (breadcrumbItems.length <= 1) {
    return null // Don't show breadcrumbs for home page only
  }

  return (
    <nav 
      aria-label="Breadcrumb" 
      className={`flex items-center space-x-1 text-sm text-zinc-400 ${className}`}
    >
      <ol className="flex items-center space-x-1">
        {breadcrumbItems.map((item, index) => (
          <li key={item.href} className="flex items-center">
            {index > 0 && (
              <ChevronRight className="h-4 w-4 mx-1 text-zinc-600" aria-hidden="true" />
            )}
            {index === breadcrumbItems.length - 1 ? (
              // Current page - not a link
              <span 
                className="text-zinc-300 font-medium" 
                aria-current="page"
              >
                {item.label}
              </span>
            ) : (
              // Link to parent pages
              <Link
                href={item.href}
                className="hover:text-white transition-colors flex items-center"
              >
                {index === 0 && <Home className="h-4 w-4 mr-1" />}
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

function generateBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const breadcrumbs: BreadcrumbItem[] = [
    { label: "Home", href: "/" }
  ]

  // Remove leading slash and split path
  const pathSegments = pathname.slice(1).split('/').filter(Boolean)

  // Map path segments to readable labels
  const segmentLabels: Record<string, string> = {
    'privacy-policy': 'Privacy Policy',
    'terms-of-service': 'Terms of Service',
    'cookie-policy': 'Cookie Policy',
    'login': 'Login',
    'dashboard': 'Dashboard',
    'about': 'About',
  }

  // Build breadcrumb trail
  let currentPath = ''
  pathSegments.forEach((segment) => {
    currentPath += `/${segment}`
    const label = segmentLabels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1)
    breadcrumbs.push({
      label,
      href: currentPath
    })
  })

  return breadcrumbs
}

// Structured data for breadcrumbs (JSON-LD)
export function BreadcrumbStructuredData({ items }: { items: BreadcrumbItem[] }) {
  if (items.length <= 1) return null

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.label,
      "item": `https://vinylverdict.fm${item.href}`
    }))
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
} 