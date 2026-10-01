import { createContext, useContext, type Accessor, type JSX, createMemo } from "solid-js"
import type { Banner, Image } from "~/lib/types"

export type BannerProps = Partial<Banner>

export type BannerContextValue = {
  data: Accessor<BannerProps | null>
  id: Accessor<string | null>
  parentId: Accessor<string | null>
  name: Accessor<string | null>
  title: Accessor<string | null>
  subtitle: Accessor<string | null>
  ctaText: Accessor<string | null>
  image: Accessor<Image | null>
  link: Accessor<string | null>
  productId: Accessor<string | null>
  categoryId: Accessor<string | null>
  startsAt: Accessor<string | null>
  endsAt: Accessor<string | null>
  children: Accessor<Banner[]>
  href: Accessor<string | null>
  isRoot: Accessor<boolean>
}

const BannerContext = createContext<BannerContextValue>()

export const useBanner = (): BannerContextValue => {
  const ctx = useContext(BannerContext)
  if (!ctx) {
    throw new Error("useBanner must be used within BannerContext")
  }
  return ctx
}

export const useBannerOptional = (): BannerContextValue | undefined => {
  return useContext(BannerContext)
}

type BannerProviderProps = {
  data?: BannerProps | null
  children?: JSX.Element
}

export const BannerProvider = (props: BannerProviderProps) => {
  const data = createMemo(() => props.data ?? null)

  const id = createMemo(() => data()?.id ?? null)
  const parentId = createMemo(() => data()?.parentId ?? null)
  const name = createMemo(() => data()?.name ?? null)
  const title = createMemo(() => data()?.title ?? null)
  const subtitle = createMemo(() => data()?.subtitle ?? null)
  const ctaText = createMemo(() => data()?.ctaText ?? null)
  const image = createMemo(() => data()?.image ?? null)
  const link = createMemo(() => data()?.link ?? null)
  const productId = createMemo(() => data()?.productId ?? null)
  const categoryId = createMemo(() => data()?.categoryId ?? null)
  const startsAt = createMemo(() => data()?.startsAt ?? null)
  const endsAt = createMemo(() => data()?.endsAt ?? null)
  const children = createMemo(() => data()?.children ?? [])

  const href = createMemo(() => {
    const productSlug = data()?.product?.slug
    if (productSlug) return `/products/${productSlug}`
    const categorySlug = data()?.category?.slug
    if (categorySlug) return `/categories/${categorySlug}`
    return link() ?? null
  })

  const isRoot = createMemo(() => {
    return parentId() === null || parentId() === undefined
  })

  const contextValue: BannerContextValue = {
    data,
    id,
    parentId,
    name,
    title,
    subtitle,
    ctaText,
    image,
    link,
    productId,
    categoryId,
    startsAt,
    endsAt,
    children,
    href,
    isRoot,
  }

  return (
    <BannerContext.Provider value={contextValue}>
      {props.children}
    </BannerContext.Provider>
  )
}

export { BannerContext }
export type { BannerProviderProps }
