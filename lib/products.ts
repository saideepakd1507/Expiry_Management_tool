import { promises as fs } from "fs"
import path from "path"
import { v4 as uuidv4 } from "uuid"

// Define the data directory
const DATA_DIR = path.join(process.cwd(), "data")
const PRODUCTS_FILE = path.join(DATA_DIR, "products.json")
const SETTINGS_FILE = path.join(DATA_DIR, "settings.json")

// Define product type
export interface Product {
  id: string
  barcode: string
  name: string
  price: number
  expiryDate: string
  batchNumber?: string
  aisle?: string
  createdAt: string
  updatedAt: string
}

// Define settings type
export interface Settings {
  email: string
  notifyDays: number
  enableNotifications: boolean
  enableAutoDelete: boolean
}

// Default settings
const DEFAULT_SETTINGS: Settings = {
  email: "",
  notifyDays: 30,
  enableNotifications: true,
  enableAutoDelete: false,
}

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true })
  } catch (error) {
    console.error("Error creating data directory:", error)
  }
}

// Get all products
export async function getAllProducts(): Promise<Product[]> {
  await ensureDataDir()

  try {
    const data = await fs.readFile(PRODUCTS_FILE, "utf8")
    return JSON.parse(data)
  } catch (error) {
    // If file doesn't exist, create it with an empty array
    await fs.writeFile(PRODUCTS_FILE, JSON.stringify([]), "utf8")
    return []
  }
}

// Get product by ID
export async function getProductById(id: string): Promise<Product | null> {
  try {
    const products = await getAllProducts()
    return products.find((product) => product.id === id) || null
  } catch (error) {
    console.error("Error getting product by ID:", error)
    return null
  }
}

// Check if product exists by barcode
export async function checkProductExists(barcode: string): Promise<Product | null> {
  try {
    const products = await getAllProducts()
    return products.find((product) => product.barcode === barcode) || null
  } catch (error) {
    console.error("Error checking if product exists:", error)
    return null
  }
}

// Add a new product
export async function addProduct(productData: Omit<Product, "id" | "createdAt" | "updatedAt">): Promise<Product> {
  try {
    const products = await getAllProducts()

    const newProduct: Product = {
      id: uuidv4(),
      ...productData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    products.push(newProduct)
    await saveProducts(products)

    return newProduct
  } catch (error) {
    console.error("Error adding product:", error)
    throw new Error("Failed to add product")
  }
}

// Update a product
export async function updateProduct(
  id: string,
  productData: Partial<Omit<Product, "id" | "createdAt" | "updatedAt">>,
): Promise<Product | null> {
  try {
    const products = await getAllProducts()
    const index = products.findIndex((product) => product.id === id)

    if (index === -1) {
      return null
    }

    products[index] = {
      ...products[index],
      ...productData,
      updatedAt: new Date().toISOString(),
    }

    await saveProducts(products)

    return products[index]
  } catch (error) {
    console.error("Error updating product:", error)
    throw new Error("Failed to update product")
  }
}

// Delete a product
export async function deleteProduct(id: string): Promise<boolean> {
  try {
    const products = await getAllProducts()
    const filteredProducts = products.filter((product) => product.id !== id)

    if (filteredProducts.length === products.length) {
      return false
    }

    await saveProducts(filteredProducts)

    return true
  } catch (error) {
    console.error("Error deleting product:", error)
    throw new Error("Failed to delete product")
  }
}

// Save products to file
async function saveProducts(products: Product[]): Promise<void> {
  try {
    await ensureDataDir()
    await fs.writeFile(PRODUCTS_FILE, JSON.stringify(products, null, 2), "utf8")
  } catch (error) {
    console.error("Error saving products:", error)
    throw new Error("Failed to save products")
  }
}

// Get expiring products
export async function getExpiringProducts(days = 30): Promise<Product[]> {
  try {
    const products = await getAllProducts()
    const now = new Date()
    const futureDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000)

    return products
      .filter((product) => {
        const expiryDate = new Date(product.expiryDate)
        return expiryDate > now && expiryDate <= futureDate
      })
      .sort((a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime())
  } catch (error) {
    console.error("Error getting expiring products:", error)
    return []
  }
}

// Get expired products
export async function getExpiredProducts(): Promise<Product[]> {
  try {
    const products = await getAllProducts()
    const now = new Date()

    return products
      .filter((product) => {
        const expiryDate = new Date(product.expiryDate)
        return expiryDate <= now
      })
      .sort((a, b) => new Date(b.expiryDate).getTime() - new Date(a.expiryDate).getTime())
  } catch (error) {
    console.error("Error getting expired products:", error)
    return []
  }
}

// Search products
export async function searchProducts(query: string): Promise<Product[]> {
  try {
    const products = await getAllProducts()
    const lowerQuery = query.toLowerCase()

    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(lowerQuery) ||
        product.barcode.includes(lowerQuery) ||
        (product.batchNumber && product.batchNumber.toLowerCase().includes(lowerQuery)),
    )
  } catch (error) {
    console.error("Error searching products:", error)
    return []
  }
}

// Get settings
export async function getSettings(): Promise<Settings> {
  await ensureDataDir()

  try {
    const data = await fs.readFile(SETTINGS_FILE, "utf8")
    return { ...DEFAULT_SETTINGS, ...JSON.parse(data) }
  } catch (error) {
    // If file doesn't exist, return default settings
    return DEFAULT_SETTINGS
  }
}

// Save settings
export async function saveSettings(settings: Partial<Settings>): Promise<Settings> {
  try {
    await ensureDataDir()

    const currentSettings = await getSettings()
    const newSettings = { ...currentSettings, ...settings }

    await fs.writeFile(SETTINGS_FILE, JSON.stringify(newSettings, null, 2), "utf8")

    return newSettings
  } catch (error) {
    console.error("Error saving settings:", error)
    throw new Error("Failed to save settings")
  }
}

