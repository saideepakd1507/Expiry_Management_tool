import { getAllProducts } from "@/lib/products"
import { ProductCard } from "@/components/product-card"

export async function ProductsGrid() {
  const products = await getAllProducts()

  if (products.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No products found. Add your first product to get started.
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}

