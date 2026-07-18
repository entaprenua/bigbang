import { executeGQL } from "~/lib/graphql/server"
import {
  CART_QUERY,
  CART_ITEM_MUTATION,
  REMOVE_CART_ITEM_MUTATION,
  CLEAR_CART_MUTATION,
  CLEAR_SELECTED_CART_ITEMS_MUTATION,
} from "~/lib/graphql/queries"
import type { Cart, CartItem } from "../types"

export interface AddToCartInput {
  productId: string;
  quantity: number;
  selected?: boolean;
}

export interface UpdateCartItemInput {
  quantity?: number;
  selected?: boolean;
}

interface CartQueryResult {
  cart: Cart | null
}

async function refetchCart(): Promise<Cart> {
  const data = await executeGQL<CartQueryResult>(CART_QUERY)
  if (!data.cart) throw new Error("Cart not found")
  return data.cart
}

export const cartsApi = {
  get: async (): Promise<Cart | null> => {
    const data = await executeGQL<CartQueryResult>(CART_QUERY)
    return data.cart ?? null
  },

  create: async (): Promise<Cart> => {
    const data = await executeGQL<CartQueryResult>(CART_QUERY)
    return data.cart ?? (await refetchCart())
  },

  save: async (): Promise<Cart> => {
    return refetchCart()
  },

  delete: async (): Promise<void> => {
    await executeGQL(CLEAR_CART_MUTATION)
  },

  addItem: async (input: AddToCartInput): Promise<CartItem> => {
    const vars: Record<string, unknown> = { productId: input.productId, quantity: input.quantity ?? 1, selected: input.selected ?? true }
    const data = await executeGQL<{ cartItem: CartItem }>(CART_ITEM_MUTATION, vars)
    return data.cartItem
  },

  updateItem: async (
    itemId: string,
    input: UpdateCartItemInput,
  ): Promise<CartItem> => {
    const vars: Record<string, unknown> = { itemId }
    if (input.quantity !== undefined) vars.quantity = input.quantity
    if (input.selected !== undefined) vars.selected = input.selected
    const data = await executeGQL<{ cartItem: CartItem }>(CART_ITEM_MUTATION, vars)
    return data.cartItem
  },

  removeItem: async (itemId: string): Promise<void> => {
    await executeGQL(REMOVE_CART_ITEM_MUTATION, { itemId })
  },

  clearSelectedItems: async (): Promise<{ deleted: number }> => {
    await executeGQL(CLEAR_SELECTED_CART_ITEMS_MUTATION)
    return { deleted: 0 }
  },
}

export type { Cart, CartItem }
