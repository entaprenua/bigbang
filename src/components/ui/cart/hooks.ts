import { useCart } from "./cart-context"
import { useResolvedProduct } from "../product/hooks"

export function useQuantityUpdate() {
  const cart = useCart()
  const p = useResolvedProduct()
  return async (newQty: number) => {
    const resolved = p()
    if (!resolved?.id) return
    if (newQty <= 0) {
      await cart.remove({ productId: resolved.id })
    } else {
      await cart.updateQuantity({ productId: resolved.id, quantity: newQty })
    }
  }
}
