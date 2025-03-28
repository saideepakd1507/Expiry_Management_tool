import { getExpiredProducts } from "@/lib/products"
import { formatDistanceToNow } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export async function ExpiredProductsList() {
  const products = await getExpiredProducts()

  if (products.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">No expired products found</div>
  }

  return (
    <div className="space-y-4">
      {products.map((product) => {
        const expiredAgo = formatDistanceToNow(new Date(product.expiryDate), { addSuffix: true })

        return (
          <div key={product.id} className="flex items-center justify-between border-b pb-3">
            <div>
              <div className="font-medium">{product.name}</div>
              <div className="text-sm text-muted-foreground">Batch: {product.batchNumber || "N/A"}</div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="destructive" className="flex items-center">
                <AlertTriangle className="mr-1 h-3 w-3" />
                Expired {expiredAgo}
              </Badge>
              <Link href={`/products/${product.id}`}>
                <Button variant="outline" size="sm">
                  View
                </Button>
              </Link>
            </div>
          </div>
        )
      })}
    </div>
  )
}

