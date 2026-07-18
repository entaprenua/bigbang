import { Show, splitProps, createMemo, type JSX } from "solid-js"
import { useStore } from "./store-context"
import { Image, ImageImg, ImageFallback } from "../image"
import { cn } from "~/lib/utils"
import { Link } from "@solidjs/meta"
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

export type StoreLogoProps = {
  class?: string
  alt?: string
} & JSX.HTMLAttributes<HTMLSpanElement>

export const StoreLogo = (props: StoreLogoProps) => {
  const [local, others] = splitProps(props, ["class", "alt"])
  const ctx = useStore()
  return (
    <Image class={cn("w-full rounded-lg border border-border/50 shadow-sm", local.class)} {...others}>
      <ImageImg src={ctx?.store()?.logoUrl ?? ctx?.store()?.faviconUrl ?? undefined} alt={local.alt ?? ctx?.store()?.name ?? ""} />
      <ImageFallback class="bg-gradient-to-r from-primary/20 via-primary/10 to-primary/5 text-primary font-extrabold tracking-tight text-base px-4 whitespace-nowrap">
        {ctx?.store()?.name}
      </ImageFallback>
    </Image>
  )
}

export const StoreFavicon = () => {
  const store = useStore()

  const faviconHref = createMemo(() => {
    const s = store?.store()
    if (s?.faviconUrl) return s.faviconUrl
    if (s?.logoUrl) return s.logoUrl
    if (s?.name) {
      const char = s.name.charAt(0).toUpperCase()
      return `data:image/svg+xml,${encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
          <text x="16" y="28" text-anchor="middle" fill="currentColor" font-size="33" font-family="sans-serif" font-weight="600">
                 ${char}
           </text>
        </svg>`
      )}`
    }
    return "/favicon.ico"
  })

  return (<Link rel="icon" href={faviconHref()} />)
}

