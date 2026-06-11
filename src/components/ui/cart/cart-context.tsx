import { createContext, Suspense, useContext, type JSX, type Accessor, createMemo, createSignal, createEffect } from "solid-js"
import { createQuery, createMutation, useQueryClient } from "@tanstack/solid-query"
import { cartsApi, type Cart, type CartItem } from "~/lib/api/carts"

export type CartItemContextData = {
  id: string
  productId: string
  quantity: number
  price: number
  name: string
  image?: string
  selected: boolean
  subtotal: number
}

export type AddToCartInput = {
  productId: string
  name?: string
  price: number
  image?: string
  quantity?: number
}

export type CartMutationState = {
  isPending: boolean
  isError: boolean
  error: Error | null
}

type CartContextValue = {
  cart: Accessor<Cart | null>
  cartId: Accessor<string | null>
  items: Accessor<CartItemContextData[]>
  selectedItems: Accessor<CartItemContextData[]>
  count: Accessor<number>
  subtotal: Accessor<number>
  selectedSubtotal: Accessor<number>
  isEmpty: Accessor<boolean>
  isLoading: Accessor<boolean>
  isPending: Accessor<boolean>
  error: Accessor<Error | null>
  addItem: (item: AddToCartInput) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  toggleSelected: (productId: string) => void
  selectAll: () => void
  deselectAll: () => void
  clear: () => void
  clearSelected: () => void
  refetch: () => void
  hasProduct: (productId: string) => boolean
  findByProductId: (productId: string) => CartItemContextData | undefined
  mutations: {
    addItem: CartMutationState
    removeItem: CartMutationState
    updateQuantity: CartMutationState
    clearCart: CartMutationState
    clearSelected: CartMutationState
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
  const price = typeof item.price === "string" ? parseFloat(item.price) : (item.price ?? 0)
  const sub = typeof item.subtotal === "string" ? parseFloat(item.subtotal) : (item.subtotal ?? 0)
  return {
    id: item.id ?? item.productId,
    productId: item.productId,
    quantity: item.quantity,
    price,
    name: (item as any).name ?? "",
    image: (item as any).image ?? undefined,
    selected: item.selected ?? true,
    subtotal: sub,
  }
}

type CartProviderProps = {
  children?: JSX.Element
  loadingFallback?: JSX.Element
  errorFallback?: (error: Error) => JSX.Element
}

export const CartProvider = (props: CartProviderProps) => {
  const queryClient = useQueryClient()

  const [cart, setCart] = createSignal<Cart | null>(null)
  const [error, setError] = createSignal<Error | null>(null)
  const [optimisticCart, setOptimisticCart] = createSignal<Cart | null>(null)

  const cartId = (): string | null => (optimisticCart() ?? cart())?.id ?? null

  const fetchCart = async (): Promise<Cart | null> => {
    const fetchedCart = await cartsApi.get()
    return fetchedCart
  }

  const cartQuery = createQuery(() => ({
    queryKey: ["cart"],
    queryFn: fetchCart,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  }))

  createEffect(() => {
    if (!cartQuery.isError && !cartQuery.isLoading) {
      if (cartQuery.data) {
        setCart(cartQuery.data)
      }
    }
  })

  createEffect(() => {
    if (cartQuery.isError) {
      setError(cartQuery.error as Error)
    }
  })

  const currentCart = () => optimisticCart() ?? cart()

  const items = createMemo((): CartItemContextData[] => {
    const c = currentCart()
    if (!c?.items) return []
    return c.items.map(cartItemToContext)
  })

  const count = createMemo(() => items().length)

  const subtotal = createMemo(() => {
    return items().reduce((sum, item) => sum + (item.price * item.quantity), 0)
  })

  const selectedItems = createMemo(() => items().filter((item) => item.selected))

  const selectedSubtotal = createMemo(() => {
    return selectedItems().reduce((sum, item) => sum + (item.price * item.quantity), 0)
  })

  const isEmpty = createMemo(() => items().length === 0)

  const createOptimisticCart = (updates: Partial<Cart>): Cart | null => {
    const current = currentCart()
    if (!current) return null
    return { ...current, ...updates, items: updates.items ?? current.items }
  }

  const addItemMutation = createMutation(() => ({
    mutationFn: async (input: AddToCartInput) => {
      return await cartsApi.addItem({
        productId: input.productId,
        quantity: input.quantity ?? 1,
      })
    },
    onMutate: async (input: AddToCartInput) => {
      const existingItem = items().find(item => item.productId === input.productId)
      const quantity = input.quantity ?? 1

      const optimisticItems = existingItem
        ? items().map(item =>
          item.productId === input.productId
            ? { ...item, quantity: item.quantity + quantity, subtotal: item.price * (item.quantity + quantity) }
            : item
        )
        : [
          ...items(),
          {
            id: crypto.randomUUID?.() ?? `temp-${Date.now()}`,
            productId: input.productId,
            quantity,
            price: input.price,
            name: input.name ?? "",
            image: input.image,
            selected: true,
            subtotal: input.price * quantity,
          }
        ]

      setOptimisticCart(createOptimisticCart({ items: optimisticItems as unknown as CartItem[] }))
      return { items: items() }
    },
    onError: (err, input, context) => {
      setOptimisticCart(null)
      setError(err as Error)
      if (context?.items) {
        setCart(createOptimisticCart({ items: context.items as unknown as CartItem[] }))
      }
    },
    onSuccess: () => {
      setOptimisticCart(null)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] })
    },
  }))

  const removeItemMutation = createMutation(() => ({
    mutationFn: async (variantId: string) => {
      await cartsApi.removeItem(variantId)
    },
    onMutate: async (variantId: string) => {
      const snapshot = items()
      const optimisticItems = items().filter(item => item.productId !== variantId)
      setOptimisticCart(createOptimisticCart({ items: optimisticItems as unknown as CartItem[] }))
      return { snapshot }
    },
    onError: (err, variantId, context) => {
      setOptimisticCart(null)
      setError(err as Error)
      if (context?.snapshot) {
        setCart(createOptimisticCart({ items: context.snapshot as unknown as CartItem[] }))
      }
    },
    onSuccess: () => {
      setOptimisticCart(null)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] })
    },
  }))

  const updateQuantityMutation = createMutation(() => ({
    mutationFn: async ({ productId, quantity }: { productId: string; quantity: number }) => {
      if (quantity <= 0) {
        await cartsApi.removeItem(productId)
      } else {
        await cartsApi.updateItem(productId, { quantity })
      }
    },
    onMutate: async ({ productId, quantity }: { productId: string; quantity: number }) => {
      const snapshot = items()
      let optimisticItems: CartItemContextData[]

      if (quantity <= 0) {
        optimisticItems = items().filter(item => item.productId !== productId)
      } else {
        optimisticItems = items().map(item =>
          item.productId === productId
            ? { ...item, quantity, subtotal: item.price * quantity }
            : item
        )
      }

      setOptimisticCart(createOptimisticCart({ items: optimisticItems as unknown as CartItem[] }))
      return { snapshot }
    },
    onError: (err, variables, context) => {
      setOptimisticCart(null)
      setError(err as Error)
      if (context?.snapshot) {
        setCart(createOptimisticCart({ items: context.snapshot as unknown as CartItem[] }))
      }
    },
    onSuccess: () => {
      setOptimisticCart(null)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] })
    },
  }))

  const clearMutation = createMutation(() => ({
    mutationFn: async () => {
      await cartsApi.delete()
    },
    onMutate: async () => {
      const snapshot = currentCart()
      setOptimisticCart(createOptimisticCart({ items: [] }))
      return { snapshot }
    },
    onError: (err, _, context) => {
      setOptimisticCart(null)
      setError(err as Error)
      if (context?.snapshot) {
        setCart(context.snapshot)
      }
    },
    onSuccess: () => {
      setOptimisticCart(null)
      setCart(null)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] })
    },
  }))

  const clearSelectedMutation = createMutation(() => ({
    mutationFn: async () => {
      await cartsApi.clearSelectedItems()
    },
    onMutate: async () => {
      const snapshot = items()
      const nonSelectedItems = items().filter(item => !item.selected)
      setOptimisticCart(createOptimisticCart({ items: nonSelectedItems as unknown as CartItem[] }))
      return { snapshot }
    },
    onError: (err, _, context) => {
      setOptimisticCart(null)
      setError(err as Error)
      if (context?.snapshot) {
        setCart(createOptimisticCart({ items: context.snapshot as unknown as CartItem[] }))
      }
    },
    onSuccess: () => {
      setOptimisticCart(null)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] })
    },
  }))

  const toggleSelectedMutation = createMutation(() => ({
    mutationFn: async (variantId: string) => {
      const item = items().find(i => i.productId === variantId)
      if (!item) throw new Error("Item not found")

      await cartsApi.updateItem(variantId, {
        selected: item.selected,
      })
    },
    onError: (err) => {
      setOptimisticCart(null)
      setError(err as Error)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] })
    },
  }))

  const toggleSelected = (productId: string) => {
    // Immediate optimistic update (like before)
    const current = currentCart()
    if (!current?.items) return

    const item = items().find(i => i.productId === productId)
    if (!item) return

    setOptimisticCart({
      ...current,
      items: current.items.map(i =>
        i.productId === productId ? { ...i, selected: !item.selected } : i
      ),
    })

    // Background server sync
    toggleSelectedMutation.mutate(productId)
  }

  const selectAllMutation = createMutation(() => ({
    mutationFn: async () => {
      for (const item of items()) {
        if (!item.selected) {
          await cartsApi.updateItem(item.productId, { selected: true })
        }
      }
    },
    onMutate: async () => {
      setOptimisticCart({
        ...currentCart()!,
        items: items().map(item => ({ ...item, selected: true })) as unknown as CartItem[],
      })
    },
    onError: (err) => {
      setOptimisticCart(null)
      setError(err as Error)
    },
    onSettled: () => {
      setOptimisticCart(null)
      queryClient.invalidateQueries({ queryKey: ["cart"] })
    },
  }))

  const selectAll = () => {
    selectAllMutation.mutate()
  }

  const deselectAllMutation = createMutation(() => ({
    mutationFn: async () => {
      for (const item of items()) {
        if (item.selected) {
          await cartsApi.updateItem(item.productId, { selected: false })
        }
      }
    },
    onMutate: async () => {
      setOptimisticCart({
        ...currentCart()!,
        items: items().map(item => ({ ...item, selected: false })) as unknown as CartItem[],
      })
    },
    onError: (err) => {
      setOptimisticCart(null)
      setError(err as Error)
    },
    onSettled: () => {
      setOptimisticCart(null)
      queryClient.invalidateQueries({ queryKey: ["cart"] })
    },
  }))

  const deselectAll = () => {
    deselectAllMutation.mutate()
  }

  const refetch = () => {
    queryClient.invalidateQueries({ queryKey: ["cart"] })
  }

  const hasProduct = (productId: string) => {
    return items().some((item) => item.productId === productId)
  }

  const findByProductId = (productId: string) => {
    return items().find((item) => item.productId === productId)
  }

  const isPending = createMemo(() => {
    return (
      addItemMutation.isPending ||
      removeItemMutation.isPending ||
      updateQuantityMutation.isPending ||
      clearMutation.isPending ||
      clearSelectedMutation.isPending ||
      toggleSelectedMutation.isPending ||
      selectAllMutation.isPending ||
      deselectAllMutation.isPending
    )
  })

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
    isLoading: () => cartQuery.isLoading,
    isPending,
    error,
    addItem: addItemMutation.mutate,
    removeItem: removeItemMutation.mutate,
    updateQuantity: (productId: string, quantity: number) =>
      updateQuantityMutation.mutate({ productId, quantity }),
    toggleSelected,
    selectAll,
    deselectAll,
    clear: clearMutation.mutate,
    clearSelected: clearSelectedMutation.mutate,
    refetch,
    hasProduct,
    findByProductId,
    mutations,
  }

  return (
    <CartContext.Provider value={value}>
      <Suspense>
        {props.children}
      </Suspense>
    </CartContext.Provider>
  )
}


export { CartContext }
export type { CartContextValue, CartProviderProps }
