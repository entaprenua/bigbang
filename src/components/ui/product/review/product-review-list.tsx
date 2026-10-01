import { splitProps, type JSX, createMemo } from "solid-js"
import { Collection } from "~/components/ui/collection"
import { useProduct } from "~/components/ui/product/product-root"
import { reviewsApi } from "~/lib/api/reviews"
import type { Review, ReviewConnection } from "~/lib/generated/graphql"

type ProductReviewListProps = {
  productId?: string
  page?: number
  size?: number
  sortBy?: string
  queryKey?: unknown[]
  enabled?: boolean
  children?: JSX.Element
}

const ProductReviewList = (props: ProductReviewListProps) => {
  const [local] = splitProps(props, [
    "productId",
    "page",
    "size",
    "sortBy",
    "queryKey",
    "enabled",
    "children",
  ])

  const product = useProduct()

  const productId = () => local.productId ?? product?.id ?? ""

  const page = () => local.page ?? 0
  const size = () => local.size ?? 20
  const sortBy = () => local.sortBy

  const queryFn = async (): Promise<Review[] | null> => {
    const id = productId()
    if (!id) return null
    const response: ReviewConnection = await reviewsApi.getByProduct(
      id,
      page(),
      size(),
      sortBy(),
    )
    return response?.edges?.map(e => e.node) ?? null
  }

  const key = createMemo(() =>
    local.queryKey ?? ["reviews", "product", productId(), page(), size(), sortBy()],
  )

  return (
    <Collection
      queryFn={queryFn}
      queryKey={key()}
      enabled={local.enabled ?? true}
    >
      {local.children}
    </Collection>
  )
}


export {
  ProductReviewList,
}
export type { ProductReviewListProps }
