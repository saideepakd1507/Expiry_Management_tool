"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { addProduct } from "@/lib/products"
import { useToast } from "@/hooks/use-toast"

export default function AddProductPage() {
  const searchParams = useSearchParams()
  const barcodeParam = searchParams.get("barcode")
  const router = useRouter()
  const { toast } = useToast()

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

  // Set barcode from URL parameter when component mounts
  useEffect(() => {
    if (barcodeParam) {
      setFormData((prev) => ({ ...prev, barcode: barcodeParam }))
    }
  }, [barcodeParam])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleDateSelect = (date: Date | undefined) => {
    setExpiryDate(date)
    setCalendarOpen(false) // Close the calendar after selection
  }

  const handleSubmit = async (e: React.FormEvent) => {
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

  return (
    <div className="container mx-auto p-4 max-w-md">
      <Card>
        <CardHeader>
          <CardTitle>Add New Product</CardTitle>
          <CardDescription>Enter product details</CardDescription>
        </CardHeader>
        <CardContent>
          <form id="add-product-form" onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="barcode">Barcode *</Label>
              <Input
                id="barcode"
                name="barcode"
                value={formData.barcode}
                onChange={handleChange}
                placeholder="Enter barcode"
                required
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
                    className={cn("w-full justify-start text-left font-normal", !expiryDate && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {expiryDate ? format(expiryDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={expiryDate} onSelect={handleDateSelect} initialFocus />
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
          <Button variant="outline" onClick={() => router.back()}>
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

