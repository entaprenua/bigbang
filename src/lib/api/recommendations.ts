import { executeGQL } from "~/lib/graphql/client"
import { RECOMMENDATIONS_QUERY, TRACK_PRODUCT_VIEW_MUTATION, ADD_FAVORITE_MUTATION, REMOVE_FAVORITE_MUTATION } from "~/lib/graphql/queries"
import type { Product } from "~/lib/types"

export type RecommendationType =
  | "personalized"
  | "popular"
  | "newest"
  | "related"
  | "bought_together"
  | "recently_viewed"
  | "favorites"
  | "top_rated"

export type RecommendationSource =
  | "personalized"
  | "popular"
  | "related"
  | "bought_together"
  | "newest"
  | "recently_viewed"
  | "favorites"
  | "top_rated"

export type RecommendationResponse = {
  products: Product[]
  source: RecommendationSource
  fallback: RecommendationSource | null
}

export const recommendationsApi = {
  get: async (
    type: RecommendationType = "personalized",
    limit: number = 10,
  ): Promise<RecommendationResponse> => {
    const data = await executeGQL<{ recommendations: RecommendationResponse }>(RECOMMENDATIONS_QUERY, {
      input: { type, limit },
    })
    return data.recommendations
  },

  trackView: async (productId: string): Promise<boolean> => {
    const data = await executeGQL<{ trackProductView: boolean }>(TRACK_PRODUCT_VIEW_MUTATION, { productId })
    return data.trackProductView
  },

  addFavorite: async (productId: string): Promise<boolean> => {
    const data = await executeGQL<{ addFavorite: boolean }>(ADD_FAVORITE_MUTATION, { productId })
    return data.addFavorite
  },

  removeFavorite: async (productId: string): Promise<boolean> => {
    const data = await executeGQL<{ removeFavorite: boolean }>(REMOVE_FAVORITE_MUTATION, { productId })
    return data.removeFavorite
  },
}
