import {
  splitProps,
  createContext,
  useContext,
  type JSX,
  createMemo,
  Show,
  For,
} from "solid-js"
import { NumberField } from "../number-field"
import { Button } from "../button"
import { useProductFilters } from "./product-filter-context"
import type { ArrayFilterKey } from "./product-filter-context"
import type { ProductFilters } from "~/lib/api/products"

// ─── Utilities ────────────────────────────────────────────────

const LABEL_MAP: Record<keyof ProductFilters, string> = {
  search: "Search",
  categoryId: "Category",
  brand: "Brand",
  vendor: "Vendor",
  productType: "Type",
  minPrice: "Min price",
  maxPrice: "Max price",
  minRating: "Min rating",
  sortBy: "Sort",
  sortOrder: "Order",
  brands: "Brand",
  vendors: "Vendor",
  productTypes: "Type",
}

type ChipEntry = {
  key: keyof ProductFilters
  label: string
  value: string
  onRemove: () => void
}

// ─── ProductFilterPriceMin / Max ──────────────────────────────

type ProductFilterPriceProps = {
  class?: string
  children?: JSX.Element
}

const ProductFilterPriceMin = (props: ProductFilterPriceProps) => {
  const [local, others] = splitProps(props, ["class", "children"])
  const { filters, setFilter } = useProductFilters()
  const value = createMemo(() => filters().minPrice ?? 0)

  return (
    <NumberField
      class={local.class}
      rawValue={value()}
      onRawValueChange={(v) => setFilter("minPrice", v || undefined)}
      {...others}
    >
      {local.children}
    </NumberField>
  )
}

const ProductFilterPriceMax = (props: ProductFilterPriceProps) => {
  const [local, others] = splitProps(props, ["class", "children"])
  const { filters, setFilter } = useProductFilters()
  const value = createMemo(() => filters().maxPrice ?? 0)

  return (
    <NumberField
      class={local.class}
      rawValue={value()}
      onRawValueChange={(v) => setFilter("maxPrice", v || undefined)}
      {...others}
    >
      {local.children}
    </NumberField>
  )
}

// ─── ProductFilterAppliedChips ────────────────────────────────

const AppliedChipContext = createContext<ChipEntry>()

const useAppliedChip = () => {
  const ctx = useContext(AppliedChipContext)
  if (!ctx)
    throw new Error("useAppliedChip must be used within ProductFilterAppliedChip")
  return ctx
}

type ProductFilterAppliedChipsProps = {
  class?: string
  children?: JSX.Element
}

const ProductFilterAppliedChips = (props: ProductFilterAppliedChipsProps) => {
  const [local] = splitProps(props, ["class", "children"])
  const { filters, removeFilter, toggleFilter } = useProductFilters()

  const entries = createMemo((): ChipEntry[] => {
    const f = filters()
    const items: ChipEntry[] = []

    for (const [k, v] of Object.entries(f)) {
      if (v === undefined || v === null) continue
      const key = k as keyof ProductFilters

      if (Array.isArray(v)) {
        for (const val of v) {
          if (val === "" || val === undefined) continue
          items.push({
            key,
            label: LABEL_MAP[key] ?? key,
            value: val,
            onRemove: () => toggleFilter(key as ArrayFilterKey, val),
          })
        }
      } else if (v !== "") {
        items.push({
          key,
          label: LABEL_MAP[key] ?? key,
          value: String(v),
          onRemove: () => removeFilter(key),
        })
      }
    }

    return items
  })

  return (
    <Show when={entries().length > 0}>
      <div class={local.class}>
        <For each={entries()}>
          {(entry) => (
            <AppliedChipContext.Provider value={entry}>
              {local.children}
            </AppliedChipContext.Provider>
          )}
        </For>
      </div>
    </Show>
  )
}

const ProductFilterAppliedChip = (props: { class?: string; children?: JSX.Element }) => {
  return <>{props.children}</>
}

const ProductFilterAppliedChipLabel = () => {
  const ctx = useAppliedChip()
  return <>{ctx.label}</>
}

const ProductFilterAppliedChipValue = () => {
  const ctx = useAppliedChip()
  return <>{ctx.value}</>
}

const ProductFilterAppliedChipRemove = (props: { class?: string; children?: JSX.Element }) => {
  const [local, others] = splitProps(props, ["class", "children"])
  const ctx = useAppliedChip()

  return (
    <Button
      variant="ghost"
      size="sm"
      class={local.class}
      onClick={ctx.onRemove}
      {...others}
    >
      {local.children ?? "×"}
    </Button>
  )
}

// ─── ProductFilterClearAll ────────────────────────────────────

type ProductFilterClearAllProps = {
  class?: string
  children?: JSX.Element
}

const ProductFilterClearAll = (props: ProductFilterClearAllProps) => {
  const [local] = splitProps(props, ["class", "children"])
  const { hasActiveFilters, clearAll } = useProductFilters()

  return (
    <Show when={hasActiveFilters()}>
      <Button variant="ghost" size="sm" class={local.class} onClick={clearAll}>
        {local.children ?? "Clear all"}
      </Button>
    </Show>
  )
}

// ─── Exports ──────────────────────────────────────────────────

export {
  ProductFilterPriceMin,
  ProductFilterPriceMax,
  ProductFilterAppliedChips,
  ProductFilterAppliedChip,
  ProductFilterAppliedChipLabel,
  ProductFilterAppliedChipValue,
  ProductFilterAppliedChipRemove,
  ProductFilterClearAll,
}

export type {
  ProductFilterPriceProps,
  ProductFilterAppliedChipsProps,
  ProductFilterClearAllProps,
}

