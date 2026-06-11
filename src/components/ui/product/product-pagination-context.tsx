import { createContext, useContext, createSignal, type Accessor, type JSX } from "solid-js"
import type { ProductConnection } from "~/lib/types"

export type ProductPaginationContextValue = {
  pageSize: Accessor<number>
  totalElements: Accessor<number>
  hasNextPage: Accessor<boolean>
  hasPreviousPage: Accessor<boolean>
  after: Accessor<string | null>
  before: Accessor<string | null>
  goNext: () => void
  goPrevious: () => void
  goFirst: () => void
  syncPage: (response: ProductConnection) => void
  resetPagination: () => void
}

const ProductPaginationContext = createContext<ProductPaginationContextValue>()

export const useProductPagination = (): ProductPaginationContextValue => {
  const ctx = useContext(ProductPaginationContext)
  if (!ctx) {
    throw new Error("useProductPagination must be used within ProductPaginationProvider")
  }
  return ctx
}

export const useProductPaginationOptional = (): ProductPaginationContextValue | undefined =>
  useContext(ProductPaginationContext)

type ProductPaginationProviderProps = {
  initialPageSize?: number
  children?: JSX.Element
}

export function ProductPaginationProvider(props: ProductPaginationProviderProps) {
  const [pageSize] = createSignal(props.initialPageSize ?? 20)
  const [totalElements, setTotalElements] = createSignal(0)
  const [hasNextPage, setHasNextPage] = createSignal(false)
  const [hasPreviousPage, setHasPreviousPage] = createSignal(false)
  const [nextCursor, setNextCursor] = createSignal<string | null>(null)
  const [previousCursor, setPreviousCursor] = createSignal<string | null>(null)
  const [after, setAfter] = createSignal<string | null>(null)
  const [before, setBefore] = createSignal<string | null>(null)

  const goNext = () => {
    if (hasNextPage() && nextCursor()) {
      setBefore(null)
      setAfter(nextCursor())
    }
  }

  const goPrevious = () => {
    if (hasPreviousPage() && previousCursor()) {
      setAfter(null)
      setBefore(previousCursor())
    }
  }

  const goFirst = () => {
    setAfter(null)
    setBefore(null)
  }

  const syncPage = (response: ProductConnection) => {
    setTotalElements(response.totalCount ?? 0)
    setHasNextPage(response.pageInfo.hasNextPage ?? false)
    setHasPreviousPage(response.pageInfo.hasPreviousPage ?? false)
    setNextCursor(response.pageInfo.endCursor ?? null)
    setPreviousCursor(response.pageInfo.startCursor ?? null)
  }

  const resetPagination = () => {
    setAfter(null)
    setBefore(null)
    setNextCursor(null)
    setPreviousCursor(null)
    setTotalElements(0)
    setHasNextPage(false)
    setHasPreviousPage(false)
  }

  const value: ProductPaginationContextValue = {
    pageSize,
    totalElements,
    hasNextPage,
    hasPreviousPage,
    after,
    before,
    goNext,
    goPrevious,
    goFirst,
    syncPage,
    resetPagination,
  }

  return (
    <ProductPaginationContext.Provider value={value}>
      <div
        data-has-next={hasNextPage() ? "" : undefined}
        data-has-previous={hasPreviousPage() ? "" : undefined}
        class="group"
      >
        {props.children}
      </div>
    </ProductPaginationContext.Provider>
  )
}

export { ProductPaginationContext }
