"use client"

import type React from "react"

import { Music, User } from "lucide-react"
import { cn } from "@/lib/utils"

interface MusicTabsProps {
  activeTab: string
  onTabChange: (tab: string) => void
  className?: string
}

export function MusicTabs({ activeTab, onTabChange, className }: MusicTabsProps) {
  return (
    <div className={cn("w-full", className)}>
      <div
        className="w-full flex rounded-t-lg overflow-hidden shadow-lg bg-zinc-900/50"
        style={{
          borderWidth: "1px 1px 0px 1px",
          borderImageSource:
            "linear-gradient(135deg, var(--purple-gradient-start), var(--purple-gradient-mid), var(--purple-gradient-end))",
          borderImageSlice: "1",
        }}
      >
        <TabButton
          isActive={activeTab === "recently-played"}
          onClick={() => onTabChange("recently-played")}
          icon={<Music className="h-5 w-5" />}
          label="Recently Played"
        />
        <TabButton
          isActive={activeTab === "top-tracks"}
          onClick={() => onTabChange("top-tracks")}
          icon={<Music className="h-5 w-5" />}
          label="Top Tracks"
        />
        <TabButton
          isActive={activeTab === "top-artists"}
          onClick={() => onTabChange("top-artists")}
          icon={<User className="h-5 w-5" />}
          label="Top Artists"
        />
      </div>
    </div>
  )
}

interface TabButtonProps {
  isActive: boolean
  onClick: () => void
  icon: React.ReactNode
  label: string
}

function TabButton({ isActive, onClick, icon, label }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex-1 py-3 px-4 flex items-center justify-center gap-2 transition-all duration-300 relative overflow-hidden",
        "bg-zinc-900/80 border-l border-r",
        isActive ? "text-white font-medium" : "text-zinc-400 hover:text-white hover:bg-zinc-800",
      )}
      style={{
        borderLeftColor: "rgba(147, 51, 234, 0.3)",
        borderRightColor: "rgba(147, 51, 234, 0.3)",
      }}
    >
      {/* Background gradient for active tab */}
      {isActive && <div className="absolute inset-0 bg-purple-gradient opacity-100"></div>}

      {/* Shimmer effect for active tab */}
      {isActive && <div className="absolute inset-0 holographic-shimmer"></div>}

      {/* Content - always on top */}
      <div className="relative z-10 flex items-center justify-center gap-2">
        <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">{icon}</div>
        <span className="text-sm md:text-base">{label}</span>
      </div>
    </button>
  )
}
