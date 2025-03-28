import { getExpiringProducts } from "@/lib/products"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle } from "lucide-react"

export async function ExpiringProductsList() {
  const products = await getExpiringProducts()

  if (products.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">No products expiring soon</div>
  }

  return (
    <div className="space-y-4">
      {products.map((product) => {
        const daysToExpiry = Math.ceil((new Date(product.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))

        let badgeVariant: "default" | "secondary" | "destructive" = "secondary"
        if (daysToExpiry <= 3) badgeVariant = "destructive"
        else if (daysToExpiry <= 7) badgeVariant = "default"

        return (
          <div key={product.id} className="flex items-center justify-between border-b pb-3">
            <div>
              <div className="font-medium">{product.name}</div>
              <div className="text-sm text-muted-foreground">Batch: {product.batchNumber}</div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={badgeVariant}>
                {daysToExpiry <= 0 ? (
                  <span className="flex items-center">
                    <AlertTriangle className="mr-1 h-3 w-3" />
                    Expired
                  </span>
                ) : (
                  `Expires in ${daysToExpiry} days`
                )}
              </Badge>
            </div>
          </div>
        )
      })}
    </div>
  )
}

