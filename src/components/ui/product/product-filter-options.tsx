import { splitProps, createMemo, type JSX } from "solid-js"
import { Select } from "../select"
import { RadioGroup } from "../radio-group"
import { SegmentedControl } from "../segmented-control"
import { useProductFilters, useProductFilterOptions } from "./product-filter-context"
import type { ProductFilters } from "~/lib/api/products"

// ─── Shared ───────────────────────────────────────────────────

type OptionFilterProps = {
  field: string
  options?: string[]
  placeholder?: string
  class?: string
  children?: JSX.Element
}

function useFilterOption(field: string, explicitOptions?: string[]) {
  const { filters, setFilter } = useProductFilters()
  const filterOptions = useProductFilterOptions()
  const options = createMemo(() => explicitOptions ?? filterOptions.options(field))
  const value = createMemo(
    () => (filters() as Record<string, unknown>)[field] as string | undefined,
  )
  return { options, value, setFilter }
}

// ─── ProductFilterOptionSelect ────────────────────────────────

const ProductFilterOptionSelect = (props: OptionFilterProps) => {
  const [local, others] = splitProps(props, [
    "field",
    "options",
    "placeholder",
    "class",
    "children",
  ])
  const { options, value, setFilter } = useFilterOption(local.field, local.options)

  return (
    <Select<string>
      options={options()}
      value={value()}
      onChange={(v) => setFilter(local.field as any, v as any)}
      placeholder={local.placeholder}
      class={local.class}
      {...others}
    >
      {local.children}
    </Select>
  )
}

// ─── ProductFilterOptionRadioGroup ────────────────────────────

const ProductFilterOptionRadioGroup = (props: OptionFilterProps) => {
  const [local, others] = splitProps(props, [
    "field",
    "options",
    "class",
    "children",
  ])
  const { options, value, setFilter } = useFilterOption(local.field, local.options)

  return (
    <RadioGroup
      options={options()}
      value={value()}
      onChange={(v) => setFilter(local.field as any, v as any)}
      class={local.class}
      {...others}
    >
      {local.children}
    </RadioGroup>
  )
}

// ─── ProductFilterOptionSegmentedControl ──────────────────────

const ProductFilterOptionSegmentedControl = (props: OptionFilterProps) => {
  const [local, others] = splitProps(props, [
    "field",
    "options",
    "class",
    "children",
  ])
  const { options, value, setFilter } = useFilterOption(local.field, local.options)

  return (
    <SegmentedControl
      options={options()}
      value={value()}
      onChange={(v) => setFilter(local.field as any, v as any)}
      class={local.class}
      {...others}
    >
      {local.children}
    </SegmentedControl>
  )
}

// ─── ProductFilterSortSelect ──────────────────────────────────

const SORT_OPTIONS = [
  { value: "name:asc", label: "Name (A-Z)" },
  { value: "name:desc", label: "Name (Z-A)" },
  { value: "price:asc", label: "Price (Low to High)" },
  { value: "price:desc", label: "Price (High to Low)" },
  { value: "createdAt:desc", label: "Newest First" },
  { value: "createdAt:asc", label: "Oldest First" },
]

type ProductFilterSortSelectProps = {
  placeholder?: string
  class?: string
  children?: JSX.Element
}

const ProductFilterSortSelect = (props: ProductFilterSortSelectProps) => {
  const [local, others] = splitProps(props, [
    "placeholder",
    "class",
    "children",
  ])
  const { filters, setFilter } = useProductFilters()

  const value = createMemo(() => {
    const f = filters()
    const by = f.sortBy ?? "createdAt"
    const order = f.sortOrder ?? "desc"
    return `${by}:${order}`
  })

  return (
    <Select<string>
      options={SORT_OPTIONS.map((o) => o.value)}
      value={value()}
      onChange={(v: string) => {
        const [by, order] = v.split(":")
        setFilter("sortBy", by as any)
        setFilter("sortOrder", order as any)
      }}
      placeholder={local.placeholder ?? "Sort by"}
      class={local.class}
      {...others}
    >
      {local.children}
    </Select>
  )
}

// ─── ProductFilterOptionCheckboxGroup ────────────────────────

import {
  createContext,
  useContext,
  For,
} from "solid-js"
import { Checkbox, CheckboxControl, CheckboxIndicator, CheckboxLabel } from "../checkbox"
import type { ArrayFilterKey } from "./product-filter-context"

type ProductFilterOptionCheckboxGroupProps = {
  field: ArrayFilterKey
  options?: string[]
  class?: string
  children?: JSX.Element
}

const CheckboxGroupEntryContext = createContext<{
  field: ArrayFilterKey
  value: string
  checked: () => boolean
  onToggle: () => void
}>()

const useCheckboxGroupEntry = () => {
  const ctx = useContext(CheckboxGroupEntryContext)
  if (!ctx)
    throw new Error(
      "useCheckboxGroupEntry must be used within ProductFilterOptionCheckboxGroup",
    )
  return ctx
}

const ProductFilterOptionCheckboxGroup = (
  props: ProductFilterOptionCheckboxGroupProps,
) => {
  const [local] = splitProps(props, ["field", "options", "class", "children"])
  const { hasFilter, toggleFilter } = useProductFilters()
  const filterOptions = useProductFilterOptions()
  const options = createMemo(() => local.options ?? filterOptions.options(local.field))

  return (
    <For each={local.options}>
      {(option) => (
          <CheckboxGroupEntryContext.Provider
            value={{
              field: local.field,
              value: option,
              checked: () => hasFilter(local.field, option),
              onToggle: () => toggleFilter(local.field, option),
            }}
          >
            {local.children}
          </CheckboxGroupEntryContext.Provider>
        )}
      </For>
  )
}

const ProductFilterOptionCheckbox = (props: {
  class?: string
  children?: JSX.Element
}) => {
  const [local] = splitProps(props, ["class", "children"])
  const ctx = useCheckboxGroupEntry()

  return (
    <Checkbox
      class={local.class}
      checked={ctx.checked()}
      onChange={ctx.onToggle}
    >
      {local.children}
    </Checkbox>
  )
}

// ─── Exports ──────────────────────────────────────────────────

export {
  ProductFilterOptionSelect,
  ProductFilterOptionRadioGroup,
  ProductFilterOptionSegmentedControl,
  ProductFilterSortSelect,
  ProductFilterOptionCheckboxGroup,
  ProductFilterOptionCheckbox,
}

export type {
  ProductFilterSortSelectProps,
}
