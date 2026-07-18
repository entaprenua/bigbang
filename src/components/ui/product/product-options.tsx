import { createMemo, createEffect, splitProps, type JSX } from "solid-js"
import type { ProductOption, ProductOptionValue } from "~/lib/types"
import { Collection, useCollectionItem } from "../collection"
import { Select, type SelectProps } from "../select"
import { RadioGroup } from "../radio-group"
import { SegmentedControl } from "../segmented-control"
import { useProductVariant } from "./product-variants"
import { useProduct } from "./product-root"

// ─── Helpers ──────────────────────────────────────────────────

function parseOptions(product: Partial<import("~/lib/generated/graphql").Product> | undefined): ProductOption[] {
  if (!product?.options) return []
  try {
    const parsed = JSON.parse(product.options)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

// ─── Shared hook ──────────────────────────────────────────────

function useOptionValuesContext() {
  const item = useCollectionItem()
  const option = () => item?.item as ProductOption | undefined
  const ctx = useProductVariant()

  const values = createMemo(() => {
    const opt = option()
    if (!opt?.values) return []
    return opt.values
  })

  const available = createMemo(() => {
    const opt = option()
    if (!opt) return [] as ProductOptionValue[]
    return ctx.availableValues(opt.name)
  })

  const selectedId = createMemo(() => {
    const opt = option()
    return opt ? ctx.selectedOptions[opt.id] || "" : ""
  })

  const options = createMemo(() =>
    values().map((ov) => ({
      value: ov.id,
      label: ov.value,
      disabled: available().length > 0 && !available().some((a) => a.id === ov.id),
    }))
  )

  // createEffect(() => {
  //   console.log("option:", option()?.name, "values:", values(), "available:", available(), "selected:", ctx.selectedOptions)
  // })

  const select = (v: string) => {
    const opt = option()
    if (opt) ctx.select(opt.id, v)
  }

  return { options, selectedId, select }
}

// ─── ProductOptions — Collection Root ─────────────────────────

const ProductOptions = (props: { children?: JSX.Element }) => {
  const product = useProduct()
  const options = createMemo(() => parseOptions(product))

  return (
    <Collection data={options()}>
      {props.children}
    </Collection>
  )
}

// ─── ProductOptionName ────────────────────────────────────────

const ProductOptionName = () => {
  const item = useCollectionItem()
  const name = () => (item?.item as ProductOption | undefined)?.name
  return <>{name()}</>
}

// ─── ProductOptionValuesSelect ────────────────────────────────

const ProductOptionValuesSelect = (
  props: SelectProps<ProductOptionValue>,
) => {
  const [local, others] = splitProps(props, [
    "placeholder",
    "class",
    "children",
  ])
  const item = useCollectionItem()
  const option = () => item?.item as ProductOption | undefined
  const ctx = useProductVariant()

  const values = createMemo(() => {
    const opt = option()
    if (!opt?.values) return []
    return opt.values
  })

  const selectedValue = createMemo(() =>
    values().find((ov) => ov.id === (option() ? ctx.selectedOptions[option()!.id] : undefined)),
  )

  return (
    <div onClick={(e) => {
      e.stopPropagation()
      e.preventDefault()
    }}
    >
      <Select<ProductOptionValue>
        options={values()}
        optionValue="id"
        optionTextValue="value"
        value={selectedValue()}
        onChange={(v) => {
          const opt = option()
          if (opt) ctx.select(opt.id, v.id)
        }}
        placeholder={local.placeholder}
        class={local.class}
        {...others}
      >
        {local.children}
      </Select>
    </div>
  )
}

// ─── ProductOptionValuesRadioGroup ────────────────────────────

const ProductOptionValuesRadioGroup = (
  props: { class?: string; children?: JSX.Element },
) => {
  const [local, others] = splitProps(props, ["class", "children"])
  const { options, selectedId, select } = useOptionValuesContext()

  return (
    <div onClick={(e) => {
      e.stopPropagation()
      e.preventDefault()
    }}
    >
      <RadioGroup
        options={options()}
        value={selectedId()}
        onChange={select}
        class={local.class}
        {...others}
      >
        {local.children}
      </RadioGroup>
    </div>
  )
}

// ─── ProductOptionValuesSegmentedControl ──────────────────────

const ProductOptionValuesSegmentedControl = (
  props: { class?: string; children?: JSX.Element },
) => {
  const [local, others] = splitProps(props, ["class", "children"])
  const { options, selectedId, select } = useOptionValuesContext()

  return (
    <div onClick={(e) => {
      e.stopPropagation()
      e.preventDefault()
    }}
    >
      <SegmentedControl
        options={options()}
        value={selectedId()}
        onChange={select}
        class={local.class}
        {...others}
      >
        {local.children}
      </SegmentedControl>
    </div>
  )
}

// ─── Exports ──────────────────────────────────────────────────

export {
  ProductOptions,
  ProductOptionName,
  ProductOptionValuesSelect,
  ProductOptionValuesRadioGroup,
  ProductOptionValuesSegmentedControl,
}
