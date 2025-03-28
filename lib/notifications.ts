import type { Product } from "./products"

// This is a placeholder for email sending functionality
// In a real application, you would use a service like SendGrid, Mailgun, etc.
export async function sendExpiryNotification(email: string, products: Product[]): Promise<boolean> {
  console.log(`Sending expiry notification to ${email} for ${products.length} products`)

  // Format the email content with complete product details
  const emailSubject = `Alert: ${products.length} Products Expiring Soon`

  let emailContent = `
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; }
        .product { margin-bottom: 20px; padding: 15px; border: 1px solid #ddd; border-radius: 5px; }
        .product-name { font-size: 18px; font-weight: bold; margin-bottom: 5px; }
        .product-detail { margin: 5px 0; }
        .expiry-soon { color: #f59e0b; }
        .expired { color: #ef4444; }
      </style>
    </head>
    <body>
      <h1>Product Expiry Alert</h1>
      <p>The following products in your inventory are expiring soon:</p>
  `

  products.forEach((product) => {
    const expiryDate = new Date(product.expiryDate)
    const now = new Date()
    const daysToExpiry = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

    let expiryClass = ""
    let expiryStatus = ""

    if (daysToExpiry <= 0) {
      expiryClass = "expired"
      expiryStatus = "EXPIRED"
    } else if (daysToExpiry <= 7) {
      expiryClass = "expiry-soon"
      expiryStatus = `Expires in ${daysToExpiry} days`
    } else {
      expiryStatus = `Expires in ${daysToExpiry} days`
    }

    emailContent += `
      <div class="product">
        <div class="product-name">${product.name}</div>
        <div class="product-detail"><strong>Barcode:</strong> ${product.barcode}</div>
        <div class="product-detail"><strong>Price:</strong> $${product.price.toFixed(2)}</div>
        <div class="product-detail"><strong>Batch Number:</strong> ${product.batchNumber || "N/A"}</div>
        <div class="product-detail"><strong>Aisle:</strong> ${product.aisle || "N/A"}</div>
        <div class="product-detail ${expiryClass}"><strong>Expiry Status:</strong> ${expiryStatus}</div>
        <div class="product-detail"><strong>Expiry Date:</strong> ${expiryDate.toLocaleDateString()}</div>
      </div>
    `
  })

  emailContent += `
      <p>Please take appropriate action for these products.</p>
      <p>Thank you,<br>Product Expiry Tracker</p>
    </body>
    </html>
  `

  // In a real application, you would send this email using an email service
  // For now, we'll just log it to the console
  console.log("Email Subject:", emailSubject)
  console.log("Email Content:", emailContent)

  // Simulate successful email sending
  return true
}

