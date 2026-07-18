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

const ProductVariantProvider = (props: { children?: JSX.Element }) => {
  const product = useProduct()
  const variants = () => product?.variants ?? []

  const parentOptions = createMemo(() => parseOptions(product))

  const [selectedOptions, setSelectedOptions] = createStore<
    Record<string, string>
  >({})

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

const ProductVariant = (props: { children?: JSX.Element }) => {
  const item = useCollectionItem()
  const variantCtx = useProductVariantOptional()

  const variant = () => item?.item as Product | undefined

  const handleClick = () => {
    const v = variant()
    if (v && variantCtx) {
      variantCtx.selectVariant(v)
    }
  }

  return (
    <div onClick={handleClick}>
      <ProductProvider data={variant()}>
        {props.children}
      </ProductProvider>
    </div>
  )
}

const ProductVariantOptionValues = (props: { class?: string; children?: JSX.Element }) => {
  const variantCtx = useProductVariant()
  const product = useProduct()
  const [local] = splitProps(props, ["children"])

  const items = createMemo(() => {
    const options = parseOptions(product)
    const sel = variantCtx.selectedOptions
    return options
      .filter(opt => sel[opt.id])
      .map(opt => {
        const valueId = sel[opt.id]
        const valueObj = opt.values.find(v => v.id === valueId)
        return {
          name: opt.name,
          value: valueObj?.value ?? valueId,
        }
      })
  })

  return (
    <Collection data={items()}>
      {local.children}
    </Collection>
  )
}

const ProductVariantOptionValueName = () => {
  const ctx = useCollectionItem()
  const item = () => (ctx?.item ?? {}) as { name?: string }
  return <>{item().name}</>
}

const ProductVariantOptionValueValue = () => {
  const ctx = useCollectionItem()
  const item = () => (ctx?.item ?? {}) as { value?: string }
  return <>{item().value}</>
}

export {
  ProductVariantProvider,
  ProductVariants,
  ProductVariant,
  ProductVariantOptionValues,
  ProductVariantOptionValueName,
  ProductVariantOptionValueValue,
  useProductVariant,
  useProductVariantOptional,
  parseOptions,
}
