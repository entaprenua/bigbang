import { Show, splitProps, type JSX, createMemo } from "solid-js"
import { RecommendationsProvider, useRecommendations } from "./recommendations-context"
import { Query, useQueryState } from "~/components/ui/query"
import { Collection } from "~/components/ui/collection"
import { cn } from "~/lib/utils"
import { recommendationsApi, type RecommendationType, type RecommendationResponse, type RecommendationSource } from "~/lib/api/recommendations"
import type { Product } from "~/lib/types"

export type RecommendationsRootProps = {
  type?: RecommendationType
  limit?: number
  data?: RecommendationResponse
  queryKey?: unknown[]
  enabled?: boolean
  class?: string
  children?: JSX.Element
}

const RecommendationsRoot = (props: RecommendationsRootProps) => {
  const [local, others] = splitProps(props, [
    "type", "limit", "data", "queryKey", "enabled", "class", "children"
  ])

  const queryFn = async () => {
    return recommendationsApi.get(local.type ?? "personalized", local.limit ?? 10)
  }

  const queryKey = createMemo(() => {
    return local.queryKey ?? ["recommendations", local.type ?? "personalized"]
  })

  return (
    <Show when={local.data} fallback={
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
    }>
      <Show when={local.data!.products.length > 0} fallback={null}>
        <RecommendationsProvider initialData={local.data!}>
          <div class={local.class} {...others as any}>{local.children}</div>
        </RecommendationsProvider>
      </Show>
    </Show>
  )
}

const RecommendationsRootContent = (props: { data?: RecommendationResponse; class?: string; children?: JSX.Element }) => {
  const queryState = useQueryState()
  const data = () => queryState?.data as RecommendationResponse
  return (
    <Show when={data()?.products && data().products?.length > 0}>
      <RecommendationsProvider initialData={data()}>
        <div class={props.class}>{props.children}</div>
      </RecommendationsProvider>
    </Show>
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
