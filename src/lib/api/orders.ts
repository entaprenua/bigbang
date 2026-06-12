import { executeGQL } from "~/lib/graphql/client"
import { ORDER_QUERY, ORDER_LOOKUP_QUERY } from "~/lib/graphql/queries"
import type { Order } from "../types"

interface OrderLookupResult {
  orderLookup: {
    found: boolean
    order: Order | null
  }
}

export const ordersApi = {
  getById: async (orderId: string): Promise<Order | null> => {
    const data = await executeGQL<{ order: Order | null }>(ORDER_QUERY, { id: orderId })
    return data.order ?? null
  },

  lookup: async (storeId: string, orderNumber: string, email: string): Promise<{ found: boolean; order: Order | null }> => {
    const data = await executeGQL<OrderLookupResult>(ORDER_LOOKUP_QUERY, { storeId, orderNumber, email })
    return data.orderLookup
  },
}
