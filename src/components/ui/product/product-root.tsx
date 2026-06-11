import { Show, splitProps, createEffect, useContext, type JSX, createMemo } from "solid-js"
import { cn } from "~/lib/utils"
import { A, useParams } from "@solidjs/router"
import { ProductProvider, useProduct, type ProductContextData } from "./product-context"
import { Query, useQueryState } from "../query"
import { productsApi } from "~/lib/api/products"
import { useCollectionItem } from "../collection"
import { SearchItemContext } from "../search"
import type { Product } from "~/lib/types"

type ProductRootProps = {
  storeId?: string
  productSlug?: string
  queryKey?: unknown[]
  href?: string
  class?: string
  children?: JSX.Element
}

const ProductRoot = (props: ProductRootProps) => {
  const [local, others] = splitProps(props, [
    "queryKey",
    "href",
    "class",
    "children",
  ])

  const collectionItem = useCollectionItem()
  const searchItemCtx = useContext(SearchItemContext)
  const params = useParams<{ productSlug?: string; slug?: string }>()

  const routeProductSlug = createMemo(() => params.productSlug ?? params.slug)

  const hasCollectionItem = () => !!collectionItem?.item
  const hasSearchItem = () => !!(searchItemCtx?.item as { rawValue?: unknown })?.rawValue
  const hasExplicitFetch = () => !!(props.productSlug ?? routeProductSlug())

  const shouldCreateProvider = () =>
    hasCollectionItem() || hasSearchItem() || hasExplicitFetch()

  const resolvedData = createMemo(() => {
    if (collectionItem?.item) return collectionItem.item as ProductContextData
    const searchItemRawValue = (searchItemCtx?.item as { rawValue?: unknown })?.rawValue
    if (searchItemRawValue) return searchItemRawValue as ProductContextData
    return undefined
  })

  const resolvedHref = createMemo(() => {
    if (!local.href) return undefined
    return local.href
  })

  return (
    <Show
      when={shouldCreateProvider()}
    >
      <Show
        when={hasCollectionItem() || hasSearchItem()}
        fallback={
          <ProductRootWithFetch
            productSlug={routeProductSlug()}
            queryKey={local.queryKey}
            href={local.href}
            class={local.class}
          >
            {local.children}
          </ProductRootWithFetch>
        }
      >
        <ProductProvider data={resolvedData()!}>
          <ProductWrapper href={resolvedHref()} class={local.class}>
            {local.children}
          </ProductWrapper>
        </ProductProvider>
      </Show>
    </Show>
  )
}

const ProductWrapper = (
  props: { href?: string; class?: string; children?: JSX.Element }
) => {
  const product = useProduct()

  const isInCart = () => product?.isInCart()
  const isInWishlist = () => product?.isInWishlist()

  const resolvedHref = () => {
    const productSlug = product?.data?.slug
    if (!props.href || !productSlug) return undefined
    let base = props.href
    if (base.endsWith("/")) {
      base = base.slice(0, -1)
    }
    if (!base.startsWith("/")) {
      base = `/${base}`
    }
    return `${base}/${productSlug}`
  }

  return (
    <Show
      when={resolvedHref()}
      fallback={
        <div data-in-cart={isInCart() ? "" : undefined} data-in-wishlist={isInWishlist() ? "" : undefined} class={cn("group", props.class)}>
          {props.children}
        </div>
      }
    >
      <A href={resolvedHref()!} data-in-cart={isInCart() ? "" : undefined} data-in-wishlist={isInWishlist() ? "" : undefined} class={cn("group", props.class)}>
        {props.children}
      </A>
    </Show>
  )
}

const ProductRootWithFetch = (props: Omit<ProductRootProps, "data">) => {
  const [local, others] = splitProps(props, [
    "productSlug",
    "queryKey",
    "href",
    "class",
    "children",
  ])

  const queryFn = async (): Promise<Product | null> => {
    if (local.productSlug) {
      return productsApi.getBySlug(local.productSlug)
    }
    return null
  }

  return (
    <Show
      when={local.productSlug}
      fallback={null}
    >
      <Query
        queryFn={queryFn}
        queryKey={
          local.queryKey ?? [
            "product",
            local.productSlug,
          ]
        }
      >
        <ProductRootContent
          href={local.href}
          class={local.class}
        >
          {local.children}
        </ProductRootContent>
      </Query>
    </Show>
  )
}

const ProductRootContent = (props: { href?: string; class?: string; children?: JSX.Element }) => {
  const [local, others] = splitProps(props, ["href", "class", "children"])

  const query = useQueryState()

  const productData = (): Product | null => {
    return (query?.data as Product) ?? null
  }

  return (
    <Show
      when={productData()}
      fallback={null}
    >
      <ProductProvider data={productData() as ProductContextData}>
        <ProductWrapper href={local.href} class={local.class}>
          {local.children}
        </ProductWrapper>
      </ProductProvider>
    </Show>
  )
}

const DefaultProductLoading = () => (
  <div class="animate-pulse space-y-3 p-4">
    <div class="h-48 bg-muted rounded-md" />
    <div class="h-4 bg-muted rounded w-3/4" />
    <div class="h-4 bg-muted rounded w-1/2" />
    <div class="h-8 bg-muted rounded w-1/3 mt-4" />
  </div>
)

export { ProductRoot, ProductRoot as Product }
export type { ProductRootProps }
