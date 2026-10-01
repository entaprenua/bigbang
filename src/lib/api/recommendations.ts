import { executeGQL } from "~/lib/graphql/server"
import { RECOMMENDATIONS_QUERY, TRACK_PRODUCT_VIEW_MUTATION } from "~/lib/graphql/queries"
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
  | "cart_based"

export type RecommendationSource = RecommendationType

export type RecommendationResponse = {
  products: Product[]
  source: RecommendationSource
  fallback: RecommendationSource | null
}

type RecommendationOptions = {
  productId?: string
  cartProductIds?: string[]
  categoryId?: string
}

export const recommendationsApi = {
  get: async (
    type: RecommendationType = "personalized",
    limit: number = 10,
    options?: RecommendationOptions,
  ): Promise<RecommendationResponse> => {
    const data = await executeGQL<{ recommendations: RecommendationResponse }>(RECOMMENDATIONS_QUERY, {
      input: { type, limit, ...options },
    })
    return data.recommendations
  },

  trackView: async (productId: string): Promise<boolean> => {
    const data = await executeGQL<{ trackProductView: boolean }>(TRACK_PRODUCT_VIEW_MUTATION, { productId })
    return data.trackProductView
  },
}
