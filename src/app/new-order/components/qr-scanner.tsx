"use client"

import { useState, useEffect } from "react"
import { Camera, Ban } from "lucide-react"
import { Button } from "@/components/ui/button"

interface QrScannerProps {
  onScan: (result: string) => void
}

export function QrScanner({ onScan }: QrScannerProps) {
  const [hasCamera, setHasCamera] = useState(false)
  const [isScanning, setIsScanning] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Check if camera is available
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          setHasCamera(true)
          // Stop the stream immediately after checking
          stream.getTracks().forEach((track) => track.stop())
        })
        .catch(() => {
          setHasCamera(false)
          setError("Camera access denied or not available")
        })
    } else {
      setHasCamera(false)
      setError("Camera not supported in this browser")
    }
  }, [])

  const startScanning = () => {
    setIsScanning(true)
    setError(null)

    // In a real implementation, you would use a QR code scanning library
    // For this example, we'll simulate a successful scan after 3 seconds
    setTimeout(() => {
      // Simulate a successful scan
      const mockQrValue = "user-id-12345"
      onScan(mockQrValue)
      setIsScanning(false)
    }, 3000)
  }

  const stopScanning = () => {
    setIsScanning(false)
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <Ban className="mx-auto h-12 w-12 text-destructive mb-4" />
        <p className="mb-4">{error}</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center p-4 gap-4">
      {isScanning ? (
        <>
          <div className="relative w-full aspect-square bg-muted rounded-md overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              {/* This would be replaced with actual camera feed in a real implementation */}
              <div className="animate-pulse text-center">
                <Camera className="mx-auto h-12 w-12 mb-2" />
                <p>Scanning...</p>
              </div>
            </div>
            {/* Scanning overlay with corner markers */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 left-0 w-16 h-16 border-l-4 border-t-4 border-primary"></div>
              <div className="absolute top-0 right-0 w-16 h-16 border-r-4 border-t-4 border-primary"></div>
              <div className="absolute bottom-0 left-0 w-16 h-16 border-l-4 border-b-4 border-primary"></div>
              <div className="absolute bottom-0 right-0 w-16 h-16 border-r-4 border-b-4 border-primary"></div>
            </div>
          </div>
          <Button variant="destructive" onClick={stopScanning}>
            Stop Scanning
          </Button>
        </>
      ) : (
        <>
          <div className="w-full aspect-square bg-muted rounded-md flex items-center justify-center">
            <Camera className="h-12 w-12 text-muted-foreground" />
          </div>
          <Button onClick={startScanning} disabled={!hasCamera}>
            Start Scanning
          </Button>
          <p className="text-sm text-muted-foreground text-center">Position the QR code within the frame to scan</p>
        </>
      )}
    </div>
  )
}