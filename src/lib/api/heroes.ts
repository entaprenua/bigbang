import { executeGQL } from "~/lib/graphql/server"
import { HERO_QUERY } from "~/lib/graphql/queries"
import type { Hero } from "../types"

export const heroApi = {
  get: async (): Promise<Hero | null> => {
    try {
      const data = await executeGQL<{ hero: Hero | null }>(HERO_QUERY)
      return data.hero ?? null
    } catch {
      return null
    }
  },
}
