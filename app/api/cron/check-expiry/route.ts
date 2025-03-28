import { NextResponse } from "next/server"
import { getExpiringProducts, getSettings } from "@/lib/products"
import { sendExpiryNotification } from "@/lib/notifications"

export async function GET() {
  try {
    // Get settings to determine notification days
    const settings = await getSettings()

    // Get products expiring within the notification days
    const expiringProducts = await getExpiringProducts(settings.notifyDays)

    // If notifications are enabled and there are expiring products
    if (settings.enableNotifications && expiringProducts.length > 0 && settings.email) {
      // Send notification email with complete product details
      await sendExpiryNotification(settings.email, expiringProducts)
    }

    return NextResponse.json({
      success: true,
      expiringCount: expiringProducts.length,
      notificationSent: settings.enableNotifications && expiringProducts.length > 0 && !!settings.email,
    })
  } catch (error) {
    console.error("Error in expiry check cron:", error)
    return NextResponse.json({ success: false, error: "Failed to check expiring products" }, { status: 500 })
  }
}

