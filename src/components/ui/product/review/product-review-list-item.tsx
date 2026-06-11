import { type JSX, Show } from "solid-js"
import { useCollectionItem } from "~/components/ui/collection"
import {
  RatingGroup,
  RatingGroupControl,
  RatingGroupItems,
  RatingGroupItem,
  RatingGroupItemControl,
  RatingGroupLabel,
  RatingGroupHiddenInput,
  RatingGroupDescription,
  RatingGroupErrorMessage,
} from "~/components/ui/rating-group"
import type { Review } from "~/lib/generated/graphql"

type ProductReviewListItemProps = {
  children?: JSX.Element
}

const ProductReviewListItem = (props: ProductReviewListItemProps) => {
  return <>{props.children}</>
}

type ProductReviewListItemStarsProps = {
  readOnly?: boolean
  children?: JSX.Element
}

const ProductReviewListItemStars = (props: ProductReviewListItemStarsProps) => {
  const item = useCollectionItem()
  const review = () => item?.item as Review | undefined
  const rating = () => review()?.rating ?? 0

  return (
    <RatingGroup value={rating()} readOnly={props.readOnly ?? true}>
      {props.children ?? (
        <RatingGroupControl>
          <RatingGroupItems>
            <RatingGroupItem>
              <RatingGroupItemControl />
            </RatingGroupItem>
          </RatingGroupItems>
        </RatingGroupControl>
      )}
    </RatingGroup>
  )
}

const ProductReviewListItemAuthor = () => {
  const item = useCollectionItem()
  const review = () => item?.item as Review | undefined
  return <>{review()?.authorName}</>
}

const ProductReviewListItemDate = () => {
  const item = useCollectionItem()
  const review = () => item?.item as Review | undefined
  const date = () => {
    const createdAt = review()?.createdAt
    if (!createdAt) return ""
    return new Date(createdAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }
  return <>{date()}</>
}

const ProductReviewListItemComment = () => {
  const item = useCollectionItem()
  const review = () => item?.item as Review | undefined
  return (
    <Show when={review()?.comment}>
      {review()!.comment}
    </Show>
  )
}

export {
  ProductReviewListItem,
  ProductReviewListItemStars,
  ProductReviewListItemAuthor,
  ProductReviewListItemDate,
  ProductReviewListItemComment,
}
export type {
  ProductReviewListItemProps,
  ProductReviewListItemStarsProps,
}
