import { executeGQL } from "~/lib/graphql/server"
import { STORE_QUERY } from "~/lib/graphql/queries"
import type { Store } from "~/lib/generated/graphql"

export const storeApi = {
  get: async (): Promise<Store> => {
    const data = await executeGQL<{ store: Store }>(STORE_QUERY)
    return data.store
  },
}
