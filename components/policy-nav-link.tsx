"use client"

import type React from "react"

import { usePathname } from "next/navigation"
import Link from "next/link"

interface PolicyNavLinkProps {
  href: string
  children: React.ReactNode
  className?: string
}

export function PolicyNavLink({ href, children, className = "" }: PolicyNavLinkProps) {
  const pathname = usePathname()

  // Check if we're on a policy page
  const isPolicyPage =
    pathname.includes("/privacy-policy") ||
    pathname.includes("/terms-of-service") ||
    pathname.includes("/cookie-policy")

  // If we're on a policy page and the href is a hash link,
  // redirect to home page with the hash
  const modifiedHref = isPolicyPage && href.startsWith("#") ? `/${href}` : href

  return (
    <Link href={modifiedHref} className={className}>
      {children}
    </Link>
  )
}
