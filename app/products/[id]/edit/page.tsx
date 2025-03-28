"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { getProductById, updateProduct } from "@/lib/products"
import { useToast } from "@/hooks/use-toast"

interface EditProductPageProps {
  params: {
    id: string
  }
}

export default function EditProductPage({ params }: EditProductPageProps) {
  const router = useRouter()
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    barcode: "",
    name: "",
    price: "",
    batchNumber: "",
    aisle: "",
  })

  const [expiryDate, setExpiryDate] = useState<Date | undefined>(undefined)
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const product = await getProductById(params.id)

        if (product) {
          setFormData({
            barcode: product.barcode,
            name: product.name,
            price: product.price.toString(),
            batchNumber: product.batchNumber || "",
            aisle: product.aisle || "",
          })

          setExpiryDate(new Date(product.expiryDate))
        } else {
          toast({
            variant: "destructive",
            title: "Product not found",
            description: "The product you're trying to edit doesn't exist",
          })
          router.push("/products")
        }
      } catch (error) {
        console.error("Error fetching product:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load product details. Please try again.",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchProduct()
  }, [params.id, router, toast])

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
      await updateProduct(params.id, {
        ...formData,
        price: Number.parseFloat(formData.price) || 0,
        expiryDate: expiryDate.toISOString(),
      })

      toast({
        title: "Product updated",
        description: "The product has been successfully updated",
      })

      router.push(`/products/${params.id}`)
    } catch (error) {
      console.error("Error updating product:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update product. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>Edit Product</CardTitle>
            <CardDescription>Loading product details...</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center py-8">
            <div className="animate-pulse">Loading...</div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 max-w-md">
      <Card>
        <CardHeader>
          <CardTitle>Edit Product</CardTitle>
          <CardDescription>Update product details</CardDescription>
        </CardHeader>
        <CardContent>
          <form id="edit-product-form" onSubmit={handleSubmit} className="space-y-4">
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
          <Button type="submit" form="edit-product-form" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Update Product"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

