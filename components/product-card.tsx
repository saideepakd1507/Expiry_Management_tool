"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, CheckCircle, Eye } from "lucide-react"
import { format } from "date-fns"
import type { Product } from "@/lib/products"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const expiryDate = new Date(product.expiryDate)
  const isExpired = expiryDate < new Date()
  const isExpiringSoon = !isExpired && expiryDate < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <CardContent className="p-4 flex-grow">
        <h3 className="font-semibold text-lg truncate">{product.name}</h3>
        <div className="flex items-center justify-between mt-1">
          <div className="text-sm text-muted-foreground">Barcode: {product.barcode}</div>
          <div className="font-medium">${product.price.toFixed(2)}</div>
        </div>
        <div className="mt-2 flex items-center gap-1">
          {isExpired ? (
            <Badge variant="destructive" className="flex items-center">
              <AlertTriangle className="mr-1 h-3 w-3" />
              Expired
            </Badge>
          ) : isExpiringSoon ? (
            <Badge variant="default" className="flex items-center">
              <AlertTriangle className="mr-1 h-3 w-3" />
              Expires Soon
            </Badge>
          ) : (
            <Badge variant="outline" className="flex items-center text-green-600">
              <CheckCircle className="mr-1 h-3 w-3" />
              Valid
            </Badge>
          )}
          <span className="text-xs text-muted-foreground ml-1">{format(expiryDate, "dd MMM yyyy")}</span>
        </div>
        {product.batchNumber && <div className="mt-1 text-xs text-muted-foreground">Batch: {product.batchNumber}</div>}
      </CardContent>
      <CardFooter className="p-4 pt-0 mt-auto">
        <Link href={`/products/${product.id}`} className="w-full">
          <Button variant="outline" className="w-full">
            <Eye className="mr-2 h-4 w-4" />
            View Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}

