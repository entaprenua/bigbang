import { gqlClient } from "~/lib/graphql/client"
import { STORE_QUERY } from "~/lib/graphql/queries"
import type { Store } from "~/lib/generated/graphql"

export const storeApi = {
  get: async (): Promise<Store> => {
    const data = await gqlClient.request<{ store: Store }>(STORE_QUERY)
    return data.store
  },
}
