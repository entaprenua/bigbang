import { Show, splitProps, type JSX, createMemo } from "solid-js"
import { A, useNavigate } from "@solidjs/router"
import { useProduct } from "./product-root"
import { useResolvedProduct } from "./hooks"

export type ProductStockStatus = "in_stock" | "low_stock" | "out_of_stock" | "backorder" | "not_tracked"
import { useCart } from "../cart/cart-context"
import { useWishlist } from "../wishlist/wishlist-context"
import { Button, type ButtonProps } from "../button"
import { Flex } from "../flex"

import { cn } from "~/lib/utils"
import { MutationProvider } from "../query"

type ImgProps = JSX.ImgHTMLAttributes<HTMLImageElement>

type ProductActionProps = Omit<ButtonProps<"button">, "onClick"> & {
  onClick?: (e: MouseEvent) => void
  href?: string
  children?: JSX.Element
}

type ProductActionWrapperProps = {
  children?: JSX.Element
  class?: string
}

const ProductActionWrapper = (props: ProductActionWrapperProps & JSX.HTMLAttributes<HTMLDivElement>) => {
  const [local, others] = splitProps(props, ["children", "class"])
  return (
    <div
      onClick={(e) => {
        e.stopPropagation()
        e.preventDefault()
      }}
      class={local.class}
      {...others}
    >
      {local.children}
    </div>
  )
}

const ProductName = () => {
  const product = useProduct()
  return (
    <Show when={product.name}>
      {product.name}
    </Show>
  )
}

const ProductDescription = () => {
  const product = useProduct()
  return (
    <Show when={product.description}>
      {product.description}
    </Show>
  )
}

const ProductSku = () => {
  const p = useResolvedProduct()
  return (
    <Show when={p()?.sku}>
      {p()!.sku}
    </Show>
  )
}

const ProductPrice = () => {
  const p = useResolvedProduct()
  return (
    <Show when={p()?.price}>
      {p()!.price}
    </Show>
  )
}

const ProductComparePrice = () => {
  const p = useResolvedProduct()
  return (
    <Show when={p()?.compareToPrice}>
      {p()!.compareToPrice}
    </Show>
  )
}

type ProductDiscountProps = {
  percentage?: boolean
}

const ProductDiscount = (props: ProductDiscountProps) => {
  const [local] = splitProps(props, ["percentage"])
  const p = useResolvedProduct()
  const discount = createMemo(() => {
    const price = parseFloat(p()?.price ?? "")
    const compare = parseFloat(p()?.compareToPrice ?? "")
    if (isNaN(price) || isNaN(compare) || compare <= price) return null
    if (local.percentage) {
      return Math.round((1 - price / compare) * 100)
    }
    return compare - price
  })
  return (
    <Show when={discount() !== null}>
      {discount()}
    </Show>
  )
}

type ProductStatusBadgeProps = {
  children?: JSX.Element
}

const ProductInStockBadge = (props: ProductStatusBadgeProps) => {
  const p = useResolvedProduct()
  return (
    <Show when={p()?.stockStatus === "in_stock"}>
      {props.children}
    </Show>
  )
}

const ProductLowStockBadge = (props: ProductStatusBadgeProps) => {
  const p = useResolvedProduct()
  return (
    <Show when={p()?.stockStatus === "low_stock"}>
      {props.children}
    </Show>
  )
}

const ProductOutOfStockBadge = (props: ProductStatusBadgeProps) => {
  const p = useResolvedProduct()
  return (
    <Show when={p()?.stockStatus === "out_of_stock"}>
      {props.children}
    </Show>
  )
}

const ProductStockCount = () => {
  const p = useResolvedProduct()
  return (
    <Show when={(p()?.stockQuantity ?? -1) >= 0}>
      {p()!.stockQuantity}
    </Show>
  )
}

const ProductImage = (props: ImgProps) => {
  const product = useProduct()
  const p = useResolvedProduct()
  const src = () => p()?.image
    ?? product?.media?.find(m => m.type === "image")?.url
  return (
    <Show when={src()}>
      <img src={src()!} alt={props.alt ?? product!.name ?? ""} {...props} />
    </Show>
  )
}

const ProductAddToCart = (props: { children?: JSX.Element }) => {
  const p = useResolvedProduct()
  const cart = useCart()

  const handleClick = async () => {
    const resolved = p()
    if (!resolved?.id) return
    const existing = cart.find(resolved.id)
    if (existing) {
      await cart.updateQuantity({ productId: resolved.id, quantity: existing.quantity + 1 })
    } else {
      await cart.addItem({
        productId: resolved.id,
        name: resolved.name ?? "",
        price: parseFloat(resolved.price ?? "0"),
        image: resolved.image ?? undefined,
        quantity: 1,
      })
    }
  }

  return (
    <ProductActionWrapper>
      <MutationProvider mutationFn={handleClick}>
        {props.children}
      </MutationProvider>
    </ProductActionWrapper>
  )
}

const ProductAddToWishlist = (props: ProductActionProps) => {
  const [local, others] = splitProps(props, ["class", "href", "onClick", "children"])
  const product = useProduct()

  let wishlist: ReturnType<typeof useWishlist> | undefined
  try {
    wishlist = useWishlist()
  } catch {
    return (
      <ProductActionWrapper>
        <Button variant="ghost" class={cn("p-1", local.class)} disabled>
          Add to Wishlist
        </Button>
      </ProductActionWrapper>
    )
  }

  const handleClick = (e: MouseEvent) => {
    local.onClick?.(e)
    if (wishlist && product) {
      wishlist.addItem(product.id)
    }
  }

  return (
    <ProductActionWrapper>
      <Button
        variant="ghost"
        class={cn("p-1", local.class)}
        onClick={handleClick}
        {...others}
      >
        {local.children ?? "Add to Wishlist"}
      </Button>
    </ProductActionWrapper>
  )
}

const ProductRemoveFromWishlist = (props: ProductActionProps) => {
  const [local, others] = splitProps(props, ["class", "href", "onClick", "children"])
  const product = useProduct()

  let wishlist: ReturnType<typeof useWishlist> | undefined
  try {
    wishlist = useWishlist()
  } catch {
    return null
  }

  const handleClick = (e: MouseEvent) => {
    local.onClick?.(e)
    if (product?.id && wishlist) {
      wishlist.removeItem(product.id)
    }
  }

  return (
    <ProductActionWrapper>
      <Button
        variant="ghost"
        class={cn("p-1", local.class)}
        onClick={handleClick}
        {...others}
      >
        {local.children ?? "Remove from Wishlist"}
      </Button>
    </ProductActionWrapper>
  )
}

const ProductToggleWishlist = (props: ProductActionProps) => {
  const [local, others] = splitProps(props, ["class", "href", "onClick", "children"])
  const product = useProduct()

  let wishlist: ReturnType<typeof useWishlist> | undefined
  try {
    wishlist = useWishlist()
  } catch {
    return (
      <ProductActionWrapper>
        <Button variant="ghost" class={cn("p-1", local.class)} disabled>
          Wishlist
        </Button>
      </ProductActionWrapper>
    )
  }

  const isInWishlist = createMemo(() => {
    if (!product?.id || !wishlist) return false
    return wishlist.hasProduct(product.id)
  })

  const handleClick = (e: MouseEvent) => {
    local.onClick?.(e)
    if (!product?.id || !wishlist) return

    if (isInWishlist()) {
      wishlist.removeItem(product.id)
    } else {
      wishlist.addItem(product.id)
    }
  }

  return (
    <ProductActionWrapper>
      <Button
        variant="ghost"
        class={cn("p-1", local.class)}
        onClick={handleClick}
        {...others}
      >
        {local.children ?? (isInWishlist() ? "Remove from Wishlist" : "Add to Wishlist")}
      </Button>
    </ProductActionWrapper>
  )
}

const ProductOrder = (props: ProductActionProps) => {
  const [local, others] = splitProps(props, ["class", "href", "onClick", "children"])
  const p = useResolvedProduct()
  const navigate = useNavigate()

  const handleClick = (e: MouseEvent) => {
    local.onClick?.(e)
    const resolved = p()
    if (!resolved?.id) return

    const params = new URLSearchParams()
    params.set("productId", resolved.id)

    navigate(`${local.href ?? "/checkout"}?${params.toString()}`)
  }

  return (
    <ProductActionWrapper>
      <Button
        variant="ghost"
        class={cn("p-1", local.class)}
        onClick={handleClick}
        {...others}
      >
        {local.children ?? "Order Now"}
      </Button>
    </ProductActionWrapper>
  )
}

type ProductBackLinkProps = {
  href: string
  class?: string
  children?: JSX.Element
}

const ProductCartQuantity = () => {
  const p = useResolvedProduct()
  const cart = useCart()
  const quantity = createMemo(() => {
    const resolved = p()
    if (!resolved?.id) return 0
    return cart.find(resolved.id)?.quantity ?? 0
  })
  return <>{quantity()}</>
}

const ProductBackLink = (props: ProductBackLinkProps) => {
  return (
    <A href={props.href} class={props.class}>
      {props.children ?? "← Back"}
    </A>
  )
}

export {
  ProductName,
  ProductDescription,
  ProductSku,
  ProductPrice,
  ProductComparePrice,
  ProductDiscount,
  ProductInStockBadge,
  ProductLowStockBadge,
  ProductOutOfStockBadge,
  ProductStockCount,
  ProductImage,
  ProductAddToCart,
  ProductCartQuantity,
  ProductAddToWishlist,
  ProductRemoveFromWishlist,
  ProductToggleWishlist,
  ProductOrder,
  ProductBackLink,
  ProductActionWrapper,
}

export type {
  ProductActionProps,
  ProductActionWrapperProps,
  ProductDiscountProps,
}
