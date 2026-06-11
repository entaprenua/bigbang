import { gqlClient } from "../graphql/client"
import { PRODUCT_BY_SLUG, PRODUCT_BY_ID, PRODUCTS_QUERY, PRODUCT_FILTER_OPTIONS_QUERY, PRODUCT_SUGGESTIONS_QUERY } from "../graphql/queries"
import type { Product, ProductConnection } from "../types"

export type FilterOptionsData = {
  productFilterOptions: {
    brands: string[]
    vendors: string[]
    productTypes: string[]
  }
}

export interface ProductFilters {
  search?: string
  categoryId?: string
  brand?: string
  vendor?: string
  productType?: string
  minPrice?: number
  maxPrice?: number
  minRating?: number
  sortBy?: "name" | "price" | "createdAt"
  sortOrder?: "asc" | "desc"
  brands?: string[]
  vendors?: string[]
  productTypes?: string[]
}

export const productsApi = {
  getFilterOptions: async (fields: string[]): Promise<FilterOptionsData> => {
    return gqlClient.request<FilterOptionsData>(PRODUCT_FILTER_OPTIONS_QUERY, { fields })
  },

  suggestions: async (query: string, limit: number = 10): Promise<string[]> => {
    const data = await gqlClient.request<{ productSuggestions: string[] }>(
      PRODUCT_SUGGESTIONS_QUERY,
      { query, limit }
    )
    return data.productSuggestions
  },

  getBySlug: async (slug: string): Promise<Product | null> => {
    const data = await gqlClient.request<{ product: Product | null }>(
      PRODUCT_BY_SLUG,
      { slug }
    )
    return data.product
  },

  getById: async (id: string): Promise<Product | null> => {
    const data = await gqlClient.request<{ product: Product | null }>(
      PRODUCT_BY_ID,
      { id }
    )
    return data.product
  },

  getAll: async (
    after?: string,
    before?: string,
    size: number = 20,
    filters?: ProductFilters
  ): Promise<ProductConnection> => {
    const data = await gqlClient.request<{ products: ProductConnection }>(
      PRODUCTS_QUERY,
      {
        after, before, size,
        filters: filters
          ? {
              search: filters.search,
              categoryId: filters.categoryId,
              brand: filters.brand,
              vendor: filters.vendor,
              productType: filters.productType,
              minPrice: filters.minPrice != null ? String(filters.minPrice) : undefined,
              maxPrice: filters.maxPrice != null ? String(filters.maxPrice) : undefined,
              minRating: filters.minRating != null ? String(filters.minRating) : undefined,
              sortBy: filters.sortBy,
              sortOrder: filters.sortOrder,
              brands: filters.brands,
              vendors: filters.vendors,
              productTypes: filters.productTypes,
            }
          : undefined,
      }
    )
    return data.products
  },
}
