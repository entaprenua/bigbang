import {
  createContext,
  useContext,
  createMemo,
  splitProps,
  type JSX,
} from "solid-js"
import { createStore } from "solid-js/store"
import { Collection, useCollectionItem } from "../collection"
import type { Product } from "~/lib/generated/graphql"
import type { ProductOption, ProductOptionValue, ProductOptionValues } from "~/lib/types"
import { useProduct, ProductProvider } from "./product-root"

type ProductVariantContextValue = {
  selectedOptions: Record<string, string>
  selectedVariant: () => Product | undefined
  availableValues: (optionName: string) => ProductOptionValue[]
  select: (optionId: string, optionValueId: string) => void
  selectVariant: (variant: Product) => void
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

// ─── Helpers ──────────────────────────────────────────────────

function parseVariantSelection(v: Product): ProductOptionValues {
  if (!v.optionValues) return {}
  try {
    return JSON.parse(v.optionValues) ?? {}
  } catch {
    return {}
  }
}

// ─── ProductVariantProvider ───────────────────────────────────

function defaultSelections(product: Partial<Product> | undefined): Record<string, string> {
  const opts = parseOptions(product)
  const variants = product?.variants ?? []

  if (variants.length > 0) {
    const sel = parseVariantSelection(variants[0])
    if (Object.keys(sel).length > 0) return sel
  }

  return Object.fromEntries(
    opts.filter(opt => opt.values.length > 0).map(opt => [opt.id, opt.values[0].id])
  )
}

const ProductVariantProvider = (props: { children?: JSX.Element }) => {
  const product = useProduct()
  const variants = () => product?.variants ?? []

  const parentOptions = createMemo(() => parseOptions(product))

  const [selectedOptions, setSelectedOptions] = createStore<
    Record<string, string>
  >(defaultSelections(product))

  const optionByName = createMemo(() => {
    const map: Record<string, ProductOption> = {}
    for (const opt of parentOptions()) {
      map[opt.name] = opt
    }
    return map
  })

  const availableValues = (optionName: string): ProductOptionValue[] => {
    const optDef = optionByName()[optionName]
    if (!optDef) return []

    if (variants().length === 0) return optDef.values

    const matchingVariants = variants().filter((v) => {
      const sel = parseVariantSelection(v)
      return Object.entries(selectedOptions).every(([optId, valId]) => {
        if (optId === optDef.id) return true
        return sel[optId] === valId
      })
    })

    const usedValueIds = new Set(
      matchingVariants.flatMap((v) => {
        const sel = parseVariantSelection(v)
        const vid = sel[optDef.id]
        return vid ? [vid] : []
      }),
    )

    return optDef.values.filter((v) => usedValueIds.has(v.id))
  }

  const selectedVariant = createMemo(() =>
    variants().find((v) => {
      const sel = parseVariantSelection(v)
      return Object.entries(selectedOptions).every(
        ([optId, valId]) => sel[optId] === valId,
      )
    }),
  )

  const select = (optionId: string, optionValueId: string) => {
    setSelectedOptions(optionId, optionValueId)
  }

  const selectVariant = (variant: Product) => {
    const sel = parseVariantSelection(variant)
    const opts = parentOptions()
    for (const [optId, valId] of Object.entries(sel)) {
      const opt = opts.find((o) => o.id === optId)
      if (opt) {
        setSelectedOptions(optId, valId)
      }
    }
  }

  return (
    <ProductVariantContext.Provider
      value={{ selectedOptions, availableValues, selectedVariant, select, selectVariant }}
    >
      {props.children}
    </ProductVariantContext.Provider>
  )
}

// ─── parseOptions helper (also needed by product-options.tsx) ──

function parseOptions(product: Partial<Product> | undefined): ProductOption[] {
  if (!product?.options) return []
  try {
    const parsed = JSON.parse(product.options)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

// ─── Exports ──────────────────────────────────────────────────

type ProductVariantsProps = {
  class?: string
  children?: JSX.Element
}

const ProductVariants = (props: ProductVariantsProps) => {
  const product = useProduct()
  const [local] = splitProps(props, ["children"])

  return (
    <Collection data={product?.variants ?? []}>
      {local.children}
    </Collection>
  )
}

const ProductVariant = (props: { class?: string; children?: JSX.Element }) => {
  const [local, others] = splitProps(props, ["class", "children"])
  const item = useCollectionItem()
  const variantCtx = useProductVariantOptional()

  const variant = () => item?.item as Product | undefined
  const isSelected = createMemo(() => variant()?.id === variantCtx?.selectedVariant()?.id)

  const handleClick = () => {
    const v = variant()
    if (v && variantCtx) {
      variantCtx.selectVariant(v)
    }
  }

  return (
    <div
      data-selected={isSelected() ? "" : undefined}
      class={local.class}
      onClick={handleClick}
      {...others}
    >
      <ProductProvider data={variant()} explicit>
        {local.children}
      </ProductProvider>
    </div>
  )
}

const ProductSelectedOptionValues = (props: { class?: string; children?: JSX.Element }) => {
  const product = useProduct()
  const [local] = splitProps(props, ["children"])

  const items = createMemo(() => {
    if (!product?.options || !product?.optionValues) return []
    const options: ProductOption[] = JSON.parse(product.options)
    const selected: Record<string, string> = JSON.parse(product.optionValues)
    return options
      .filter(opt => selected[opt.id])
      .map(opt => ({
        name: opt.name,
        value: opt.values.find(v => v.id === selected[opt.id])?.value ?? selected[opt.id],
      }))
  })

  return <Collection data={items()}>{local.children}</Collection>
}

const ProductSelectedOptionValueName = () => {
  const ctx = useCollectionItem()
  const item = () => (ctx?.item ?? {}) as { name?: string }
  return <>{item().name}</>
}

const ProductSelectedOptionValueValue = () => {
  const ctx = useCollectionItem()
  const item = () => (ctx?.item ?? {}) as { value?: string }
  return <>{item().value}</>
}

export {
  ProductVariantProvider,
  ProductVariants,
  ProductVariant,
  ProductSelectedOptionValues,
  ProductSelectedOptionValueName,
  ProductSelectedOptionValueValue,
  useProductVariant,
  useProductVariantOptional,
  parseOptions,
}
