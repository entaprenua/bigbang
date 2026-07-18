import { splitProps, type JSX, createMemo, createEffect } from "solid-js"
import { RecommendationsProvider, useRecommendations } from "./recommendations-context"
import { Query, useQueryState } from "~/components/ui/query"
import { queryClient } from "~/components/ui/query-client"
import { Collection } from "~/components/ui/collection"
import { useProduct } from "~/components/ui/product/product-root"
import { useCart } from "~/components/ui/cart/cart-context"
import { recommendationsApi, type RecommendationType, type RecommendationResponse } from "~/lib/api/recommendations"

export type RecommendationsRootProps = {
  type?: RecommendationType
  limit?: number
  queryKey?: unknown[]
  enabled?: boolean
  class?: string
  children?: JSX.Element
}

const RecommendationsRoot = (props: RecommendationsRootProps) => {
  const [local] = splitProps(props, [
    "type", "limit", "queryKey", "enabled", "class", "children"
  ])

  const productCtx = useProduct()
  const cart = useCart()
  const type = createMemo(() => local.type ?? "personalized")

  const productId = createMemo(() => productCtx?.id)
  const needsProductId = createMemo(() => type() === "related" || type() === "bought_together")
  // Include cart product IDs in the query key so recommendations refetch
  // when items are added/removed from the cart. The backend filters out cart
  // items from results at the DB level, and the client also filters reactively
  // via RecommendationsDataSync.
  const cartProductIdsKey = createMemo(() =>
    [...new Set(cart.items.map(i => i.productId))].sort().join(',')
  )

  const queryFn = async () => {
    const pid = productId()
    return recommendationsApi.get(type(), local.limit ?? 10,
      needsProductId() && pid ? { productId: pid } : undefined,
    )
  }

  const queryKey = createMemo(() => {
    return local.queryKey ?? ["recommendations", type(), needsProductId() ? productId() : undefined].filter(Boolean)
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

// Null-rendering effect component that syncs query + cart state into
// RecommendationsProvider store on every refetch or cart change.
const RecommendationsDataSync = () => {
  const queryState = useQueryState()
  const cart = useCart()
  const ctx = useRecommendations()
  const data = () => queryState?.data as RecommendationResponse
  const cartProductIds = createMemo(() => new Set(cart.items.map(i => i.productId)))
  const filteredData = createMemo(() => {
    const d = data()
    if (!d) return null
    const ids = cartProductIds()
    if (ids?.size === 0) return d
    return { ...d, products: d.products.filter(p => !ids.has(p.id)) }
  })
  createEffect(() => {
    const fd = filteredData()
    if (!fd) return
    ctx.setProducts(fd.products)
    ctx.setSource(fd.source)
    ctx.setFallback(fd.fallback)
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
