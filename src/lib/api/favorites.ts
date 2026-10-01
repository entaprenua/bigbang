import { executeGQL } from "~/lib/graphql/server"
import { ADD_FAVORITE_MUTATION, REMOVE_FAVORITE_MUTATION, FAVORITE_PRODUCT_IDS_QUERY } from "~/lib/graphql/queries"

export const favoritesApi = {
  addFavorite: async (productId: string): Promise<boolean> => {
    const data = await executeGQL<{ addFavorite: boolean }>(ADD_FAVORITE_MUTATION, { productId })
    return data.addFavorite
  },

  removeFavorite: async (productId: string): Promise<boolean> => {
    const data = await executeGQL<{ removeFavorite: boolean }>(REMOVE_FAVORITE_MUTATION, { productId })
    return data.removeFavorite
  },

  favoriteIds: async (): Promise<string[]> => {
    const data = await executeGQL<{ favoriteProductIds: string[] }>(FAVORITE_PRODUCT_IDS_QUERY)
    return data.favoriteProductIds ?? []
  },
}
