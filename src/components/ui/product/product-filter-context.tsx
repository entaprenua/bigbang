import {
  createContext,
  useContext,
  createMemo,
  createEffect,
  createSignal,
  onMount,
  type JSX,
} from "solid-js"
import { createStore, produce } from "solid-js/store"
import { useSearchParams } from "@solidjs/router"
import { productsApi, type FilterOptionsData, type ProductFilters } from "~/lib/api/products"

type ProductFilterContextValue = {
  filters: () => ProductFilters
  setFilter: <K extends keyof ProductFilters>(key: K, value: ProductFilters[K]) => void
  removeFilter: (key: keyof ProductFilters) => void
  toggleFilter: (key: ArrayFilterKey, value: string) => void
  hasFilter: (key: ArrayFilterKey, value: string) => boolean
  clearAll: () => void
  hasActiveFilters: () => boolean
}

type ArrayFilterKey = "brands" | "vendors" | "productTypes"

const ARRAY_KEYS: ArrayFilterKey[] = ["brands", "vendors", "productTypes"]

const ProductFilterContext = createContext<ProductFilterContextValue | undefined>()

const useProductFilters = () => {
  const ctx = useContext(ProductFilterContext)
  if (!ctx)
    throw new Error("useProductFilters must be used within ProductFilterProvider")
  return ctx
}

const useProductFilterOptional = () => useContext(ProductFilterContext)

const FILTER_URL_MAP: Record<string, keyof ProductFilters> = {
  search: "search",
  categoryId: "categoryId",
  brand: "brand",
  vendor: "vendor",
  productType: "productType",
  minPrice: "minPrice",
  maxPrice: "maxPrice",
  minRating: "minRating",
  sortBy: "sortBy",
  sortOrder: "sortOrder",
  brands: "brands",
  vendors: "vendors",
  productTypes: "productTypes",
}

function parseFiltersFromUrl(params: Record<string, string>): ProductFilters {
  const filters: ProductFilters = {}

  if (params.search) filters.search = params.search
  if (params.brand) filters.brand = params.brand
  if (params.vendor) filters.vendor = params.vendor
  if (params.productType) filters.productType = params.productType
  if (params.minPrice) filters.minPrice = Number(params.minPrice)
  if (params.maxPrice) filters.maxPrice = Number(params.maxPrice)
  if (params.minRating) filters.minRating = Number(params.minRating)
  if (params.sortBy) filters.sortBy = params.sortBy as ProductFilters["sortBy"]
  if (params.sortOrder) filters.sortOrder = params.sortOrder as ProductFilters["sortOrder"]
  if (params.brands) filters.brands = params.brands.split(",")
  if (params.vendors) filters.vendors = params.vendors.split(",")
  if (params.productTypes) filters.productTypes = params.productTypes.split(",")

  return filters
}

function filtersToUrlParams(filters: ProductFilters): Record<string, string> {
  const params: Record<string, string> = {}

  for (const [urlKey, filterKey] of Object.entries(FILTER_URL_MAP)) {
    const value = filters[filterKey]
    if (value === undefined || value === null) continue
    if (Array.isArray(value)) {
      if (value.length > 0) params[urlKey] = value.join(",")
    } else if (value !== "") {
      params[urlKey] = String(value)
    }
  }

  return params
}

const ProductFilterProvider = (props: { children?: JSX.Element }) => {
  const [searchParams, setSearchParams] = useSearchParams<Record<string, string>>()

  const [state, setState] = createStore<ProductFilters>(
    parseFiltersFromUrl(searchParams),
  )

  // Sync store → URL
  createEffect(() => {
    const params = filtersToUrlParams({ ...state })
    setSearchParams(params, { replace: true })
  })

  const filters = createMemo(() => ({ ...state }))

  const setFilter = <K extends keyof ProductFilters>(
    key: K,
    value: ProductFilters[K],
  ) => {
    setState(key, value as never)
  }

  const removeFilter = (key: keyof ProductFilters) => {
    setState(
      produce((s) => {
        delete s[key]
      }),
    )
  }

  const toggleFilter = (key: ArrayFilterKey, value: string) => {
    setState(
      produce((s) => {
        const current = (s as Record<string, string[] | undefined>)[key] ?? []
        const idx = current.indexOf(value)
        if (idx >= 0) {
          current.splice(idx, 1)
          if (current.length === 0) {
            delete (s as Record<string, unknown>)[key]
          }
        } else {
          ;(s as Record<string, string[]>)[key] = [...current, value]
        }
      }),
    )
  }

  const hasFilter = (key: ArrayFilterKey, value: string): boolean =>
    (state as Record<string, string[] | undefined>)[key]?.includes(value) ?? false
  

  const clearAll = () => {
    const empty: ProductFilters = {}
    setState(
      produce((s) => {
        for (const k of Object.keys(s)) delete s[k as keyof ProductFilters]
      }),
    )
  }

  const hasActiveFilters = createMemo(() => {
    const f = filters()
    return Object.keys(f).length > 0
  })

  return (
    <ProductFilterContext.Provider
      value={{ filters, setFilter, removeFilter, toggleFilter, hasFilter, clearAll, hasActiveFilters }}
    >
      {props.children}
    </ProductFilterContext.Provider>
  )
}

export { ProductFilterProvider, useProductFilters, useProductFilterOptional }
export type { ProductFilterContextValue, ArrayFilterKey }

// ─── useProductFilterOptions ─────────────────────────────────

type FilterOptionsCache = {
  [key: string]: string[] | undefined
}

const optionsCache: FilterOptionsCache = {}

function useProductFilterOptions(): {
  options: (field: string) => string[]
  isLoading: () => boolean
} {
  const [data, setData] = createSignal<FilterOptionsData | null>(null)
  const [loading, setLoading] = createSignal(true)

  onMount(async () => {
    const fields = Object.keys(optionsCache).length > 0
      ? Object.keys(optionsCache)
      : ["brands", "vendors", "productTypes"]

    try {
      const result = await productsApi.getFilterOptions(fields)
      setData(result)
      for (const [key, values] of Object.entries(result.productFilterOptions)) {
        optionsCache[key] = values as string[]
      }
    } finally {
      setLoading(false)
    }
  })

  const options = (field: string): string[] => {
    if (data()) {
      return (data()!.productFilterOptions as Record<string, string[]>)[field] ?? []
    }
    return optionsCache[field] ?? []
  }

  return { options, isLoading: loading }
}

export { useProductFilterOptions }
