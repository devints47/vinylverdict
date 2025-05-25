"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface CleanupResult {
  success: boolean
  totalChecked: number
  markedForDeletion: number
  successfullyDeleted: number
  errors: number
  timestamp: string
  error?: string
}

export default function CleanupPage() {
  const [isRunning, setIsRunning] = useState(false)
  const [result, setResult] = useState<CleanupResult | null>(null)

  const runCleanup = async () => {
    setIsRunning(true)
    setResult(null)

    try {
      const response = await fetch("/api/cleanup-images", {
        method: "POST",
      })

      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({
        success: false,
        totalChecked: 0,
        markedForDeletion: 0,
        successfullyDeleted: 0,
        errors: 1,
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : "Unknown error",
      })
    } finally {
      setIsRunning(false)
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Image Cleanup Tool</CardTitle>
          <CardDescription>
            Manually trigger cleanup of generated share images older than 14 days. This runs automatically daily at 2 AM
            UTC.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={runCleanup} disabled={isRunning} className="w-full">
            {isRunning ? "Running Cleanup..." : "Run Cleanup Now"}
          </Button>

          {result && (
            <Card className={result.success ? "border-green-200" : "border-red-200"}>
              <CardHeader>
                <CardTitle className={result.success ? "text-green-700" : "text-red-700"}>
                  {result.success ? "Cleanup Completed" : "Cleanup Failed"}
                </CardTitle>
                <CardDescription>{result.timestamp}</CardDescription>
              </CardHeader>
              <CardContent>
                {result.success ? (
                  <div className="space-y-2 text-sm">
                    <p>
                      <strong>Total images checked:</strong> {result.totalChecked}
                    </p>
                    <p>
                      <strong>Images marked for deletion:</strong> {result.markedForDeletion}
                    </p>
                    <p>
                      <strong>Successfully deleted:</strong> {result.successfullyDeleted}
                    </p>
                    {result.errors > 0 && (
                      <p className="text-red-600">
                        <strong>Errors:</strong> {result.errors}
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-red-600">{result.error}</p>
                )}
              </CardContent>
            </Card>
          )}

          <div className="text-sm text-gray-600 space-y-2">
            <p>
              <strong>How it works:</strong>
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>Scans for images with prefix "vinyl-verdict-gen-image-"</li>
              <li>Extracts timestamp from filename</li>
              <li>Deletes images older than 14 days</li>
              <li>Preserves all other files (logos, assets, etc.)</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
