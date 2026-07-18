/**
 * Cart data fetches fresh via SolidJS `createResource` on every page load.
 * Mutations update the `items` store granularly — no full-cart refetches.
 * Loading state is tracked via per-product `pendingIds` set and TanStack
 * Query's `isPending`.
 */

import { createContext, useContext, createResource, type JSX, type Accessor, createMemo, createSignal, createEffect } from "solid-js"
import { createStore } from "solid-js/store"
import { useMutation as createMutation } from "@tanstack/solid-query"
import { cartsApi, type Cart, type CartItem } from "~/lib/api/carts"

export type CartItemContextData = {
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

export type AddToCartInput = {
  productId: string
  name?: string
  price: number
  image?: string
  quantity?: number
  selected?: boolean
}

export type MutationState = {
  isPending: boolean
  isError: boolean
  error: Error | null
}

type CartContextValue = {
  cart: Accessor<Cart | null>
  cartId: Accessor<string | null>
  items: CartItemContextData[]
  selectedItems: Accessor<CartItemContextData[]>
  count: Accessor<number>
  subtotal: Accessor<number>
  selectedSubtotal: Accessor<number>
  isEmpty: Accessor<boolean>
  isLoading: Accessor<boolean>
  isPending: (productId?: string) => boolean
  error: Accessor<Error | null>
  addItem: (item: AddToCartInput) => Promise<undefined>
  remove: (opts: { itemId?: string; productId?: string }) => Promise<undefined>
  updateQuantity: (opts: { itemId?: string; quantity: number; productId?: string }) => Promise<undefined>
  toggleSelected: (itemId: string) => void
  selectAll: () => void
  deselectAll: () => void
  clear: () => void
  clearSelected: () => void
  refetch: () => void
  has: (productId: string) => boolean
  find: (productId: string) => CartItemContextData | undefined
  mutations: {
    addItem: MutationState
    removeItem: MutationState
    updateQuantity: MutationState
    clearCart: MutationState
    clearSelected: MutationState
  }
}

const CartContext = createContext<CartContextValue>()

export const useCart = (): CartContextValue => {
  const ctx = useContext(CartContext)
  if (!ctx) {
    throw new Error("useCart must be used within CartProvider")
  }
  return ctx
}

const cartItemToContext = (item: CartItem): CartItemContextData => {
  const price = typeof item.price === "string" ? parseFloat(item.price) : (item.price ?? null)
  const sub = typeof item.subtotal === "string" ? parseFloat(item.subtotal) : (item.subtotal ?? 0)
  const p = item.product
  return {
    id: item.id!,
    productId: item.productId,
    quantity: item.quantity,
    price,
    name: p?.name ?? null,
    image: p?.image ?? undefined,
    selected: item.selected ?? true,
    subtotal: sub,
    slug: p?.slug ?? undefined,
    options: p?.options ?? undefined,
    parentId: p?.parentId ?? undefined,
    description: p?.description ?? undefined,
    sku: p?.sku ?? undefined,
    stockQuantity: p?.stockQuantity ?? undefined,
    compareToPrice: p?.compareToPrice ? parseFloat(p.compareToPrice) : undefined,
    weight: p?.weight ?? undefined,
    optionValues: p?.optionValues ?? undefined,
  }
}

type CartProviderProps = {
  children?: JSX.Element
  loadingFallback?: JSX.Element
  errorFallback?: (error: Error) => JSX.Element
}

export const CartProvider = (props: CartProviderProps) => {
  const [cart, setCart] = createSignal<Cart | null>(null)
  const [error, setError] = createSignal<Error | null>(null)
  const [pendingIds, setPendingIds] = createSignal<Set<string>>(new Set())
  const addPendingId = (id: string) => setPendingIds(prev => new Set(prev).add(id))
  const removePendingId = (id: string) => setPendingIds(prev => {
    const next = new Set(prev)
    next.delete(id)
    return next
  })

  const cartId = (): string | null => cart()?.id ?? null

  const [cartResource, { refetch: refetchCartResource }] = createResource(
    async () => cartsApi.get(),
    { initialValue: null }
  )

  createEffect(() => {
    const data = cartResource()
    const loading = cartResource.loading
    const queryError = cartResource.error
    if (!queryError && !loading && data) {
      setCart(data)
    }
  })

  createEffect(() => {
    if (cartResource.error) {
      setError(cartResource.error as Error)
    }
  })

  const currentCart = () => cart()

  const [items, setItems] = createStore<CartItemContextData[]>([])

  createEffect(() => {
    const c = currentCart()
    const mapped = c?.items ? c.items.map(cartItemToContext) : []
    setItems(mapped)
  })

  const upsertItem = (item: CartItem) => {
    const ctx = cartItemToContext(item)
    const idx = items.findIndex(i => i.id === ctx.id)
    if (idx >= 0) setItems(idx, ctx)
    else setItems(items.length, ctx)
  }

  const removeItemFromStore = (itemId: string) => {
    setItems(items.filter(i => i.id !== itemId))
  }

  const count = createMemo(() => items.length)

  const subtotal = createMemo(() => {
    return items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  })

  const selectedItems = createMemo(() => items.filter((item) => item.selected))

  const selectedSubtotal = createMemo(() => {
    return selectedItems().reduce((sum, item) => sum + (item.price * item.quantity), 0)
  })

  const isEmpty = createMemo(() => items.length === 0)

  const addItemMutation = createMutation(() => ({
    mutationFn: async (input: AddToCartInput) => {
      return await cartsApi.addItem({
        productId: input.productId,
        quantity: input.quantity ?? 1,
      })
    },
    onMutate: async (input: AddToCartInput) => {
      addPendingId(input.productId)
    },
    onError: (err, input) => {
      removePendingId(input.productId)
      setError(err as Error)
    },
    onSuccess: (item) => upsertItem(item),
    onSettled: (_data, _error, input) => {
      removePendingId(input.productId)
    },
  }))

  const removeItemMutation = createMutation(() => ({
    mutationFn: async (itemId: string) => {
      await cartsApi.removeItem(itemId)
    },
    onMutate: async (itemId: string) => {
      addPendingId(itemId)
    },
    onError: (err, itemId) => {
      removePendingId(itemId)
      setError(err as Error)
    },
    onSuccess: (_data, itemId) => removeItemFromStore(itemId),
    onSettled: (_data, _error, itemId) => {
      removePendingId(itemId)
    },
  }))

  const updateQuantityMutation = createMutation(() => ({
    mutationFn: async ({ itemId, quantity }: { itemId: string; quantity: number }) => {
      if (quantity <= 0) {
        await cartsApi.removeItem(itemId)
        return undefined
      }
      return await cartsApi.updateItem(itemId, { quantity })
    },
    onMutate: async ({ itemId }: { itemId: string; quantity: number }) => {
      addPendingId(itemId)
    },
    onError: (err, variables) => {
      removePendingId(variables.itemId)
      setError(err as Error)
    },
    onSuccess: (item, variables) => {
      if (item) upsertItem(item)
      else removeItemFromStore(variables.itemId)
    },
    onSettled: (_data, _error, variables) => {
      removePendingId(variables.itemId)
    },
  }))

  const clearMutation = createMutation(() => ({
    mutationFn: async () => {
      await cartsApi.delete()
    },
    onError: (err) => {
      setError(err as Error)
    },
    onSuccess: () => setItems([]),
  }))

  const clearSelectedMutation = createMutation(() => ({
    mutationFn: async () => {
      await cartsApi.clearSelectedItems()
    },
    onError: (err) => {
      setError(err as Error)
    },
    onSuccess: () => setItems(items.filter(i => !i.selected)),
  }))

  const toggleSelected = async (itemId: string) => {
    const item = items.find(i => i.id === itemId)
    if (!item) return
    const updated = await cartsApi.updateItem(itemId, { selected: !item.selected })
    upsertItem(updated)
  }

  const selectAllMutation = createMutation(() => ({
    mutationFn: async () => {
      const results: CartItem[] = []
      for (const item of items) {
        if (!item.selected) {
          results.push(await cartsApi.updateItem(item.id, { selected: true }))
        }
      }
      return results
    },
    onError: (err) => {
      setError(err as Error)
    },
    onSuccess: (results) => {
      for (const item of results) upsertItem(item)
    },
  }))

  const selectAll = () => {
    selectAllMutation.mutate()
  }

  const deselectAllMutation = createMutation(() => ({
    mutationFn: async () => {
      const results: CartItem[] = []
      for (const item of items) {
        if (item.selected) {
          results.push(await cartsApi.updateItem(item.id, { selected: false }))
        }
      }
      return results
    },
    onError: (err) => {
      setError(err as Error)
    },
    onSuccess: (results) => {
      for (const item of results) upsertItem(item)
    },
  }))

  const deselectAll = () => {
    deselectAllMutation.mutate()
  }

  const refetch = () => {
    refetchCartResource()
  }

  const find = (productId: string) => {
    return items.find(item => item.productId === productId)
  }

  const has = (productId: string) =>
    find(productId) !== undefined

  const isPending = (productId?: string) => {
    if (productId) return pendingIds().has(productId)
    return (
      pendingIds().size > 0 ||
      clearMutation.isPending ||
      clearSelectedMutation.isPending ||
      selectAllMutation.isPending ||
      deselectAllMutation.isPending
    )
  }

  const mutations = {
    addItem: {
      get isPending() { return addItemMutation.isPending },
      get isError() { return addItemMutation.isError },
      get error() { return addItemMutation.error as Error | null },
    },
    removeItem: {
      get isPending() { return removeItemMutation.isPending },
      get isError() { return removeItemMutation.isError },
      get error() { return removeItemMutation.error as Error | null },
    },
    updateQuantity: {
      get isPending() { return updateQuantityMutation.isPending },
      get isError() { return updateQuantityMutation.isError },
      get error() { return updateQuantityMutation.error as Error | null },
    },
    clearCart: {
      get isPending() { return clearMutation.isPending },
      get isError() { return clearMutation.isError },
      get error() { return clearMutation.error as Error | null },
    },
    clearSelected: {
      get isPending() { return clearSelectedMutation.isPending },
      get isError() { return clearSelectedMutation.isError },
      get error() { return clearSelectedMutation.error as Error | null },
    },
  }

  const value: CartContextValue = {
    cart: currentCart,
    cartId,
    items,
    selectedItems,
    count,
    subtotal,
    selectedSubtotal,
    isEmpty,
    isLoading: () => cartResource.loading,
    isPending,
    error,
    addItem: (input: AddToCartInput) => addItemMutation.mutateAsync(input).then(() => undefined) as Promise<undefined>,
    remove: (opts) => {
      const id = opts.itemId ?? (opts.productId ? items.find(i => i.productId === opts.productId)?.id : undefined)
      if (!id) return Promise.resolve(undefined)
      return removeItemMutation.mutateAsync(id).then(() => undefined) as Promise<undefined>
    },
    updateQuantity: (opts) => {
      const id = opts.itemId ?? (opts.productId ? items.find(i => i.productId === opts.productId)?.id : undefined)
      if (!id) return Promise.resolve(undefined)
      return updateQuantityMutation.mutateAsync({ itemId: id, quantity: opts.quantity }).then(() => undefined) as Promise<undefined>
    },
    toggleSelected,
    selectAll,
    deselectAll,
    clear: clearMutation.mutate,
    clearSelected: clearSelectedMutation.mutate,
    refetch,
    has,
    find,
    mutations,
  }

  return (
    <CartContext.Provider value={value}>
      {props.children}
    </CartContext.Provider>
  )
}


export { CartContext }
export type { CartContextValue, CartProviderProps }
