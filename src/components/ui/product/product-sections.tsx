import { Show, splitProps, type JSX, createMemo } from "solid-js"
import { A, useNavigate } from "@solidjs/router"
import { useProduct } from "./product-context"
import { useProductVariantOptional } from "./product-variant"
import { useCart } from "../cart/cart-context"
import { useWishlist } from "../wishlist/wishlist-context"
import { Button, type ButtonProps } from "../button"
import { Flex } from "../flex"

import { Select } from "../select"
import { cn } from "~/lib/utils"


type ImgProps = JSX.ImgHTMLAttributes<HTMLImageElement>

type ProductActionProps = Omit<ButtonProps<"button">, "onClick"> & {
  onClick?: (e: MouseEvent) => void
  href?: string
  children?: JSX.Element
}

const ProductActionWrapper = (props: { children?: JSX.Element; class?: string }) => {
  return (
    <div
      onClick={(e) => {
        e.stopPropagation()
        e.preventDefault()
      }}
      class={props.class}
    >
      {props.children}
    </div>
  )
}

const ProductName = () => {
  const product = useProduct()
  return (
    <Show when={product?.data.name}>
      {product!.data.name}
    </Show>
  )
}

const ProductDescription = () => {
  const product = useProduct()
  return (
    <Show when={product?.data.description}>
      {product!.data.description}
    </Show>
  )
}

const ProductSku = () => {
  const product = useProduct()
  const variantCtx = useProductVariantOptional()
  const sku = () => variantCtx?.selectedVariant()?.sku ?? product?.data?.variants?.[0]?.sku
  return (
    <Show when={sku()}>
      {sku()}
    </Show>
  )
}

const ProductPrice = () => {
  const product = useProduct()
  const variantCtx = useProductVariantOptional()
  const price = () => variantCtx?.selectedVariant()?.price ?? product?.data?.variants?.[0]?.price ?? product?.data?.priceRange?.min
  return (
    <Show when={price()}>
      {price()}
    </Show>
  )
}

const ProductComparePrice = () => {
  const product = useProduct()
  const variantCtx = useProductVariantOptional()
  const comparePrice = () => variantCtx?.selectedVariant()?.compareToPrice ?? product?.data?.variants?.[0]?.compareToPrice
  return (
    <Show when={comparePrice()}>
      {comparePrice()}
    </Show>
  )
}

type ProductDiscountProps = {
  percentage?: boolean
}

const ProductDiscount = (props: ProductDiscountProps) => {
  const [local] = splitProps(props, ["percentage"])
  const product = useProduct()
  const variantCtx = useProductVariantOptional()
  const discount = createMemo(() => {
    const v = variantCtx?.selectedVariant()
    const fallback = product?.data?.variants?.[0]
    const price = parseFloat(v?.price ?? fallback?.price ?? "")
    const compare = parseFloat(v?.compareToPrice ?? fallback?.compareToPrice ?? "")
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

const ProductQuantity = () => {
  const product = useProduct()
  return (
    <>{String(product?.data.quantity ?? 1)}</>
  )
}

type ProductStatusBadgeProps = {
  children?: JSX.Element
}

const ProductInStockBadge = (props: ProductStatusBadgeProps) => {
  const product = useProduct()
  return (
    <Show when={product?.getStockStatus() === "in_stock"}>
      {props.children}
    </Show>
  )
}

const ProductLowStockBadge = (props: ProductStatusBadgeProps) => {
  const product = useProduct()
  return (
    <Show when={product?.getStockStatus() === "low_stock"}>
      {props.children}
    </Show>
  )
}

const ProductOutOfStockBadge = (props: ProductStatusBadgeProps) => {
  const product = useProduct()
  return (
    <Show when={product?.getStockStatus() === "out_of_stock"}>
      {props.children}
    </Show>
  )
}

const ProductStockCount = () => {
  const product = useProduct()

  const availableQty = createMemo(() => product?.getAvailableQuantity() ?? -1)

  return (
    <Show when={availableQty() >= 0}>
      {availableQty()}
    </Show>
  )
}

const ProductImage = (props: ImgProps) => {
  const product = useProduct()
  const variantCtx = useProductVariantOptional()
  const src = () => variantCtx?.selectedVariant()?.image ?? product?.data?.variants?.[0]?.image ?? product?.data?.media?.find(m => m.type === "image")?.url
  return (
    <Show when={src()}>
      <img src={src()!} alt={props.alt ?? product!.data.name ?? ""} {...props} />
    </Show>
  )
}

const ProductAddToCartTrigger = (props: ProductActionProps) => {
  const [local, others] = splitProps(props, ["class", "href", "onClick", "children"])
  const product = useProduct()
  const variantCtx = useProductVariantOptional()

  let cart: ReturnType<typeof useCart> | undefined
  try {
    cart = useCart()
  } catch {
    return (
      <ProductActionWrapper>
        <Button variant="ghost" class={cn("p-1", local.class)} disabled>
          Add to Cart
        </Button>
      </ProductActionWrapper>
    )
  }

  const handleClick = (e: MouseEvent) => {
    local.onClick?.(e)
    if (cart && product?.data) {
      const v = variantCtx?.selectedVariant()
      const fallback = product.data.variants?.[0]
      const price = v?.price ? parseFloat(v.price) : (fallback?.price ? parseFloat(fallback.price) : 0)
      const variantId = v?.id ?? fallback?.id ?? product.data.id
      if (variantId) {
        cart.addItem({
          productId: variantId,
          name: product.data.name,
          price,
          image: v?.image ?? fallback?.image ?? undefined,
          quantity: product.data.quantity ?? 1,
        })
      }
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
        {local.children ?? "Add to Cart"}
      </Button>
    </ProductActionWrapper>
  )
}

const ProductRemoveFromCartTrigger = (props: ProductActionProps) => {
  const [local, others] = splitProps(props, ["class", "href", "onClick", "children"])
  const product = useProduct()
  const variantCtx = useProductVariantOptional()

  let cart: ReturnType<typeof useCart> | undefined
  try {
    cart = useCart()
  } catch {
    return null
  }

  const handleClick = (e: MouseEvent) => {
    local.onClick?.(e)
    if (product?.data && cart) {
      const v = variantCtx?.selectedVariant()
      const fallback = product.data.variants?.[0]
      const variantId = v?.id ?? fallback?.id ?? product.data.id
      if (variantId) {
        cart.removeItem(variantId)
      }
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
        {local.children ?? "Remove"}
      </Button>
    </ProductActionWrapper>
  )
}

const ProductAddToWishlistTrigger = (props: ProductActionProps) => {
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
    if (wishlist && product?.data) {
      wishlist.addItem(product.data.id)
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

const ProductRemoveFromWishlistTrigger = (props: ProductActionProps) => {
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
    if (product?.data?.id && wishlist) {
      wishlist.removeItem(product.data.id)
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

const ProductToggleWishlistTrigger = (props: ProductActionProps) => {
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
    if (!product?.data?.id || !wishlist) return false
    return wishlist.hasProduct(product.data.id)
  })

  const handleClick = (e: MouseEvent) => {
    local.onClick?.(e)
    if (!product?.data?.id || !wishlist) return

    if (isInWishlist()) {
      wishlist.removeItem(product.data.id)
    } else {
      wishlist.addItem(product.data.id)
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

const ProductOrderTrigger = (props: ProductActionProps) => {
  const [local, others] = splitProps(props, ["class", "href", "onClick", "children"])
  const product = useProduct()
  const variantCtx = useProductVariantOptional()
  const navigate = useNavigate()

  const handleClick = (e: MouseEvent) => {
    local.onClick?.(e)
    if (!product?.data?.id) return

    const v = variantCtx?.selectedVariant()
    const variantId = v?.id ?? product.data.variants?.[0]?.id

    const params = new URLSearchParams()
    params.set("productId", product.data.id)
    if (variantId) params.set("variantId", variantId)

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

const ProductQuantityDecrementTrigger = (props: ProductActionProps) => {
  const [local, others] = splitProps(props, ["class", "href", "onClick", "children"])
  const product = useProduct()

  const handleDecrement = (e: MouseEvent) => {
    local.onClick?.(e)
    if (!product) return
    const currentQty = product.data.quantity ?? 1
    if (currentQty > 1) {
      product.update({ quantity: currentQty - 1 })
    }
  }

  return (
    <ProductActionWrapper>
      <Button
        variant="ghost"
        class={cn("p-1 w-8", local.class)}
        onClick={handleDecrement}
        {...others}
      >
        {local.children ?? "−"}
      </Button>
    </ProductActionWrapper>
  )
}

const ProductQuantityIncrementTrigger = (props: ProductActionProps) => {
  const [local, others] = splitProps(props, ["class", "href", "onClick", "children"])
  const product = useProduct()

  const handleIncrement = (e: MouseEvent) => {
    local.onClick?.(e)
    if (!product) return
    const currentQty = product.data.quantity ?? 1
    product.update({ quantity: currentQty + 1 })
  }

  return (
    <ProductActionWrapper>
      <Button
        variant="ghost"
        class={cn("p-1 w-8", local.class)}
        onClick={handleIncrement}
        {...others}
      >
        {local.children ?? "+"}
      </Button>
    </ProductActionWrapper>
  )
}

const ProductQuantityInput = (props: { class?: string } & JSX.IntrinsicElements["input"]) => {
  const [local, others] = splitProps(props, ["class", "value", "onInput", "onClick"])
  const product = useProduct()

  const handleChange = (e: Event) => {
    const target = e.currentTarget as HTMLInputElement
    const value = parseInt(target.value)
    const qty = isNaN(value) || value < 1 ? 1 : value
    product?.update({ quantity: qty })
  }

  return (
    <ProductActionWrapper>
      <input
        type="number"
        value={product?.data.quantity ?? 1}
        onInput={handleChange}
        onClick={(e) => e.stopPropagation()}
        class={cn("w-16 h-8 text-center border rounded", local.class)}
        {...others}
      />
    </ProductActionWrapper>
  )
}

const ProductQuantityActions = (props: { class?: string }) => {
  return (
    <Flex
      flexDirection="row"
      class={cn(
        "ring ring-1 ring-primary rounded-lg h-8 items-center",
        props.class
      )}
    >
      <ProductQuantityDecrementTrigger />
      <ProductQuantityInput class="flex-1" />
      <ProductQuantityIncrementTrigger />
    </Flex>
  )
}

type ProductQuantitySelectProps = {
  options?: string[]
  class?: string
  children?: JSX.Element
}

const ProductQuantitySelect = (props: ProductQuantitySelectProps) => {
  const [local] = splitProps(props, ['options', 'class', 'children'])
  const product = useProduct()

  const max = () => product?.getAvailableQuantity() ?? 10
  const cur = () => product?.data.quantity ?? 1

  const defaultOptions = createMemo(() => {
    const count = max()
    const qty = cur()
    const set = new Set<number>()
    for (const n of [1, 2, 3, 4, 5, 10, 15, 20, 25, 50]) {
      if (n <= count) set.add(n)
    }
    if (qty <= count && qty >= 1) set.add(qty)
    if (count >= 1) set.add(count)
    return [...set].sort((a, b) => a - b).map(String)
  })

  const options = () => local.options ?? defaultOptions()

  return (
    <Select<string>
      options={options()}
      value={String(cur())}
      onChange={(v) => product?.update({ quantity: parseInt(v) })}
      class={local.class}
    >
      {local.children}
    </Select>
  )
}

type ProductBackLinkProps = {
  href: string
  class?: string
  children?: JSX.Element
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
  ProductQuantity,
  ProductInStockBadge,
  ProductLowStockBadge,
  ProductOutOfStockBadge,
  ProductStockCount,
  ProductImage,
  ProductAddToCartTrigger,
  ProductRemoveFromCartTrigger,
  ProductAddToWishlistTrigger,
  ProductRemoveFromWishlistTrigger,
  ProductToggleWishlistTrigger,
  ProductOrderTrigger,
  ProductQuantityDecrementTrigger,
  ProductQuantityIncrementTrigger,
  ProductQuantityInput,
  ProductQuantityActions,
  ProductQuantitySelect,
  ProductBackLink,
  ProductActionWrapper,
}

export type {
  ProductActionProps,
  ProductDiscountProps,
}
