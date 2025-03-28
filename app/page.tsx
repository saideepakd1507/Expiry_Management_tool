import { Suspense } from "react"
import Link from "next/link"
import { Search, Barcode, Plus, List, Clock } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ExpiringProductsList } from "@/components/expiring-products-list"
import { SearchResults } from "@/components/search-results"

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Product Expiry Tracker</h1>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search products by name or barcode..." className="pl-8" />
        </div>
        <Suspense fallback={<div className="mt-4 text-center">Loading results...</div>}>
          <SearchResults />
        </Suspense>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Scan Barcode</CardTitle>
            <CardDescription>Scan a product barcode to check or add</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Link href="/scan" className="w-full">
              <Button variant="outline" size="lg" className="w-full">
                <Barcode className="mr-2 h-5 w-5" />
                Open Scanner
              </Button>
            </Link>
          </CardContent>
          <CardFooter>
            <Link href="/scan" className="w-full">
              <Button className="w-full">Start Scanning</Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Add Product</CardTitle>
            <CardDescription>Manually add a new product</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Link href="/products/add" className="w-full">
              <Button variant="outline" size="lg" className="w-full">
                <Plus className="mr-2 h-5 w-5" />
                New Product
              </Button>
            </Link>
          </CardContent>
          <CardFooter>
            <Link href="/products/add" className="w-full">
              <Button className="w-full">Add Product</Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>View Products</CardTitle>
            <CardDescription>See all your tracked products</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Link href="/products" className="w-full">
              <Button variant="outline" size="lg" className="w-full">
                <List className="mr-2 h-5 w-5" />
                Product List
              </Button>
            </Link>
          </CardContent>
          <CardFooter>
            <Link href="/products" className="w-full">
              <Button className="w-full">View All</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="mr-2 h-5 w-5 text-amber-500" />
            Expiring Soon
          </CardTitle>
          <CardDescription>Products that will expire within 30 days</CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div className="text-center py-4">Loading expiring products...</div>}>
            <ExpiringProductsList />
          </Suspense>
        </CardContent>
        <CardFooter>
          <Link href="/expiring" className="w-full">
            <Button variant="outline" className="w-full">
              View All Expiring Products
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </main>
  )
}

