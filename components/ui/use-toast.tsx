"use client"

import { useState, useEffect } from "react"

type ToastProps = {
  title: string
  description?: string
  variant?: "default" | "destructive"
  duration?: number
}

type ToastState = ToastProps & {
  id: string
  visible: boolean
}

// Create a simple toast component
export function toast({ title, description, variant = "default", duration = 3000 }: ToastProps) {
  // Create a custom event to trigger the toast
  const event = new CustomEvent("toast", {
    detail: {
      title,
      description,
      variant,
      duration,
      id: Math.random().toString(36).substring(2, 9),
    },
  })

  // Dispatch the event
  window.dispatchEvent(event)
}

// Toast component to display the toast
export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastState[]>([])

  useEffect(() => {
    // Listen for toast events
    const handleToast = (event: Event) => {
      const detail = (event as CustomEvent).detail
      const newToast = { ...detail, visible: true }

      setToasts((prev) => [...prev, newToast])

      // Hide the toast after the duration
      setTimeout(() => {
        setToasts((prev) => prev.map((toast) => (toast.id === newToast.id ? { ...toast, visible: false } : toast)))

        // Remove the toast after the animation
        setTimeout(() => {
          setToasts((prev) => prev.filter((toast) => toast.id !== newToast.id))
        }, 300)
      }, detail.duration)
    }

    window.addEventListener("toast", handleToast)
    return () => window.removeEventListener("toast", handleToast)
  }, [])

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`transform transition-all duration-300 ${
            toast.visible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
          } ${
            toast.variant === "destructive" ? "bg-red-600" : "bg-zinc-800"
          } text-white p-4 rounded-lg shadow-lg max-w-md`}
        >
          <div className="font-bold">{toast.title}</div>
          {toast.description && <div className="text-sm mt-1">{toast.description}</div>}
        </div>
      ))}
    </div>
  )
}
