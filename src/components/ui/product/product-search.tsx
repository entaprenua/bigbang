import type { JSX } from "solid-js"
import { useNavigate } from "@solidjs/router"
import { Search } from "@kobalte/core/search"
import { SearchProvider, SearchItemProvider, useSearch } from "../search"
import { productsApi } from "~/lib/api/products"


export type ProductSearchProps = {
  placeholder?: string
  class?: string
  itemComponent?: JSX.Element
  children?: JSX.Element
}

export function ProductSearch(props: ProductSearchProps) {
  const navigate = useNavigate()

  return (
    <SearchProvider<string> searchFn={(q) => productsApi.suggestions(q)}>
      <ProductSearchInner
        {...props}
        onSelect={(s) => navigate(`?search=${encodeURIComponent(s)}`)}
        onSubmit={(q) => navigate(`?search=${encodeURIComponent(q)}`)}
      />
    </SearchProvider>
  )
}

function ProductSearchInner(props: ProductSearchProps & {
  onSelect: (s: string) => void
  onSubmit: (q: string) => void
}) {
  const searchCtx = useSearch<string>()

  return (
    <form onSubmit={(e) => { e.preventDefault(); props.onSubmit(searchCtx.query()) }}>
      <Search<string>
        options={searchCtx.results()}
        onInputChange={searchCtx.setQuery}
        onChange={props.onSelect}
        optionValue={(s) => s}
        optionLabel={(s) => s}
        itemComponent={(itemProps) => (
          <SearchItemProvider item={itemProps.item}>
            {props.itemComponent}
          </SearchItemProvider>
        )}
      >
        {props.children}
      </Search>
    </form>
  )
}
