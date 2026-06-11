import { gqlClient } from "~/lib/graphql/client"
import { CATEGORIES_QUERY, CATEGORY_QUERY } from "~/lib/graphql/queries"
import type { Category } from "../types"

export interface CategoryFilters {
  search?: string
  parentId?: string
}

export const categoriesApi = {
  getAll: async (filters?: CategoryFilters): Promise<Category[]> => {
    const vars: Record<string, unknown> = {}
    if (filters?.parentId) vars.filters = { parentId: filters.parentId }
    const data = await gqlClient.request<{ categories: Category[] }>(CATEGORIES_QUERY, vars)
    return data.categories ?? []
  },

  getRoot: async (): Promise<Category[]> => {
    const data = await gqlClient.request<{ categories: Category[] }>(CATEGORIES_QUERY, {
      filters: { root: true },
    })
    return data.categories ?? []
  },

  getTree: async (): Promise<Category[]> => {
    const data = await gqlClient.request<{ categories: Category[] }>(CATEGORIES_QUERY, {
      filters: { tree: true },
    })
    return data.categories ?? []
  },

  getByParent: async (parentId: string): Promise<Category[]> => {
    const data = await gqlClient.request<{ categories: Category[] }>(CATEGORIES_QUERY, {
      filters: { parentId },
    })
    return data.categories ?? []
  },

  getById: async (id: string): Promise<Category | null> => {
    const data = await gqlClient.request<{ category: Category | null }>(CATEGORY_QUERY, { id })
    return data.category ?? null
  },

  getBySlug: async (slug: string): Promise<Category | null> => {
    const data = await gqlClient.request<{ category: Category | null }>(CATEGORY_QUERY, { slug })
    return data.category ?? null
  },
}
