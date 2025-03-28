import { getAllProducts, getExpiringProducts, getExpiredProducts } from "@/lib/products"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartLegend, ChartTitle } from "@/components/ui/chart"
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"

export async function ProductAnalytics() {
  const allProducts = await getAllProducts()
  const expiringProducts = await getExpiringProducts()
  const expiredProducts = await getExpiredProducts()

  // Calculate valid products (not expired or expiring soon)
  const validProducts = allProducts.filter((product) => {
    const expiryDate = new Date(product.expiryDate)
    return expiryDate > new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  })

  // Prepare data for pie chart
  const statusData = [
    { name: "Valid", value: validProducts.length, color: "#10b981" },
    { name: "Expiring Soon", value: expiringProducts.length, color: "#f59e0b" },
    { name: "Expired", value: expiredProducts.length, color: "#ef4444" },
  ]

  // Calculate category distribution
  const categoryMap = new Map<string, number>()
  allProducts.forEach((product) => {
    // In a real app, you would have a category field
    // For this demo, we'll use the first word of the product name as a simulated category
    const category = product.name.split(" ")[0]
    categoryMap.set(category, (categoryMap.get(category) || 0) + 1)
  })

  const categoryData = Array.from(categoryMap.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5) // Top 5 categories

  // Generate random colors for categories
  const CATEGORY_COLORS = ["#3b82f6", "#8b5cf6", "#ec4899", "#14b8a6", "#f97316", "#84cc16", "#06b6d4"]

  if (allProducts.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No product data available for analytics. Add some products to see insights.
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Products</CardTitle>
            <CardDescription>All products in inventory</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{allProducts.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Expiring Soon</CardTitle>
            <CardDescription>Products expiring within 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-500">{expiringProducts.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Expired</CardTitle>
            <CardDescription>Products that have expired</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-500">{expiredProducts.length}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Product Status Distribution</CardTitle>
            <CardDescription>Breakdown of product expiry status</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ChartContainer>
              <ChartTitle>Product Status</ChartTitle>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip />
                </PieChart>
              </ResponsiveContainer>
              <ChartLegend className="mt-4">
                {statusData.map((entry, index) => (
                  <div key={`legend-${index}`} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
                    <span>
                      {entry.name}: {entry.value}
                    </span>
                  </div>
                ))}
              </ChartLegend>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Product Categories</CardTitle>
            <CardDescription>Most common product types</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ChartContainer>
              <ChartTitle>Category Distribution</ChartTitle>
              {categoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                      ))}
                    </Pie>
                    <ChartTooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">Not enough data for category analysis</p>
                </div>
              )}
              <ChartLegend className="mt-4">
                {categoryData.map((entry, index) => (
                  <div key={`legend-${index}`} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: CATEGORY_COLORS[index % CATEGORY_COLORS.length] }}
                    ></div>
                    <span>
                      {entry.name}: {entry.value}
                    </span>
                  </div>
                ))}
              </ChartLegend>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

