import { type JSX } from "solid-js"
import { Collection, useCollectionItem } from "~/components/ui/collection"
import { MediaItem } from "~/components/ui/media"
import type { Review, ReviewMedia } from "~/lib/generated/graphql"

const ProductReviewListItemMediaItem = MediaItem

type ProductReviewListItemMediaProps = {
  children?: JSX.Element
}

const ProductReviewListItemMedia = (props: ProductReviewListItemMediaProps) => {
  const item = useCollectionItem()
  const review = () => item?.item as Review | undefined
  const media = () => (review()?.media as ReviewMedia[]) ?? []

  return (
    <Collection data={media()}>
      {props.children}
    </Collection>
  )
}

export {
  ProductReviewListItemMedia,
  ProductReviewListItemMediaItem,
}
export type {
  ProductReviewListItemMediaProps,
}
