import { createContext, useContext, type Accessor, type JSX, createSignal, createMemo, createEffect } from "solid-js"
import { wishlistsApi } from "~/lib/api/wishlists"
import { useAuth } from "~/components/ui/auth/auth-provider"
import type { WishlistItem, Wishlist } from "~/lib/types"

export type WishlistItemContextData = {
  id: string
  productId: string
}

type WishlistContextValue = {
  wishlist: Accessor<Wishlist | null>
  items: Accessor<WishlistItemContextData[]>
  count: Accessor<number>
  isEmpty: Accessor<boolean>
  isLoading: Accessor<boolean>
  isPending: Accessor<boolean>
  error: Accessor<Error | null>
  addItem: (productId: string) => Promise<void>
  removeItem: (productId: string) => Promise<void>
  clear: () => Promise<void>
  refetch: () => Promise<void>
  hasProduct: (productId: string) => boolean
}

const WishlistContext = createContext<WishlistContextValue>()

export const useWishlist = (): WishlistContextValue => {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider")
  return ctx
}

const wishlistItemToContext = (item: WishlistItem): WishlistItemContextData => ({
  id: item.id,
  productId: item.productId,
})

type WishlistProviderProps = {
  children?: JSX.Element
  loadingFallback?: any
  initialWishlist?: Wishlist
}

export const WishlistProvider = (props: WishlistProviderProps) => {
  const auth = useAuth()

  const [wishlist, setWishlist] = createSignal<Wishlist | null>(props.initialWishlist ?? null)
  const [isLoading, setIsLoading] = createSignal(!props.initialWishlist)
  const [isPending, setIsPending] = createSignal(false)
  const [error, setError] = createSignal<Error | null>(null)

  const loadWishlist = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const fetchedWishlist = await wishlistsApi.get()
      setWishlist(fetchedWishlist)
    } catch (e) {
      setError(e as Error)
    } finally {
      setIsLoading(false)
    }
  }

  createEffect(() => {
    if (!props.initialWishlist) {
      loadWishlist()
    }
  })

  const items = createMemo((): WishlistItemContextData[] => {
    const w = wishlist()
    if (!w?.items) return []
    return w.items.map(wishlistItemToContext)
  })

  const count = createMemo(() => items().length)
  const isEmpty = createMemo(() => items().length === 0)

  const addItem = async (productId: string) => {
    if (items().some(item => item.productId === productId)) return

    setIsPending(true)
    setError(null)

    try {
      await wishlistsApi.addItem(productId)
      await loadWishlist()
    } catch (e) {
      setError(e as Error)
      throw e
    } finally {
      setIsPending(false)
    }
  }

  // TODO/FIXME: removeItem deletes the entire wishlist via removeFromWishlist(wishlistId).
  // Should rewrite wishlist via addToWishlist with all items except the one being removed instead.
  const removeItem = async (productId: string) => {
    const currentWishlist = wishlist()
    if (!currentWishlist) return

    setIsPending(true)
    setError(null)

    try {
      await wishlistsApi.removeItem(currentWishlist.id)
      await loadWishlist()
    } catch (e) {
      setError(e as Error)
      throw e
    } finally {
      setIsPending(false)
    }
  }

  const clear = async () => {
    const currentWishlist = wishlist()
    if (!currentWishlist) return

    setIsPending(true)
    setError(null)

    try {
      for (const item of items()) {
        await wishlistsApi.removeItem(currentWishlist.id)
      }
      await loadWishlist()
    } catch (e) {
      setError(e as Error)
      throw e
    } finally {
      setIsPending(false)
    }
  }

  const refetch = async () => {
    await loadWishlist()
  }

  const hasProduct = (productId: string) => {
    return items().some(item => item.productId === productId)
  }

  const value: WishlistContextValue = {
    wishlist,
    items,
    count,
    isEmpty,
    isLoading,
    isPending,
    error,
    addItem,
    removeItem,
    clear,
    refetch,
    hasProduct,
  }

  return (
    <WishlistContext.Provider value={value}>
      {props.children}
    </WishlistContext.Provider>
  )
}

export { WishlistContext }
export type { WishlistContextValue, WishlistProviderProps }
