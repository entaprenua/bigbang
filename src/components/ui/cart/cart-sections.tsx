import { Show, splitProps, type JSX, type ComponentProps } from "solid-js"
import { useCart, type CartItemContextData } from "./cart-context"
import { Button } from "../button"
import { Text } from "../text"
import { Flex } from "../flex"
import { Link } from "../link"
import { cn } from "~/lib/utils"
import { Collection, useCollectionItem } from "../collection"

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
    <Collection data={cart.items()}>
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
      onChange={() => item()?.productId && cart.toggleSelected(item()!.productId)}
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
        {...others}
        onClick={local.onClick}
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
  const [local, others] = splitProps(rawProps, ["children", "onClick"])

  return (
    <Show when={!cart.isEmpty()}>
      <Button
        {...others}
        variant="outline"
        onClick={(e) => {
          local.onClick?.(e)
          cart.clear()
        }}
      >
        {local.children ?? "Clear Cart"}
      </Button>
    </Show>
  )
}



