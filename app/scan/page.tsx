"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Barcode, Camera, X, Calendar } from "lucide-react"
import { checkProductExists, addProduct } from "@/lib/products"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

export default function ScanPage() {
  const [barcode, setBarcode] = useState("")
  const [scanning, setScanning] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showDialog, setShowDialog] = useState(false)
  const [scannedBarcode, setScannedBarcode] = useState("")
  const [isAddingProduct, setIsAddingProduct] = useState(false)
  const [formData, setFormData] = useState({
    barcode: "",
    name: "",
    price: "",
    batchNumber: "",
    aisle: "",
  })
  const [expiryDate, setExpiryDate] = useState<Date | undefined>(
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Default to 30 days from now
  )
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [cameraError, setCameraError] = useState<string | null>(null)

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const router = useRouter()
  const { toast } = useToast()

  // For real barcode scanning, we would use a library like quagga.js
  // This is a simplified simulation for demo purposes
  const simulateBarcodeScanning = () => {
    if (!videoRef.current || !canvasRef.current) return

    const canvas = canvasRef.current
    const video = videoRef.current
    const context = canvas.getContext("2d")

    if (!context) return

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    // Draw the current video frame to the canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height)

    // In a real app, we would now process this image to detect barcodes
    // For this demo, we'll simulate finding a barcode after a delay
    setTimeout(() => {
      const simulatedBarcode = Math.floor(Math.random() * 9000000000000) + 1000000000000
      const barcodeString = simulatedBarcode.toString()
      setBarcode(barcodeString)
      setScannedBarcode(barcodeString)
      setScanning(false)

      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
        tracks.forEach((track) => track.stop())
      }

      toast({
        title: "Barcode detected",
        description: `Barcode: ${barcodeString}`,
      })

      // Check if product exists
      handleCheckProduct(barcodeString)
    }, 3000)
  }

  const startScanning = async () => {
    setCameraError(null)

    try {
      const constraints = {
        video: {
          facingMode: "environment",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      }

      const stream = await navigator.mediaDevices.getUserMedia(constraints)

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play()
          setScanning(true)
          simulateBarcodeScanning()
        }
      }
    } catch (error) {
      console.error("Error accessing camera:", error)
      setCameraError("Could not access your camera. Please check permissions and ensure your device has a camera.")
      toast({
        variant: "destructive",
        title: "Camera access error",
        description: "Could not access your camera. Please check permissions.",
      })
    }
  }

  const stopScanning = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
      tracks.forEach((track) => track.stop())
      setScanning(false)
    }
  }

  const handleCheckProduct = async (barcodeToCheck: string) => {
    setLoading(true)

    try {
      // Check if product exists
      const existingProduct = await checkProductExists(barcodeToCheck)

      if (existingProduct) {
        // If product exists, navigate to product details
        router.push(`/products/${existingProduct.id}`)
      } else {
        // If product doesn't exist, show dialog to add
        setFormData((prev) => ({ ...prev, barcode: barcodeToCheck }))
        setShowDialog(true)
      }
    } catch (error) {
      console.error("Error checking product:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to check if product exists. Please try again.",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!barcode) {
      toast({
        variant: "destructive",
        title: "Barcode required",
        description: "Please enter or scan a barcode",
      })
      return
    }

    handleCheckProduct(barcode)
  }

  const handleAddProduct = () => {
    setShowDialog(false)
    setIsAddingProduct(true)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleDateSelect = (date: Date | undefined) => {
    setExpiryDate(date)
    setCalendarOpen(false) // Close the calendar after selection
  }

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.barcode || !formData.name || !expiryDate) {
      toast({
        variant: "destructive",
        title: "Missing fields",
        description: "Please fill in all required fields: barcode, name, and expiry date",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const newProduct = await addProduct({
        ...formData,
        price: Number.parseFloat(formData.price) || 0,
        expiryDate: expiryDate.toISOString(),
      })

      toast({
        title: "Product added",
        description: "The product has been successfully added",
      })

      // Navigate to the product list page
      router.push("/products")
    } catch (error) {
      console.error("Error adding product:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add product. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
        tracks.forEach((track) => track.stop())
      }
    }
  }, [])

  if (isAddingProduct) {
    return (
      <div className="container mx-auto p-4 max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>Add New Product</CardTitle>
            <CardDescription>Enter product details</CardDescription>
          </CardHeader>
          <CardContent>
            <form id="add-product-form" onSubmit={handleSaveProduct} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="barcode">Barcode *</Label>
                <Input
                  id="barcode"
                  name="barcode"
                  value={formData.barcode}
                  onChange={handleChange}
                  placeholder="Enter barcode"
                  required
                  readOnly
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter product name"
                  required
                  autoFocus
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  value={formData.price || ""}
                  onChange={handleChange}
                  placeholder="Enter price"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="expiryDate">Expiry Date *</Label>
                <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !expiryDate && "text-muted-foreground",
                      )}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {expiryDate ? format(expiryDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent mode="single" selected={expiryDate} onSelect={handleDateSelect} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="batchNumber">Batch Number</Label>
                <Input
                  id="batchNumber"
                  name="batchNumber"
                  value={formData.batchNumber}
                  onChange={handleChange}
                  placeholder="Enter batch number"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="aisle">Aisle</Label>
                <Input
                  id="aisle"
                  name="aisle"
                  value={formData.aisle}
                  onChange={handleChange}
                  placeholder="Enter aisle location"
                />
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setIsAddingProduct(false)}>
              Cancel
            </Button>
            <Button type="submit" form="add-product-form" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Product"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 max-w-md">
      <Card>
        <CardHeader>
          <CardTitle>Scan Barcode</CardTitle>
          <CardDescription>Scan a product barcode or enter it manually</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {scanning ? (
            <div className="relative">
              <video ref={videoRef} autoPlay playsInline className="w-full h-64 bg-black rounded-md object-cover" />
              <canvas ref={canvasRef} className="hidden" />
              <Button
                variant="outline"
                size="icon"
                className="absolute top-2 right-2 bg-background/80"
                onClick={stopScanning}
              >
                <X className="h-4 w-4" />
              </Button>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-64 h-1 bg-red-500 opacity-50" />
              </div>
            </div>
          ) : (
            <>
              <Button
                variant="outline"
                className="w-full h-64 flex flex-col gap-2 justify-center items-center"
                onClick={startScanning}
              >
                <Camera className="h-8 w-8" />
                <span>Click to start scanning</span>
              </Button>
              {cameraError && (
                <div className="text-destructive text-sm p-2 bg-destructive/10 rounded-md">{cameraError}</div>
              )}
            </>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="barcode">Barcode</Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Barcode className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="barcode"
                    placeholder="Enter barcode number"
                    className="pl-8"
                    value={barcode}
                    onChange={(e) => setBarcode(e.target.value)}
                  />
                </div>
                <Button type="submit" disabled={loading}>
                  {loading ? "Checking..." : "Check"}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!barcode || loading}>
            {loading ? "Checking..." : "Continue"}
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Product</DialogTitle>
            <DialogDescription>
              This barcode ({scannedBarcode}) is not in your database. Would you like to add it?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddProduct}>Add New Product</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

