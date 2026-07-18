import { splitProps, type JSX, For, createMemo } from "solid-js"
import { Show } from "solid-js"
import { useSearchParams } from "@solidjs/router"
import { Collection, useCollectionData } from "../collection"
import { useQueryState } from "../query"
import { useCategoryOptional } from "./../category/category-context"
import { useProductFilterOptional } from "./product-filter-context"
import { productsApi, type ProductFilters } from "~/lib/api/products"
import type { Product, ProductConnection } from "~/lib/types"
import { useProductPaginationOptional } from "./product-pagination-context"

type ProductsProps = {
  storeId?: string
  categoryId?: string
  filters?: ProductFilters
  pageSize?: number
  queryKey?: unknown[]
  enabled?: boolean
  children?: JSX.Element
}

const Products = (props: ProductsProps) => {
  const [local] = splitProps(props, [
    "storeId",
    "categoryId",
    "filters",
    "pageSize",
    "queryKey",
    "enabled",
    "children",
  ])
  const category = useCategoryOptional()
  const filterCtx = useProductFilterOptional()
  const paginationCtx = useProductPaginationOptional()
  const [params] = useSearchParams()
  const categoryId = createMemo(() => category?.id())
  const searchQuery = () => (params.search as string) ?? ""
  const filters = (): ProductFilters | undefined =>
    filterCtx?.filters() ?? local.filters ?? (categoryId() ? { categoryId: categoryId() } : undefined)

  const queryFn = async (): Promise<Product[] | null> => {
    const size = paginationCtx ? paginationCtx.pageSize() : 40
    const after = paginationCtx?.after() ?? undefined
    const before = paginationCtx?.before() ?? undefined

    let response: ProductConnection | null = null

    if (searchQuery()) {
      response = await productsApi.getAll(after, before, size, { ...filters(), search: searchQuery() })
    } else if (categoryId()) {
      response = await productsApi.getAll(after, before, size, { ...filters(), categoryId: categoryId() })
    } else {
      response = await productsApi.getAll(after, before, size, filters())
    }

    if (paginationCtx && response) {
      paginationCtx.syncPage(response)
    }

    return response?.edges?.map(e => e.node) ?? null
  }

  const key = createMemo(() => {
    const q = searchQuery()
    const a = paginationCtx?.after()
    const b = paginationCtx?.before()
    const catId = categoryId()
    const ctxFilters = filterCtx?.filters()
    const localF = local.filters
    return q
      ? ["products", "search", q, catId, ctxFilters, localF, a, b]
      : catId
        ? ["products", "category", catId, ctxFilters, localF, a, b]
        : ["products", "all", ctxFilters, localF, a, b]
  })

  return (
    <Collection
      queryFn={queryFn}
      queryKey={local.queryKey ?? key()}
      enabled={local.enabled ?? true}
      placeholderData={(prev: any) => prev}
    >
      {local.children}
    </Collection>
  )
}

export { Products }
export type { ProductsProps }
