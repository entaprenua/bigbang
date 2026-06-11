import {
  createContext,
  useContext,
  createMemo,
  splitProps,
  type JSX,
} from "solid-js"
import { createStore } from "solid-js/store"
import type { ProductVariant } from "~/lib/generated/graphql"
import { Select } from "../select"
import { RadioGroup } from "../radio-group"
import { SegmentedControl } from "../segmented-control"
import { useProduct } from "./product-context"

type ProductVariantContextValue = {
  selectedOptions: Record<string, string>
  availableValues: (optionName: string) => string[]
  selectedVariant: () => ProductVariant | undefined
  select: (optionName: string, value: string) => void
}

const ProductVariantContext =
  createContext<ProductVariantContextValue | undefined>()

const useProductVariantOptional = () => useContext(ProductVariantContext)

const useProductVariant = () => {
  const ctx = useContext(ProductVariantContext)
  if (!ctx)
    throw new Error(
      "useProductVariant must be used within ProductVariantProvider",
    )
  return ctx
}

// ─── ProductVariantProvider ───────────────────────────────────

const ProductVariantProvider = (props: { children?: JSX.Element }) => {
  const product = useProduct()
  const variants = () => product?.data?.variants ?? []

  const [selectedOptions, setSelectedOptions] = createStore<
    Record<string, string>
  >({})

  const availableValues = (optionName: string): string[] =>
    variants()
      .flatMap((v) => v.optionValues ?? [])
      .filter((ov) => ov.optionName === optionName)
      .map((ov) => ov.value)
      .filter((v, i, a) => a.indexOf(v) === i)

  const selectedVariant = createMemo(() =>
    variants().find((v) =>
      v.optionValues?.every(
        (ov) => selectedOptions[ov.optionName] === ov.value,
      ),
    ),
  )

  const select = (optionName: string, value: string) => {
    setSelectedOptions(optionName, value)
  }

  return (
    <ProductVariantContext.Provider
      value={{ selectedOptions, availableValues, selectedVariant, select }}
    >
      {props.children}
    </ProductVariantContext.Provider>
  )
}

// ─── ProductVariantOptionSelect ───────────────────────────────

type ProductVariantOptionSelectProps = {
  name: string
  placeholder?: string
  class?: string
  children?: JSX.Element
}

const ProductVariantOptionSelect = (
  props: ProductVariantOptionSelectProps,
) => {
  const [local, others] = splitProps(props, [
    "name",
    "placeholder",
    "class",
    "children",
  ])
  const ctx = useProductVariant()
  const options = createMemo(() => ctx.availableValues(local.name))
  const value = () => ctx.selectedOptions[local.name]

  return (
    <Select<string>
      options={options()}
      value={value()}
      onChange={(v) => ctx.select(local.name, v)}
      placeholder={local.placeholder}
      class={local.class}
      {...others}
    >
      {local.children}
    </Select>
  )
}

// ─── ProductVariantOptionRadioGroup ───────────────────────────

type ProductVariantOptionRadioGroupProps = {
  name: string
  class?: string
  children?: JSX.Element
}

const ProductVariantOptionRadioGroup = (
  props: ProductVariantOptionRadioGroupProps,
) => {
  const [local, others] = splitProps(props, ["name", "class", "children"])
  const ctx = useProductVariant()
  const options = createMemo(() => ctx.availableValues(local.name))
  const value = () => ctx.selectedOptions[local.name]

  return (
    <RadioGroup
      options={options()}
      value={value()}
      onChange={(v) => ctx.select(local.name, v)}
      class={local.class}
      {...others}
    >
      {local.children}
    </RadioGroup>
  )
}

// ─── ProductVariantOptionSegmentedControl ─────────────────────

type ProductVariantOptionSegmentedControlProps = {
  name: string
  class?: string
  children?: JSX.Element
}

const ProductVariantOptionSegmentedControl = (
  props: ProductVariantOptionSegmentedControlProps,
) => {
  const [local, others] = splitProps(props, ["name", "class", "children"])
  const ctx = useProductVariant()
  const options = createMemo(() => ctx.availableValues(local.name))
  const value = () => ctx.selectedOptions[local.name]

  return (
    <SegmentedControl
      options={options()}
      value={value()}
      onChange={(v) => ctx.select(local.name, v)}
      class={local.class}
      {...others}
    >
      {local.children}
    </SegmentedControl>
  )
}

// ─── Exports ──────────────────────────────────────────────────

export {
  ProductVariantProvider,
  useProductVariantOptional,
  ProductVariantOptionSelect,
  ProductVariantOptionRadioGroup,
  ProductVariantOptionSegmentedControl,
}

export type {
  ProductVariantOptionSelectProps,
  ProductVariantOptionRadioGroupProps,
  ProductVariantOptionSegmentedControlProps,
}
