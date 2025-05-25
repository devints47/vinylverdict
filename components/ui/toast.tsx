"use client"

import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

// Explicitly export the context
export const ToastContext = React.createContext<{
  toasts: Array<{
    id: string
    title?: string
    description?: string
    action?: React.ReactNode
    variant?: "default" | "destructive"
  }>
  addToast: (toast: {
    title?: string
    description?: string
    action?: React.ReactNode
    variant?: "default" | "destructive"
  }) => void
  removeToast: (id: string) => void
}>({
  toasts: [],
  addToast: () => {},
  removeToast: () => {},
})

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<
    Array<{
      id: string
      title?: string
      description?: string
      action?: React.ReactNode
      variant?: "default" | "destructive"
    }>
  >([])

  const addToast = React.useCallback(
    (toast: {
      title?: string
      description?: string
      action?: React.ReactNode
      variant?: "default" | "destructive"
    }) => {
      const id = Math.random().toString(36).slice(2, 9)
      setToasts((prev) => [...prev, { id, ...toast }])

      // Auto-remove toast after 5 seconds
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
      }, 5000)
    },
    [],
  )

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  // Add event listener for toast events
  React.useEffect(() => {
    const handleToastEvent = (event: Event) => {
      const detail = (event as CustomEvent).detail
      addToast(detail)
    }

    window.addEventListener("toast-event", handleToastEvent)
    return () => window.removeEventListener("toast-event", handleToastEvent)
  }, [addToast])

  return <ToastContext.Provider value={{ toasts, addToast, removeToast }}>{children}</ToastContext.Provider>
}

export function Toaster() {
  const { toasts, removeToast } = React.useContext(ToastContext)

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-md">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            "flex items-center justify-between rounded-lg p-4 shadow-lg transition-all",
            toast.variant === "destructive" ? "bg-red-600 text-white" : "bg-zinc-800 text-white",
          )}
        >
          <div>
            {toast.title && <div className="font-semibold">{toast.title}</div>}
            {toast.description && <div className="text-sm mt-1">{toast.description}</div>}
          </div>
          <button onClick={() => removeToast(toast.id)} className="ml-4 text-white/70 hover:text-white">
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  )
}

// Alias for compatibility
export const ToastContainer = Toaster

// Export useToast hook for accessing context
export function useToast() {
  const context = React.useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }

  return {
    toast: context.addToast,
    toasts: context.toasts,
    dismiss: context.removeToast,
  }
}
