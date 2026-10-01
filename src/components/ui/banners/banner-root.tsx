import { Show, splitProps, type JSX, createMemo } from "solid-js"
import { A } from "@solidjs/router"
import { BannerProvider, useBanner, type BannerProps } from "./banner-context"
import { useCollectionItem } from "../collection"
import { cn } from "~/lib/utils"

type BannerRootProps = {
  data?: BannerProps | null
  class?: string
  children?: JSX.Element
}

const BannerRoot = (props: BannerRootProps) => {
  const [local] = splitProps(props, ["data", "class", "children"])
  const collectionItem = useCollectionItem()
  const hasCollectionItem = () => !!collectionItem?.item
  const hasExplicitData = () => local.data !== undefined

  const resolvedData = createMemo(() => {
    if (local.data !== undefined) return local.data
    if (collectionItem) return collectionItem.item as BannerProps
    return null
  })

  const shouldCreateProvider = () => hasExplicitData() || hasCollectionItem()

  return (
    <Show when={shouldCreateProvider()}>
      <BannerProvider data={resolvedData()}>
        <BannerWrapper class={local.class}>
          {local.children}
        </BannerWrapper>
      </BannerProvider>
    </Show>
  )
}

type BannerWrapperProps = {
  class?: string
  children?: JSX.Element
}

const BannerWrapper = (props: BannerWrapperProps) => {
  const banner = useBanner()
  const isLink = () => banner.href() !== null && banner.children().length === 0

  return (
    <Show
      when={isLink()}
      fallback={<div class={props.class}>{props.children}</div>}
    >
      <A href={banner.href()!} class={cn("block", props.class)}>
        {props.children}
      </A>
    </Show>
  )
}

const DefaultBannerLoading = () => (
  <div class="animate-pulse space-y-3 p-4">
    <div class="h-48 bg-muted rounded-md" />
    <div class="h-4 bg-muted rounded w-3/4" />
  </div>
)

export { BannerRoot, BannerRoot as Banner, BannerWrapper, DefaultBannerLoading }
export type { BannerRootProps }
