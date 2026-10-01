import { Show, splitProps, type JSX, createMemo } from "solid-js"
import { useCollectionItem } from "../collection"
import { useCheckoutItems } from "./checkout-context"
import { cn } from "~/lib/utils"
import { MutationProvider, MutationButton } from "../query"
import { Select } from "../select"

// ============================================================================
// Action Wrapper
// ============================================================================

export type CheckoutItemActionProps = {
  onClick?: (e: MouseEvent) => void
  href?: string
  children?: JSX.Element
}

export const CheckoutItemActionWrapper = (props: { class?: string; children?: JSX.Element } & JSX.HTMLAttributes<HTMLDivElement>) => {
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

// ============================================================================
// Checkout Item Quantity Components
// ============================================================================

export const CheckoutItemQuantity = () => {
  const ctx = useCollectionItem()
  const item = () => (ctx?.item ?? {}) as { quantity?: number }
  return (
    <>{String(item().quantity ?? 1)}</>
  )
}

export const CheckoutItemQuantityDecrement = (props: { class?: string; children?: JSX.Element; deleteComponent?: JSX.Element }) => {
  const ctx = useCollectionItem()
  const checkout = useCheckoutItems()
  const item = () => (ctx?.item ?? {}) as { id?: string; quantity?: number }

  const quantity = createMemo(() => item().quantity ?? 1)

  const handleClick = async () => {
    const i = item()
    if (!i?.id) return
    const cur = i.quantity ?? 1
    await checkout.refetch(i.id)
    if (cur <= 1) {
      checkout.removeItem(i.id)
    } else {
      checkout.updateQuantity(i.id, cur - 1)
    }
  }

  return (
    <CheckoutItemActionWrapper>
      <MutationProvider mutationFn={handleClick}>
        <Show when={props.deleteComponent && quantity() <= 1} fallback={
          props.children ?? (
            <MutationButton variant="ghost" class={cn("p-1 w-8", props.class)}>
              −
            </MutationButton>
          )
        }>
          {props.deleteComponent}
        </Show>
      </MutationProvider>
    </CheckoutItemActionWrapper>
  )
}

export const CheckoutItemQuantityIncrement = (props: { class?: string; children?: JSX.Element }) => {
  const ctx = useCollectionItem()
  const checkout = useCheckoutItems()
  const item = () => (ctx?.item ?? {}) as { id?: string; quantity?: number }

  const handleClick = async () => {
    const i = item()
    if (!i?.id) return
    const cur = i.quantity ?? 1
    await checkout.refetch(i.id)
    checkout.updateQuantity(i.id, cur + 1)
  }

  return (
    <CheckoutItemActionWrapper>
      <MutationProvider mutationFn={handleClick}>
        {props.children ?? (
          <MutationButton variant="ghost" class={cn("p-1 w-8", props.class)}>
            +
          </MutationButton>
        )}
      </MutationProvider>
    </CheckoutItemActionWrapper>
  )
}

export const CheckoutItemQuantityInput = (props: { class?: string } & JSX.IntrinsicElements["input"]) => {
  const [local, others] = splitProps(props, ["class", "value", "onChange", "onClick"])
  const ctx = useCollectionItem()
  const checkout = useCheckoutItems()
  const item = () => (ctx?.item ?? {}) as { id?: string; quantity?: number }

  const displayQty = () => String(item().quantity ?? 1)

  const handleChange = async (e: Event) => {
    const target = e.currentTarget as HTMLInputElement
    const value = parseInt(target.value)
    const qty = isNaN(value) || value < 1 ? 1 : value
    const i = item()
    if (!i?.id) return
    await checkout.refetch(i.id)
    checkout.updateQuantity(i.id, qty)
  }

  return (
    <CheckoutItemActionWrapper>
      <input
        type="number"
        value={displayQty()}
        onChange={handleChange}
        onClick={(e) => e.stopPropagation()}
        class={cn("w-16 h-8 text-center border rounded", local.class)}
        {...others}
      />
    </CheckoutItemActionWrapper>
  )
}

export interface CheckoutItemQuantityActionsProps {
  class?: string
  children?: JSX.Element
}

export const CheckoutItemQuantityActions = (props: CheckoutItemQuantityActionsProps) => {
  const [local, others] = splitProps(props, ["class"])
  return (
    <div
      class={cn(
        "flex ring ring-1 ring-primary rounded-lg h-8 items-center",
        local.class
      )}
      {...others}
    />
  )
}

export type CheckoutItemQuantitySelectProps = {
  options?: string[]
  class?: string
  children?: JSX.Element
}

export const CheckoutItemQuantitySelect = (props: CheckoutItemQuantitySelectProps) => {
  const [local] = splitProps(props, ['options', 'class', 'children'])
  const ctx = useCollectionItem()
  const checkout = useCheckoutItems()
  const item = () => (ctx?.item ?? {}) as { id?: string; quantity?: number; stockQuantity?: number }

  const max = () => {
    const i = item()
    const stock = i?.stockQuantity ?? 0
    return Math.max(1, stock)
  }

  const cur = () => item().quantity ?? 1

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

  const handleChange = async (v: string) => {
    const value = parseInt(v)
    const i = item()
    if (!i?.id) return
    await checkout.refetch(i.id)
    checkout.updateQuantity(i.id, value)
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
