import { Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProductAnalytics } from "@/components/product-analytics"
import { SeasonalSuggestions } from "@/components/seasonal-suggestions"

export default function AnalyticsPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Analytics & Suggestions</h1>

      <Tabs defaultValue="analytics">
        <TabsList className="mb-4">
          <TabsTrigger value="analytics">Product Analytics</TabsTrigger>
          <TabsTrigger value="suggestions">Seasonal Suggestions</TabsTrigger>
        </TabsList>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Product Analytics</CardTitle>
              <CardDescription>Insights about your product inventory</CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<div className="text-center py-8">Loading analytics...</div>}>
                <ProductAnalytics />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="suggestions">
          <Card>
            <CardHeader>
              <CardTitle>Seasonal Product Suggestions</CardTitle>
              <CardDescription>Recommendations based on current season and trends</CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<div className="text-center py-8">Loading suggestions...</div>}>
                <SeasonalSuggestions />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

