import { executeGQL } from "~/lib/graphql/server"
import { BANNERS_QUERY, HERO_QUERY } from "~/lib/graphql/queries"
import type { Banner } from "../types"

export const bannersApi = {
  getAll: async (): Promise<Banner[]> => {
    const data = await executeGQL<{ activeBanners: Banner[] }>(BANNERS_QUERY)
    return data.activeBanners ?? []
  },

  /**
   * The hero is the first root banner in positional order, so this asks for one
   * row from the start of the list. Returns null when the store has no banners.
   */
  getHero: async (): Promise<Banner | null> => {
    const data = await executeGQL<{ banners: Banner[] }>(HERO_QUERY, {
      fromOrder: 0,
      pageSize: 1,
    })
    return data.banners?.[0] ?? null
  },
}
