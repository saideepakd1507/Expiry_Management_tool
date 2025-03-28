import Link from "next/link"
import { Barcode } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Barcode className="h-6 w-6" />
          <span className="font-bold">Product Expiry Tracker</span>
        </Link>
        <nav className="flex items-center gap-4">
          <Link href="/products">
            <Button variant="ghost">Products</Button>
          </Link>
          <Link href="/scan">
            <Button variant="ghost">Scan</Button>
          </Link>
          <Link href="/analytics">
            <Button variant="ghost">Analytics</Button>
          </Link>
          <Link href="/settings">
            <Button variant="ghost">Settings</Button>
          </Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  )
}

