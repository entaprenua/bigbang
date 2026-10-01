import type { JSX } from "solid-js"
import { useNavigate } from "@solidjs/router"
import { Search } from "@kobalte/core/search"
import { SearchProvider, SearchItemProvider, useSearch } from "../search"
import { productsApi } from "~/lib/api/products"
import type { Product } from "~/lib/types"

export type ProductSearchProps = {
  placeholder?: string
  class?: string
  itemComponent?: JSX.Element | (() => JSX.Element)
  searchPath?: string
  limit?: number
  children?: JSX.Element
}

function queryUrl(path: string, query: string): string {
  return `${path}?search=${encodeURIComponent(query)}`
}

export function ProductSearch(props: ProductSearchProps) {
  const navigate = useNavigate()
  const path = props.searchPath ?? ""

  const searchFn = async (q: string): Promise<Product[]> => {
    const response = await productsApi.getAll(undefined, undefined, props.limit ?? 10, { search: q })
    return response.edges?.map((edge) => edge.node) ?? []
  }

  return (
    <SearchProvider<Product> searchFn={searchFn}>
      <ProductSearchInner
        {...props}
        onSelect={(product) => navigate(`/products/${encodeURIComponent(product.slug ?? product.id)}`)}
        onSubmit={(q) => navigate(queryUrl(path, q))}
      />
    </SearchProvider>
  )
}

function ProductSearchInner(props: ProductSearchProps & {
  onSelect: (product: Product) => void
  onSubmit: (q: string) => void
}) {
  const searchCtx = useSearch<Product>()
  let selectionHandled = false

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        if (!selectionHandled) props.onSubmit(searchCtx.query())
        selectionHandled = false
      }}
      onKeyDown={(e) => {
        if (e.key !== "Enter") return
        e.preventDefault()
        if (selectionHandled) {
          selectionHandled = false
          return
        }
        props.onSubmit(searchCtx.query())
      }}
    >
      <Search<Product>
        options={searchCtx.results()}
        onInputChange={searchCtx.setQuery}
        onChange={(value) => {
          if (value) {
            selectionHandled = true
            props.onSelect(value as Product)
          }
        }}
        optionValue={(p) => p.id}
        optionLabel={(p) => p.name}
        itemComponent={(itemProps) => (
          <SearchItemProvider item={itemProps.item}>
            {typeof props.itemComponent === "function"
              ? props.itemComponent()
              : props.itemComponent}
          </SearchItemProvider>
        )}
      >
        {props.children}
      </Search>
    </form>
  )
}
