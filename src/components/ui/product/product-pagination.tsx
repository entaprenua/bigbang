import { splitProps, type JSX } from "solid-js"
import { cn } from "~/lib/utils"
import { useProductPagination } from "./product-pagination-context"

// ─── ProductPaginationNext ────────────────────────────────────

export type ProductPaginationNextProps = {
  class?: string
  children?: JSX.Element
}

export function ProductPaginationNext(props: ProductPaginationNextProps) {
  const [local] = splitProps(props, ["class", "children"])
  const ctx = useProductPagination()

  return (
    <button
      type="button"
      onClick={ctx.goNext}
      class={cn(
        "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors",
        "bg-primary text-primary-foreground hover:bg-primary/90",
        "group-not-data-[has-next]:pointer-events-none group-not-data-[has-next]:opacity-50",
        local.class
      )}
    >
      {local.children ?? "Next"}
    </button>
  )
}

// ─── ProductPaginationPrevious ────────────────────────────────

export type ProductPaginationPreviousProps = {
  class?: string
  children?: JSX.Element
}

export function ProductPaginationPrevious(props: ProductPaginationPreviousProps) {
  const [local] = splitProps(props, ["class", "children"])
  const ctx = useProductPagination()

  return (
    <button
      type="button"
      onClick={ctx.goPrevious}
      class={cn(
        "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors",
        "bg-primary text-primary-foreground hover:bg-primary/90",
        "group-not-data-[has-previous]:pointer-events-none group-not-data-[has-previous]:opacity-50",
        local.class
      )}
    >
      {local.children ?? "Previous"}
    </button>
  )
}

// ─── ProductPaginationTotal ───────────────────────────────────

export type ProductPaginationTotalProps = {
  class?: string
}

export function ProductPaginationTotal(props: ProductPaginationTotalProps) {
  const [local, others] = splitProps(props, ["class"])
  const ctx = useProductPagination()

  return (
    <span class={cn("text-sm text-muted-foreground", local.class)} {...others}>
      {ctx.totalElements()}
    </span>
  )
}
