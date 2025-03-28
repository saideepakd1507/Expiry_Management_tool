"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Edit } from "lucide-react"

interface ProductActionsProps {
  product: any
}

export function ProductActions({ product }: ProductActionsProps) {
  return (
    <Link href={`/products/${product.id}/edit`}>
      <Button>
        <Edit className="mr-2 h-4 w-4" />
        Edit Product
      </Button>
    </Link>
  )
}

