import { Show, splitProps, type JSX, type ComponentProps, createMemo } from "solid-js"
import { useCart, type CartItemContextData } from "./cart-context"
import { Button, type ButtonProps } from "../button"
import { Text } from "../text"
import { Flex } from "../flex"
import { Link } from "../link"
import { cn } from "~/lib/utils"
import { Collection, useCollectionItem } from "../collection"
import { MutationProvider, MutationButton } from "../query"
import { Select } from "../select"
import { useResolvedProduct } from "../product/hooks"
import { useQuantityUpdate } from "./hooks"

// ============================================================================
// Cart Items List
// ============================================================================

export type CartItemsProps = {
  class?: string
  children?: JSX.Element
}

export const CartItems = (props: CartItemsProps) => {
  const cart = useCart()
  const [local] = splitProps(props, ["class", "children"])

  return (
    <Collection data={cart.items}>
      {local.children}
    </Collection>

  )
}

// ============================================================================
// Cart Item Checkbox
// ============================================================================

export const CartItemCheckbox = (props: { class?: string }) => {
  const cart = useCart()
  const collectionItem = useCollectionItem()
  const item = () => collectionItem?.item as CartItemContextData | undefined
  return (
    <input
      type="checkbox"
      checked={item()?.selected ?? false}
      class={cn("size-5", props.class)}
      onChange={() => item()?.id && cart.toggleSelected(item()!.id)}
    />
  )
}

// ============================================================================
// Cart Icon with Badge
// ============================================================================

export const CartIcon = (props: { class?: string }) => {
  const cart = useCart()

  return (
    <Link href="/store/cart" class={cn("relative inline-flex", props.class)}>
      <Button variant="ghost">
        <svg xmlns="http://www.w3.org/2000/svg" class="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      </Button>
      <Show when={cart.count() > 0}>
        <span class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {cart.count()}
        </span>
      </Show>
    </Link>
  )
}

// ============================================================================
// Cart Summary
// ============================================================================

export type CartSummaryProps = {
  class?: string
  children?: JSX.Element
}

export const CartSummary = (props: CartSummaryProps) => {
  const cart = useCart()

  return (
    <Show when={!cart.isEmpty()}>
      <div class={cn("space-y-4", props.class)}>
        {props.children ?? <DefaultCartSummary />}
      </div>
    </Show>
  )
}

const DefaultCartSummary = () => {
  const cart = useCart()

  return (
    <>
      <Flex class="justify-between">
        <Text>Subtotal</Text>
        <Text class="font-medium">${cart.subtotal().toFixed(2)}</Text>
      </Flex>
      <Flex class="justify-between">
        <Text>Items</Text>
        <Text>{cart.count()}</Text>
      </Flex>
      <div class="border-t pt-4">
        <Flex class="justify-between">
          <Text class="font-bold">Total</Text>
          <Text class="font-bold text-lg">${cart.subtotal().toFixed(2)}</Text>
        </Flex>
      </div>
    </>
  )
}

// ============================================================================
// Cart Empty
// ============================================================================

export type CartEmptyProps = {
  class?: string
  children?: JSX.Element
}

export const CartEmpty = (props: CartEmptyProps) => {
  const cart = useCart()

  return (
    <Show when={cart.isEmpty()}>
      <div class={cn("flex flex-col items-center justify-center min-h-[30vh] gap-2", props.class)}>
        {props.children ?? (
          <>
            <Text variant="h3" class="text-muted-foreground">Your cart is empty</Text>
            <Text variant="body2" class="text-muted-foreground">Add some products to get started</Text>
          </>
        )}
      </div>
    </Show>
  )
}

// ============================================================================
// Cart Count
// ============================================================================

export const CartCount = () => {
  const cart = useCart()
  return <>{cart.count()}</>
}

// ============================================================================
// Cart Subtotal
// ============================================================================

export const CartSubtotal = () => {
  const cart = useCart()
  return <>{cart.subtotal().toFixed(2)}</>
}

export const CartSelectedSubtotal = () => {
  const cart = useCart()
  return <>{cart.selectedSubtotal().toFixed(2)}</>
}

// ============================================================================
// Cart Checkout Trigger
// ============================================================================

export type CartCheckoutTriggerProps = ComponentProps<typeof Button>

export const CartCheckoutTrigger = (rawProps: CartCheckoutTriggerProps) => {
  const cart = useCart()
  const [local, others] = splitProps(rawProps, ["children", "onClick"])

  return (
    <Show when={!cart.isEmpty()}>
      <Button
        as={Link}
        onClick={local.onClick}
        {...others}
      >
        {local.children ?? "Proceed to Checkout"}
      </Button>
    </Show>
  )
}

// ============================================================================
// Cart Clear Trigger
// ============================================================================

export type CartClearTriggerProps = ComponentProps<typeof Button>

export const CartClearTrigger = (rawProps: CartClearTriggerProps) => {
  const cart = useCart()
  const [local, others] = splitProps(rawProps, ["children", "onClick", "variant"])

  return (
    <Show when={!cart.isEmpty()}>
      <Button
        variant={local.variant ?? "outline"}
        onClick={(e) => {
          local.onClick?.(e)
          cart.clear()
        }}
        {...others}
      >
        {local.children ?? "Clear Cart"}
      </Button>
    </Show>
  )
}

// ============================================================================
// Cart Item Quantity Components
// ============================================================================

export type CartItemActionProps = Omit<ButtonProps<"button">, "onClick"> & {
  onClick?: (e: MouseEvent) => void
  href?: string
  children?: JSX.Element
}

export const CartItemActionWrapper = (props: { class?: string; children?: JSX.Element } & JSX.HTMLAttributes<HTMLDivElement>) => {
  const [local, others] = splitProps(props, ["children", "class"])
  return (
    <div
      onClick={(e) => { e.stopPropagation(); e.preventDefault() }}
      class={local.class}
      {...others}
    >
      {local.children}
    </div>
  )
}

export const CartItemQuantity = () => {
  const p = useResolvedProduct()
  const cart = useCart()
  return (
    <>{String(cart.find(p()?.id ?? "")?.quantity ?? 1)}</>
  )
}

export const CartItemQuantityDecrement = (props: { class?: string; children?: JSX.Element }) => {
  const p = useResolvedProduct()
  const cart = useCart()
  const updateQty = useQuantityUpdate()
  const handleClick = async () => {
    const resolved = p()
    if (!resolved?.id) return
    const cur = cart.find(resolved.id)?.quantity ?? 1
    await updateQty(Math.max(0, cur - 1))
  }

  return (
    <CartItemActionWrapper>
      <MutationProvider mutationFn={handleClick}>
        {props.children ?? (
          <MutationButton variant="ghost" class={cn("p-1 w-8", props.class)}>
            −
          </MutationButton>
        )}
      </MutationProvider>
    </CartItemActionWrapper>
  )
}

export const CartItemQuantityIncrement = (props: { class?: string; children?: JSX.Element }) => {
  const p = useResolvedProduct()
  const cart = useCart()
  const updateQty = useQuantityUpdate()
  const handleClick = async () => {
    const resolved = p()
    if (!resolved?.id) return
    const cur = (cart.find(resolved.id)?.quantity ?? 1) + 1
    await updateQty(cur)
  }

  return (
    <CartItemActionWrapper>
      <MutationProvider mutationFn={handleClick}>
        {props.children ?? (
          <MutationButton variant="ghost" class={cn("p-1 w-8", props.class)}>
            +
          </MutationButton>
        )}
      </MutationProvider>
    </CartItemActionWrapper>
  )
}

export const CartItemQuantityInput = (props: { class?: string } & JSX.IntrinsicElements["input"]) => {
  const [local, others] = splitProps(props, ["class", "value", "onInput", "onClick"])
  const p = useResolvedProduct()
  const cart = useCart()

  const displayQty = createMemo(() => {
    const resolved = p()
    if (!resolved) return 1
    return cart.find(resolved.id)?.quantity ?? 1
  })

  const updateQty = useQuantityUpdate()
  const handleChange = (e: Event) => {
    const target = e.currentTarget as HTMLInputElement
    const value = parseInt(target.value)
    const qty = isNaN(value) || value < 1 ? 1 : value
    const resolved = p()
    if (!resolved) return
    updateQty(qty)
  }

  return (
    <CartItemActionWrapper>
      <input
        type="number"
        value={displayQty()}
        onInput={handleChange}
        onClick={(e) => e.stopPropagation()}
        class={cn("w-16 h-8 text-center border rounded", local.class)}
        {...others}
      />
    </CartItemActionWrapper>
  )
}

export interface CartItemQuantityActionsProps {
  class?: string
  children?: JSX.Element
}

export const CartItemQuantityActions = (props: CartItemQuantityActionsProps) => {
  const [local, others] = splitProps(props, ["class"])
  return (
    <div
      class={cn(
        "hidden group-data-[in-cart]:flex ring ring-1 ring-primary rounded-lg h-8 items-center",
        local.class
      )}
      {...others}
    />
  )
}

export type CartItemQuantitySelectProps = {
  options?: string[]
  class?: string
  children?: JSX.Element
}

export const CartItemQuantitySelect = (props: CartItemQuantitySelectProps) => {
  const [local] = splitProps(props, ['options', 'class', 'children'])
  const p = useResolvedProduct()
  const cart = useCart()

  const max = () => {
    const resolved = p()
    return resolved?.stockQuantity ?? 10
  }

  const cur = createMemo(() => {
    const resolved = p()
    if (!resolved?.id) return 1
    return cart.find(resolved.id)?.quantity ?? 1
  })

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

  const updateQty = useQuantityUpdate()
  const handleChange = (v: string) => {
    const value = parseInt(v)
    const resolved = p()
    if (!resolved?.id) return
    updateQty(value)
  }

  return (
    <Select<string>
      options={options()}
      value={String(cur())}
      onChange={handleChange}
      class={local.class}
    >
      {local.children}
    </Select>
  )
}

// ============================================================================
// Cart Item Remove
// ============================================================================

export const CartItemRemove = (props: { class?: string; children?: JSX.Element }) => {
  const p = useResolvedProduct()
  const cart = useCart()

  const handleClick = async () => {
    const resolved = p()
    if (!resolved?.id) return
    await cart.remove({ productId: resolved.id })
  }

  return (
    <CartItemActionWrapper class="hidden group-data-[in-cart]:block">
      <MutationProvider mutationFn={handleClick}>
        {props.children}
      </MutationProvider>
    </CartItemActionWrapper>
  )
}

