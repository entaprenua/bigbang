import { Show, type JSX } from "solid-js"
import { useStore } from "./store-context"

export const StoreName = () => {
  const ctx = useStore()
  return <Show when={ctx?.store()?.name}>{(name) => name()}</Show>
}

export const StoreDescription = () => {
  const ctx = useStore()
  return <Show when={ctx?.store()?.description}>{(d) => d()}</Show>
}

export const StoreDomain = () => {
  const ctx = useStore()
  return <Show when={ctx?.store()?.domainName}>{(d) => d()}</Show>
}

export const StoreMaintenanceBadge = (props: { children: JSX.Element }) => {
  const ctx = useStore()
  return <Show when={ctx?.isInMaintenance()}>{props.children}</Show>
}

