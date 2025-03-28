"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { searchProducts } from "@/lib/products"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { formatDistanceToNow } from "date-fns"

export function SearchResults() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""
  const [results, setResults] = useState<any[]>([])

  useEffect(() => {
    if (query.length > 2) {
      const fetchResults = async () => {
        const products = await searchProducts(query)
        setResults(products)
      }

      fetchResults()
    } else {
      setResults([])
    }
  }, [query])

  if (query.length <= 2) {
    return null
  }

  if (results.length === 0) {
    return (
      <Card className="mt-4">
        <CardContent className="p-4">
          <p className="text-center text-muted-foreground">No products found</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="mt-4">
      <CardContent className="p-4">
        <h3 className="font-medium mb-2">Search Results</h3>
        <div className="space-y-3">
          {results.map((product) => (
            <div key={product.id} className="flex items-center justify-between border-b pb-2">
              <div>
                <div className="font-medium">{product.name}</div>
                <div className="text-sm text-muted-foreground">
                  Barcode: {product.barcode} • Expires:{" "}
                  {formatDistanceToNow(new Date(product.expiryDate), { addSuffix: true })}
                </div>
              </div>
              <Link href={`/products/${product.id}`}>
                <Button variant="outline" size="sm">
                  View
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

