import { notFound } from "next/navigation"
import Link from "next/link"
import { getProductById } from "@/lib/products"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Barcode, Calendar, DollarSign, MapPin, Package } from "lucide-react"
import { format } from "date-fns"
import { DeleteProductButton } from "@/components/delete-product-button"
import { Badge } from "@/components/ui/badge"

interface ProductPageProps {
  params: {
    id: string
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProductById(params.id)

  if (!product) {
    notFound()
  }

  const expiryDate = new Date(product.expiryDate)
  const isExpired = expiryDate < new Date()
  const isExpiringSoon = !isExpired && expiryDate < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">{product.name}</h1>
        <Link href="/products">
          <Button variant="outline">Back to Products</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product Details</CardTitle>
          <CardDescription>View and manage product information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-start gap-2">
              <Barcode className="h-5 w-5 mt-0.5 text-muted-foreground" />
              <div>
                <div className="text-sm font-medium">Barcode</div>
                <div>{product.barcode}</div>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <DollarSign className="h-5 w-5 mt-0.5 text-muted-foreground" />
              <div>
                <div className="text-sm font-medium">Price</div>
                <div>{product.price ? `$${product.price.toFixed(2)}` : "Not specified"}</div>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Package className="h-5 w-5 mt-0.5 text-muted-foreground" />
              <div>
                <div className="text-sm font-medium">Batch Number</div>
                <div>{product.batchNumber || "Not specified"}</div>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Calendar className="h-5 w-5 mt-0.5 text-muted-foreground" />
              <div>
                <div className="text-sm font-medium">Expiry Date</div>
                <div className="flex items-center gap-2">
                  {format(expiryDate, "PPP")}
                  {isExpired ? (
                    <Badge variant="destructive">Expired</Badge>
                  ) : isExpiringSoon ? (
                    <Badge variant="default">Expiring Soon</Badge>
                  ) : (
                    <Badge variant="outline" className="text-green-600">
                      Valid
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {product.aisle && (
              <div className="flex items-start gap-2">
                <MapPin className="h-5 w-5 mt-0.5 text-muted-foreground" />
                <div>
                  <div className="text-sm font-medium">Aisle</div>
                  <div>{product.aisle}</div>
                </div>
              </div>
            )}

            <div className="flex items-start gap-2">
              <Calendar className="h-5 w-5 mt-0.5 text-muted-foreground" />
              <div>
                <div className="text-sm font-medium">Added On</div>
                <div>{format(new Date(product.createdAt), "PPP")}</div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <DeleteProductButton id={product.id} />
          <Link href={`/products/${product.id}/edit`}>
            <Button>Edit Product</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}

