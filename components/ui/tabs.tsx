"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "@/lib/utils"

const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex w-full items-center justify-center rounded-lg bg-zinc-900/50 p-1 text-zinc-400 backdrop-blur-sm",
      className,
    )}
    {...props}
  />
))
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "relative inline-flex items-center justify-center whitespace-nowrap rounded-md px-6 py-3 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
      // Inactive tab styling
      "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50",
      // Active tab styling with purple gradient and animations
      "data-[state=active]:text-white data-[state=active]:shadow-lg",
      // Add a pseudo-element for the background gradient when active
      "before:absolute before:inset-0 before:rounded-md before:opacity-0 before:transition-opacity data-[state=active]:before:opacity-100",
      // Add a pseudo-element for the shimmer effect when active
      "after:absolute after:inset-0 after:rounded-md after:opacity-0 after:transition-opacity data-[state=active]:after:opacity-100",
      className,
    )}
    style={
      {
        // Add the gradient background for active state
        "--tab-gradient":
          "linear-gradient(135deg, var(--purple-gradient-start), var(--purple-gradient-mid), var(--purple-gradient-end))",
      } as React.CSSProperties
    }
    {...props}
  />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className,
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }
