import { gqlClient } from "~/lib/graphql/client"
import { WISHLIST_QUERY, ADD_TO_WISHLIST_MUTATION, REMOVE_FROM_WISHLIST_MUTATION } from "~/lib/graphql/queries"
import type { Wishlist } from "../types"

export const wishlistsApi = {
  get: async (): Promise<Wishlist | null> => {
    const data = await gqlClient.request<{ wishlist: Wishlist | null }>(WISHLIST_QUERY)
    return data.wishlist ?? null
  },

  addItem: async (productId: string): Promise<boolean> => {
    const data = await gqlClient.request<{ addToWishlist: boolean }>(ADD_TO_WISHLIST_MUTATION, {
      input: { items: [{ productId }] },
    })
    return data.addToWishlist
  },

  removeItem: async (wishlistId: string): Promise<boolean> => {
    const data = await gqlClient.request<{ removeFromWishlist: boolean }>(REMOVE_FROM_WISHLIST_MUTATION, {
      wishlistId,
    })
    return data.removeFromWishlist
  },
}
