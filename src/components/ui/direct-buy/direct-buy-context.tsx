import { createContext, useContext, createResource, createSignal, createEffect, type JSX, type Accessor, createMemo } from "solid-js"
import { useSearchParams } from "@solidjs/router"
import { productsApi } from "~/lib/api/products"
import { useCart } from "../cart/cart-context"
import type { Product } from "~/lib/types"

export type DirectBuyItemData = {
  id: string
  productId: string
  quantity: number
  price: number | null
  name: string | null
  image?: string
  selected: boolean
  subtotal: number
  slug?: string
  options?: string
  parentId?: string
  description?: string
  sku?: string
  stockQuantity?: number
  compareToPrice?: number
  weight?: number
  optionValues?: string
}

type DirectBuyContextType = {
  productId: Accessor<string | undefined>
  product: Accessor<Product | undefined>
  refetch: () => void
  quantity: Accessor<number>
  setQuantity: (n: number) => void
  maxQuantity: Accessor<number>
  item: Accessor<DirectBuyItemData | undefined>
  isLoading: Accessor<boolean>
}

const DirectBuyContext = createContext<DirectBuyContextType>()

export function DirectBuyProvider(props: { children?: JSX.Element }) {
  const [params] = useSearchParams()
  const cart = useCart()

  const productId = () => {
    const id = params.productId
    if (id && !Array.isArray(id)) return id
    return undefined
  }

  const [product, { refetch }] = createResource(productId, (id: string) => productsApi.getById(id))

  const maxQuantity = createMemo(() => {
    const p = product()
    if (!p) return 1
    const stock = p.stockQuantity ?? 0
    const reserved = p.reservedQuantity ?? 0
    return Math.max(1, stock - reserved)
  })

  // Priority: ?qty=N URL param > cart item quantity > 1
  const initialQty = () => {
    const q = params.qty
    if (typeof q === 'string') {
      const n = parseInt(q)
      if (!isNaN(n) && n >= 1) return n
    }
    const id = productId()
    if (id) {
      const item = cart.find(id)
      if (item) return item.quantity
    }
    return 1
  }

  const [quantity, setQuantityRaw] = createSignal(initialQty())

  // Sync from cart once it loads (catches late-arriving cart data)
  createEffect(() => {
    const id = productId()
    if (!id) return
    const item = cart.find(id)
    if (item && item.quantity !== quantity()) {
      setQuantityRaw(item.quantity)
    }
  })

  const setQuantity = (n: number) => {
    setQuantityRaw(Math.max(1, Math.min(n, maxQuantity())))
  }

  const item = createMemo((): DirectBuyItemData | undefined => {
    const id = productId()
    const p = product()
    if (!id || !p) return undefined
    const qty = quantity()
    const price = p.price ? parseFloat(p.price) : null
    const r = {
      id,
      productId: id,
      quantity: qty,
      price,
      name: p.name ?? null,
      image: p.image ?? undefined,
      selected: true,
      subtotal: price * qty,
      slug: p.slug ?? undefined,
      options: p.options ?? undefined,
      parentId: p.parentId ?? undefined,
      description: p.description ?? undefined,
      sku: p.sku ?? undefined,
      stockQuantity: p.stockQuantity ?? undefined,
      compareToPrice: p.compareToPrice ? parseFloat(p.compareToPrice) : undefined,
      weight: p.weight ?? undefined,
      optionValues: p.optionValues ?? undefined,
    }
    console.log("Dr: ", r)
    return r
  })

  const isLoading = () => product.loading

  return (
    <DirectBuyContext.Provider value={{ productId, product, refetch, quantity, setQuantity, maxQuantity, item, isLoading }}>
      {props.children}
    </DirectBuyContext.Provider>
  )
}

export function useDirectBuy(): DirectBuyContextType | null {
  const ctx = useContext(DirectBuyContext)
  if (!ctx || !ctx.productId()) return null
  return ctx
}
