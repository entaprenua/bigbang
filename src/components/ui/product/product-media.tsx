import { splitProps, type JSX, createMemo } from "solid-js"
import { Collection } from "../collection"
import { useProduct } from "./product-root"
import { useProductVariantOptional } from "./product-variants"
import { MediaItem, detectMediaType, type MediaItemType, type MediaItemProps } from "../media"
import type { ProductMedia as ProductMediaType } from "~/lib/types"

type ProductMediaProps = {
  class?: string
  children?: JSX.Element
}

const ProductMedia = (props: ProductMediaProps) => {
  const product = useProduct()
  const variantCtx = useProductVariantOptional()
  const [local] = splitProps(props, ["children"])

  const mediaItems = createMemo(() => {
    const variantMedia = variantCtx?.selectedVariant()?.media as ProductMediaType[] | undefined
    return variantMedia ?? (product?.media as ProductMediaType[] | undefined)
  })

  return (
    <Collection data={mediaItems() ?? []}>
      {local.children}
    </Collection>
  )
}

export {
  ProductMedia,
  MediaItem as ProductMediaItem,
  detectMediaType,
}
export type { MediaItemType as ProductMediaItemType, MediaItemProps as ProductMediaItemProps }
