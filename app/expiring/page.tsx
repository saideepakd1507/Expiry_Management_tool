import { Suspense } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ExpiringProductsList } from "@/components/expiring-products-list"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ExpiredProductsList } from "@/components/expired-products-list"

export default function ExpiringPage() {
  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Expiry Tracking</h1>
        <Link href="/products">
          <Button variant="outline">Back to Products</Button>
        </Link>
      </div>

      <Tabs defaultValue="expiring">
        <TabsList className="mb-4">
          <TabsTrigger value="expiring">Expiring Soon</TabsTrigger>
          <TabsTrigger value="expired">Expired</TabsTrigger>
        </TabsList>

        <TabsContent value="expiring">
          <Card>
            <CardHeader>
              <CardTitle>Products Expiring Soon</CardTitle>
              <CardDescription>Products that will expire within 30 days</CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<div className="text-center py-8">Loading expiring products...</div>}>
                <ExpiringProductsList />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expired">
          <Card>
            <CardHeader>
              <CardTitle>Expired Products</CardTitle>
              <CardDescription>Products that have already expired</CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<div className="text-center py-8">Loading expired products...</div>}>
                <ExpiredProductsList />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

