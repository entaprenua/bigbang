import { gqlClient } from "~/lib/graphql/client"
import {
  REVIEWS_BY_PRODUCT_QUERY, REVIEW_STATS_QUERY,
  CREATE_REVIEW_MUTATION, UPDATE_REVIEW_MUTATION, DELETE_REVIEW_MUTATION,
} from "~/lib/graphql/queries"
import type { Review, ReviewStats, ReviewConnection, CreateReviewInput, UpdateReviewInput } from "~/lib/generated/graphql"

interface ProductWithReviews {
  product: { reviews: ReviewConnection } | null
}

interface ProductWithReviewStats {
  product: { reviewStats: ReviewStats } | null
}

export const reviewsApi = {
  getByProduct: async (
    productId: string,
    page = 0,
    size = 20,
    sortBy?: string,
  ): Promise<ReviewConnection> => {
    const data = await gqlClient.request<ProductWithReviews>(REVIEWS_BY_PRODUCT_QUERY, {
      productId, page, size, sortBy,
    })
    return data.product?.reviews ?? { edges: [], pageInfo: { hasNextPage: false, hasPreviousPage: false, endCursor: null, startCursor: null }, totalCount: 0 }
  },

  getStats: async (productId: string): Promise<ReviewStats | null> => {
    const data = await gqlClient.request<ProductWithReviewStats>(REVIEW_STATS_QUERY, { productId })
    return data.product?.reviewStats ?? null
  },

  create: async (input: CreateReviewInput): Promise<Review> => {
    const data = await gqlClient.request<{ createReview: Review }>(CREATE_REVIEW_MUTATION, { input })
    return data.createReview
  },

  update: async (input: UpdateReviewInput): Promise<Review> => {
    const data = await gqlClient.request<{ updateReview: Review }>(UPDATE_REVIEW_MUTATION, { input })
    return data.updateReview
  },

  delete: async (productId: string, reviewId: string): Promise<boolean> => {
    const data = await gqlClient.request<{ deleteReview: boolean }>(DELETE_REVIEW_MUTATION, { productId, reviewId })
    return data.deleteReview
  },
}
