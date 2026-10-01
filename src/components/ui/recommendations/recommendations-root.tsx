import { splitProps, type JSX, createMemo, createEffect } from "solid-js"
import { RecommendationsProvider, useRecommendations } from "./recommendations-context"
import { Query, useQueryState } from "~/components/ui/query"
import { useQueryClient } from "~/components/ui/query-client"
import { Collection } from "~/components/ui/collection"
import { useProduct } from "~/components/ui/product/product-root"
import { useCart } from "~/components/ui/cart/cart-context"
import { useCategoryOptional } from "~/components/ui/category"
import { recommendationsApi, type RecommendationType, type RecommendationResponse } from "~/lib/api/recommendations"

export type RecommendationsRootProps = {
  type?: RecommendationType
  limit?: number
  queryKey?: unknown[]
  enabled?: boolean
  categoryId?: string
  class?: string
  children?: JSX.Element
}

const RecommendationsRoot = (props: RecommendationsRootProps) => {
  const [local] = splitProps(props, [
    "type", "limit", "queryKey", "enabled", "categoryId", "class", "children"
  ])

  const queryClient = useQueryClient()
  const productCtx = useProduct()
  const cart = useCart()
  const category = useCategoryOptional()
  const type = createMemo(() => local.type ?? "personalized")

  const productId = createMemo(() => productCtx?.id)
  const needsProductId = createMemo(() => type() === "related" || type() === "bought_together")
  const categoryId = createMemo(() => local.categoryId ?? category?.id() ?? null)
  // Include cart product IDs in the query key so recommendations refetch
  // when items are added/removed from the cart (the backend excludes cart
  // items from results at the serve layer).
  const cartProductIdsKey = createMemo(() =>
    [...new Set(cart.items.map(i => i.productId))].sort().join(',')
  )

  const queryFn = async () => {
    const pid = productId()
    const cid = categoryId()
    const options = {
      ...(needsProductId() && pid ? { productId: pid } : {}),
      ...(cid ? { categoryId: cid } : {}),
    }
    return recommendationsApi.get(type(), local.limit ?? 10,
      Object.keys(options).length > 0 ? options : undefined,
    )
  }

  const queryKey = createMemo(() => {
    return local.queryKey ?? [
      "recommendations",
      type(),
      needsProductId() ? productId() : undefined,
      categoryId() ?? undefined,
    ].filter(Boolean)
  })

  createEffect(() => {
    cartProductIdsKey()
    queryClient.refetchQueries({ queryKey: ["recommendations"], type: 'all' })
  })

  return (
    <Query
      queryFn={queryFn}
      queryKey={queryKey()}
      enabled={local.enabled ?? true}
    >
      <RecommendationsRootContent
        class={local.class}
      >{local.children}
      </RecommendationsRootContent>
    </Query>
  )
}

// Null-rendering effect component that syncs query state into the
// RecommendationsProvider store on every refetch.
const RecommendationsDataSync = () => {
  const queryState = useQueryState()
  const ctx = useRecommendations()
  const data = () => queryState?.data as RecommendationResponse
  createEffect(() => {
    const d = data()
    if (!d) return
    ctx.setProducts(d.products)
    ctx.setSource(d.source)
    ctx.setFallback(d.fallback)
  })
  return null
}

const RecommendationsRootContent = (props: { class?: string; children?: JSX.Element }) => {
  return (
    <RecommendationsProvider>
      <RecommendationsDataSync />
      <div class={props.class}>{props.children}</div>
    </RecommendationsProvider>
  )
}

export type RecommendationsItemsProps = {
  class?: string
  children?: JSX.Element
}

const RecommendationsItems = (props: RecommendationsItemsProps) => {
  const recommendations = useRecommendations()
  const items = createMemo(() => recommendations.products())
  const [local] = splitProps(props, ["class", "children"])

  return (
    <Collection data={items()}>
      {local.children}
    </Collection>
  )
}

export {
  RecommendationsRoot,
  RecommendationsProvider,
  RecommendationsItems,
  useRecommendations,
}
