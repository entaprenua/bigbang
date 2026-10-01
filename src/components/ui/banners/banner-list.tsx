import { splitProps, type JSX, createMemo } from "solid-js"
import { Collection } from "../collection"
import { useBanner } from "./banner-context"
import { bannersApi } from "~/lib/api/banners"
import type { Banner } from "~/lib/types"

type BannersProps = {
  queryKey?: unknown[]
  enabled?: boolean
  children?: JSX.Element
}

const Banners = (props: BannersProps) => {
  const [local] = splitProps(props, ["queryKey", "enabled", "children"])

  const queryFn = async (): Promise<Banner[] | null> => {
    return await bannersApi.getAll()
  }

  return (
    <Collection
      queryFn={queryFn}
      queryKey={local.queryKey ?? ["banners"]}
      enabled={local.enabled ?? true}
    >
      {local.children}
    </Collection>
  )
}

type SubbannersProps = {
  class?: string
  children?: JSX.Element
}

const Subbanners = (props: SubbannersProps) => {
  const [local] = splitProps(props, ["children"])
  const banner = useBanner()
  const children = createMemo(() => banner.children())

  return (
    <Collection data={children()}>
      {local.children}
    </Collection>
  )
}

const DefaultBannersLoading = (props: { class?: string }) => (
  <div class={props.class ?? "flex flex-col gap-2 p-2"}>
    <div class="animate-pulse h-32 bg-muted rounded" />
    <div class="animate-pulse h-32 bg-muted rounded" />
  </div>
)

export { Banners, Subbanners, DefaultBannersLoading }
export type { BannersProps, SubbannersProps }
