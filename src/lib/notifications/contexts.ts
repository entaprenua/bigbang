import { executeGQL } from "~/lib/graphql/server"
import { ORDER_QUERY, STORE_QUERY, CART_QUERY } from "~/lib/graphql/queries"
import type { OrderEventContext, CartAbandonedContext } from "./defaults"

interface OrderResult {
  id: string
  customerId?: string | null
  orderNumber: string
  status?: string | null
  total?: string | null
  subtotal?: string | null
  currency?: string | null
  email?: string | null
  name?: string | null
  trackingNumber?: string | null
  items?: Array<{
    productName?: string | null
    quantity: number
    price?: string | null
  }> | null
}

interface CartResult {
  id: string
  total: string
  email?: string | null
  cartToken: string
  items?: Array<{
    quantity: number
    price: string
    product?: {
      name: string
      image?: string | null
    } | null
  }> | null
}

export async function buildOrderContext(orderId: string): Promise<OrderEventContext> {
  const [orderResult, storeResult] = await Promise.all([
    executeGQL<{ order: OrderResult }>(ORDER_QUERY, { id: orderId }),
    executeGQL<{ store: { name: string } }>(STORE_QUERY),
  ])

  const order = orderResult.order
  const storeName = storeResult.store?.name ?? "Store"

  return {
    customer: {
      id: order?.customerId ?? undefined,
      name: order?.name ?? "Customer",
      email: order?.email ?? "",
    },
    order: {
      orderNumber: order?.orderNumber ?? orderId,
      total: order?.total ?? "0.00",
      subtotal: order?.subtotal ?? "0.00",
      currency: order?.currency ?? "USD",
      status: order?.status ?? "pending",
      trackingNumber: order?.trackingNumber ?? undefined,
    },
    items: (order?.items ?? []).map((item) => ({
      productName: item.productName ?? "Item",
      quantity: item.quantity,
      price: item.price ?? "0.00",
    })),
    store: { name: storeName },
  }
}

export async function cartContextBuilder(cartId: string): Promise<CartAbandonedContext> {
  const [cartResult, storeResult] = await Promise.all([
    executeGQL<{ cart: CartResult }>(CART_QUERY, { cartId }),
    executeGQL<{ store: { name: string; domainName?: string } }>(STORE_QUERY),
  ])

  const cart = cartResult.cart
  const store = storeResult.store

  const cartItems = (cart?.items ?? [])
    .filter((i) => i.product)
    .map((i) => ({
      productName: i.product!.name,
      image: i.product!.image ?? undefined,
      price: i.price,
      quantity: i.quantity,
    }))

  const recoveryUrl = store?.domainName
    ? `https://${store.domainName}/cart?token=${cart?.cartToken}`
    : `/cart?token=${cart?.cartToken}`

  return {
    customer: {
      name: "Valued Customer",
      email: cart?.email ?? "",
    },
    cart: {
      total: cart?.total ?? "0.00",
      itemCount: cartItems.length,
      recoveryUrl,
    },
    cartItems,
    store: { name: store?.name ?? "Store" },
  }
}
