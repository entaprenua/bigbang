import { createEffect, createResource, createMemo, type JSX } from 'solid-js'
import { createStore, reconcile } from 'solid-js/store'
import { useSearchParams } from '@solidjs/router'
import { Collection } from '../collection'
import { useCart } from '../cart/cart-context'
import { productsApi } from '~/lib/api/products'
import { CheckoutItemsContext, useCheckoutItems, type CheckoutItemEntry } from './checkout-context'

type CheckoutItemsProviderProps = {
  children?: JSX.Element
}

function CheckoutItemsProvider(props: CheckoutItemsProviderProps) {
  const [params] = useSearchParams()
  const cart = useCart()

  // ── Direct buy logic ──

  const productId = () => {
    const id = params.productId
    if (id && !Array.isArray(id)) return id
    return undefined
  }

  const [product] = createResource(productId, (id: string) => productsApi.getById(id))

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

  const directBuyItem = createMemo((): CheckoutItemEntry | undefined => {
    const id = productId()
    const p = product()
    if (!id || !p) return undefined
    const qty = initialQty()
    const price = p.price ? parseFloat(p.price) : null
    return {
      id,
      productId: id,
      quantity: qty,
      price,
      name: p.name ?? null,
      image: p.image?.src ?? undefined,
      selected: true,
      subtotal: (price ?? 0) * qty,
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
  })

  // ── Checkout items store ──

  const [items, setItems] = createStore<CheckoutItemEntry[]>([])

  createEffect(() => {
    const item = directBuyItem()
    if (item) {
      setItems(reconcile([item]))
    } else {
      setItems(reconcile(cart.items.filter(i => i.selected).map(i => ({ ...i })) as CheckoutItemEntry[]))
    }
  })

  const apiItems = createMemo(() =>
    items.map(item => ({
      productId: item.productId,
      quantity: item.quantity,
      subtotal: (item.subtotal ?? 0).toFixed(2),
      metadata: item.metadata ?? undefined,
    }))
  )

  const maxQuantity = (itemId: string) => {
    const item = items.find(i => i.id === itemId)
    if (!item) return 1
    const stock = item.stockQuantity ?? 0
    return Math.max(1, stock)
  }

  const refetch = async (itemId: string) => {
    const item = items.find(i => i.id === itemId)
    if (!item) return
    const fresh = await productsApi.getById(item.productId)
    if (fresh) {
      const idx = items.findIndex(i => i.id === itemId)
      if (idx >= 0) setItems(idx, 'stockQuantity', fresh.stockQuantity ?? undefined)
    }
  }

  const updateQuantity = (itemId: string, quantity: number) => {
    const idx = items.findIndex(i => i.id === itemId)
    if (idx >= 0) {
      const max = maxQuantity(itemId)
      setItems(idx, 'quantity', Math.max(1, Math.min(quantity, max)))
    }
  }

  const removeItem = (itemId: string) => {
    setItems((items) => items.filter(i => i.id !== itemId))
  }

  return (
    <CheckoutItemsContext.Provider value={{ items, apiItems, updateQuantity, removeItem, refetch, maxQuantity }}>
      {props.children}
    </CheckoutItemsContext.Provider>
  )
}

type CheckoutItemsProps = {
  class?: string
  children?: JSX.Element
}

function CheckoutItems(props: CheckoutItemsProps) {
  const { items } = useCheckoutItems()
  return <Collection data={items}>{props.children}</Collection>
}

export { CheckoutItemsProvider, CheckoutItems }
export type { CheckoutItemsProviderProps, CheckoutItemsProps }
