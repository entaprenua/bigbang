import { splitProps, Match, Switch, type JSX } from "solid-js"
import { cn } from "~/lib/utils"
import { useCollectionItem } from "./collection"
import type { ProductMedia } from "~/lib/types"

export type MediaItemType = "image" | "video" | "audio" | "document" | "file"

export const detectMediaType = (src?: string): MediaItemType => {
  if (!src) return "image"
  const ext = src.split(".").pop()?.toLowerCase()?.split("?")[0]
  const imageExts = ["jpg", "jpeg", "png", "gif", "webp", "svg", "bmp", "ico", "avif"]
  const videoExts = ["mp4", "webm", "ogg", "mov", "avi", "mkv", "m4v"]
  const audioExts = ["mp3", "wav", "ogg", "aac", "flac", "m4a", "wma"]
  if (ext && imageExts.includes(ext)) return "image"
  if (ext && videoExts.includes(ext)) return "video"
  if (ext && audioExts.includes(ext)) return "audio"
  return "image"
}

export type MediaItemProps = {
  src?: string
  type?: MediaItemType
  alt?: string
  class?: string
  autoplay?: boolean
  controls?: boolean
  loop?: boolean
  muted?: boolean
  poster?: string
}

export const MediaItem = (props: MediaItemProps) => {
  const [local, others] = splitProps(props, [
    "src", "type", "alt", "class", "autoplay", "controls", "loop", "muted", "poster"
  ])

  const collectionItem = useCollectionItem()
  const mediaItem = () => collectionItem?.item as ProductMedia | undefined

  const src = () => local.src ?? mediaItem()?.url
  const alt = () => local.alt ?? mediaItem()?.alt
  const type = () => local.type ?? mediaItem()?.type ?? detectMediaType(src())

  return (
    <Switch fallback={
      <img src={src()} alt={alt() ?? ""} class={cn("size-full object-cover", local.class)} />
    }>
      <Match when={type() === "video"}>
        <video
          src={src()}
          class={local.class}
          autoplay={local.autoplay}
          controls={local.controls}
          loop={local.loop}
          muted={local.muted}
          poster={local.poster}
          {...others}
        />
      </Match>
      <Match when={type() === "audio"}>
        <audio
          src={src()}
          class={local.class}
          autoplay={local.autoplay}
          controls={local.controls}
          loop={local.loop}
          muted={local.muted}
          {...others}
        />
      </Match>
    </Switch>
  )
}
