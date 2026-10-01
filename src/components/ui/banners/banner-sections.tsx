import { Show, splitProps, type JSX } from "solid-js"
import { A } from "@solidjs/router"
import { useBanner } from "./banner-context"
import { useCollectionItem } from "../collection"
import { cn } from "~/lib/utils"
import type { Banner } from "~/lib/types"

const useBannerData = (): (() => Banner | undefined) => {
  const collectionItem = useCollectionItem()
  if (collectionItem) return () => collectionItem.item as Banner

  const bannerCtx = useBanner()
  return bannerCtx.data as unknown as () => Banner | undefined
}

type BannerTitleProps = {
  class?: string
}

const BannerTitle = (props: BannerTitleProps) => {
  const banner = useBannerData()
  return (
    <span class={props.class}>
      {banner()?.title}
    </span>
  )
}

type BannerSubtitleProps = {
  class?: string
}

const BannerSubtitle = (props: BannerSubtitleProps) => {
  const banner = useBannerData()
  return (
    <span class={props.class}>
      {banner()?.subtitle}
    </span>
  )
}

type BannerCtaTextProps = {
  class?: string
}

const BannerCtaText = (props: BannerCtaTextProps) => {
  const banner = useBannerData()
  return (
    <span class={props.class}>
      {banner()?.ctaText}
    </span>
  )
}

type BannerImageProps = {
  class?: string
  alt?: string
}

const BannerImage = (props: BannerImageProps) => {
  const [local] = splitProps(props, ["class", "alt"])
  const banner = useBannerData()
  const image = () =>
    banner()?.image ??
    banner()?.product?.image ??
    banner()?.category?.image ??
    null
  const src = () => image()?.src
  const alt = () => local.alt ?? image()?.alt ?? banner()?.title ?? "Banner image"

  return (
    <Show when={src()}>
      <img
        src={src()!}
        alt={alt()}
        class={cn("size-full object-cover", local.class)}
      />
    </Show>
  )
}

type BannerCtaLinkProps = {
  class?: string
  children?: JSX.Element
}

const BannerCtaLink = (props: BannerCtaLinkProps) => {
  const banner = useBanner()
  const href = () => banner.href()
  const isLeaf = () => banner.children().length === 0

  return (
    <Show
      when={href() && !isLeaf()}
      fallback={<span class={props.class}>{props.children}</span>}
    >
      <A href={href()!} class={props.class}>
        {props.children}
      </A>
    </Show>
  )
}

export type {
  BannerTitleProps,
  BannerSubtitleProps,
  BannerCtaTextProps,
  BannerImageProps,
  BannerCtaLinkProps,
}

export {
  BannerTitle,
  BannerSubtitle,
  BannerCtaText,
  BannerImage,
  BannerCtaLink,
}