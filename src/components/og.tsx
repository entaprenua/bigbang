import { Meta, Title } from "@solidjs/meta"
import { useStore } from "~/components/ui/store"

type OGMetaProps = {
  title?: string | null
  description?: string | null
  image?: string
  url?: string
  type?: string
}

function ogImageUrl(title: string, description: string): string {
  const params = new URLSearchParams({
    title: title.slice(0, 100),
    description: description.slice(0, 300),
  })
  return `/api/og-image?${params}`
}

export function OGMeta(props: OGMetaProps) {
  const ctx = useStore()
  const title = () => props.title ?? ctx?.store()?.name ?? "Store"
  const description = () => props.description ?? ctx?.store()?.description ?? ""
  const image = () =>
    props.image || (description()
      ? ogImageUrl(title(), description())
      : "/api/og-image?title=" + encodeURIComponent(title()))
  const url = () => props.url || (typeof window !== "undefined" ? window.location.href : "")
  const type = () => props.type || "website"

  return (
    <>
      <Title>{title()}</Title>
      <Meta property="og:title" content={title()} />
      <Meta property="og:description" content={description()} />
      <Meta property="og:image" content={image()} />
      <Meta property="og:url" content={url()} />
      <Meta property="og:type" content={type()} />
      <Meta property="og:site_name" content={title()} />
      <Meta name="twitter:card" content="summary_large_image" />
      <Meta name="twitter:title" content={title()} />
      <Meta name="twitter:description" content={description()} />
      <Meta name="twitter:image" content={image()} />
    </>
  )
}
