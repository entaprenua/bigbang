import { gqlClient } from "~/lib/graphql/client"
import { HERO_QUERY } from "~/lib/graphql/queries"
import type { Hero } from "../types"

export const heroApi = {
  get: async (): Promise<Hero | null> => {
    try {
      const data = await gqlClient.request<{ hero: Hero | null }>(HERO_QUERY)
      return data.hero ?? null
    } catch {
      return null
    }
  },
}
