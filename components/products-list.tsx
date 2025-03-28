import { getAllProducts } from "@/lib/products"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { AlertTriangle, CheckCircle, Eye } from "lucide-react"

export async function ProductsList() {
  const products = await getAllProducts()

  if (products.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No products found. Add your first product to get started.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <div className="grid grid-cols-12 p-4 text-sm font-medium">
          <div className="col-span-4 md:col-span-3">Product</div>
          <div className="col-span-3 md:col-span-2">Barcode</div>
          <div className="hidden md:block md:col-span-2">Batch</div>
          <div className="col-span-3 md:col-span-2">Expiry Date</div>
          <div className="col-span-2 md:col-span-3 text-right">Actions</div>
        </div>

        {products.map((product) => {
          const expiryDate = new Date(product.expiryDate)
          const isExpired = expiryDate < new Date()
          const isExpiringSoon = !isExpired && expiryDate < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

          return (
            <div key={product.id} className="grid grid-cols-12 items-center p-4 border-t">
              <div className="col-span-4 md:col-span-3">
                <div className="font-medium truncate">{product.name}</div>
                {product.aisle && <div className="text-xs text-muted-foreground truncate">Aisle: {product.aisle}</div>}
              </div>
              <div className="col-span-3 md:col-span-2 text-sm truncate">{product.barcode}</div>
              <div className="hidden md:block md:col-span-2 text-sm truncate">{product.batchNumber || "-"}</div>
              <div className="col-span-3 md:col-span-2">
                <div className="flex items-center gap-1">
                  {isExpired ? (
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                  ) : isExpiringSoon ? (
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                  ) : (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  )}
                  <span className="text-sm truncate">{format(expiryDate, "dd MMM yyyy")}</span>
                </div>
                {isExpired ? (
                  <Badge variant="destructive" className="mt-1">
                    Expired
                  </Badge>
                ) : isExpiringSoon ? (
                  <Badge variant="default" className="mt-1">
                    Expiring Soon
                  </Badge>
                ) : null}
              </div>
              <div className="col-span-2 md:col-span-3 flex justify-end">
                <Link href={`/products/${product.id}`}>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-1 md:mr-2" />
                    <span className="hidden md:inline">View</span>
                  </Button>
                </Link>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

