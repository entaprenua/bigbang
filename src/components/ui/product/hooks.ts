import { createMemo, type Accessor } from "solid-js"
import { useProduct } from "./product-root"
import { useCart } from "../cart/cart-context"
import { useWishlist } from "../wishlist/wishlist-context"
import { useProductVariantOptional } from "./product-variants"
import type { Product } from "~/lib/types"

export function useResolvedProduct(): Accessor<Partial<Product> | null> {
  const product = useProduct()
  const variantCtx = useProductVariantOptional()

  return createMemo(() => {
    const parent = product
    if (!parent) return null

    const variant = variantCtx?.selectedVariant()
    const v = variant ?? parent?.variants?.[0]
    if (!v) return parent
    const merged = { ...parent } as Record<string, unknown>
    for (const [key, val] of Object.entries(v)) {
      if (val != null) merged[key] = val
    }
    return merged as Partial<Product>
  })
}

export function useIsInCart() {
  const p = useResolvedProduct()
  const cart = useCart()
  return createMemo(() => {
    const resolved = p()
    if (!resolved?.id || !cart) return false
    return cart.has(resolved.id)
  })
}

export function useIsInWishlist() {
  const p = useResolvedProduct()
  let wishlist: ReturnType<typeof useWishlist> | undefined
  try { wishlist = useWishlist() } catch { }
  return createMemo(() => {
    const resolved = p()
    if (!resolved?.id || !wishlist) return false
    return wishlist.hasProduct(resolved.id)
  })
}



