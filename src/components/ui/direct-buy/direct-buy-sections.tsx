import { Show, splitProps, type JSX, createMemo } from "solid-js"
import { useDirectBuy } from "./direct-buy-context"
import { cn } from "~/lib/utils"
import { MutationProvider, MutationButton } from "../query"
import { Select } from "../select"

// ============================================================================
// Action Wrapper
// ============================================================================

export type DirectBuyItemActionProps = {
  onClick?: (e: MouseEvent) => void
  href?: string
  children?: JSX.Element
}

export const DirectBuyItemActionWrapper = (props: { class?: string; children?: JSX.Element } & JSX.HTMLAttributes<HTMLDivElement>) => {
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
// Direct Buy Item Quantity Components
// ============================================================================

export const DirectBuyItemQuantity = () => {
  const ctx = useDirectBuy()
  return (
    <>{String(ctx.quantity())}</>
  )
}

export const DirectBuyItemQuantityDecrement = (props: { class?: string; children?: JSX.Element }) => {
  const ctx = useDirectBuy()
  const handleClick = async () => {
    await ctx.refetch()
    const cur = ctx.quantity()
    ctx.setQuantity(cur - 1)
  }

  return (
    <DirectBuyItemActionWrapper>
      <MutationProvider mutationFn={handleClick}>
        {props.children ?? (
          <MutationButton variant="ghost" class={cn("p-1 w-8", props.class)}>
            −
          </MutationButton>
        )}
      </MutationProvider>
    </DirectBuyItemActionWrapper>
  )
}

export const DirectBuyItemQuantityIncrement = (props: { class?: string; children?: JSX.Element }) => {
  const ctx = useDirectBuy()
  const handleClick = async () => {
    await ctx.refetch()
    const cur = ctx.quantity()
    ctx.setQuantity(cur + 1)
  }

  return (
    <DirectBuyItemActionWrapper>
      <MutationProvider mutationFn={handleClick}>
        {props.children ?? (
          <MutationButton variant="ghost" class={cn("p-1 w-8", props.class)}>
            +
          </MutationButton>
        )}
      </MutationProvider>
    </DirectBuyItemActionWrapper>
  )
}

export const DirectBuyItemQuantityInput = (props: { class?: string } & JSX.IntrinsicElements["input"]) => {
  const [local, others] = splitProps(props, ["class", "value", "onChange", "onClick"])
  const ctx = useDirectBuy()

  const displayQty = () => String(ctx.quantity())

  const handleChange = async (e: Event) => {
    const target = e.currentTarget as HTMLInputElement
    const value = parseInt(target.value)
    const qty = isNaN(value) || value < 1 ? 1 : value
    await ctx.refetch()
    ctx.setQuantity(qty)
  }

  return (
    <DirectBuyItemActionWrapper>
      <input
        type="number"
        value={displayQty()}
        onChange={handleChange}
        onClick={(e) => e.stopPropagation()}
        class={cn("w-16 h-8 text-center border rounded", local.class)}
        {...others}
      />
    </DirectBuyItemActionWrapper>
  )
}

export interface DirectBuyItemQuantityActionsProps {
  class?: string
  children?: JSX.Element
}

export const DirectBuyItemQuantityActions = (props: DirectBuyItemQuantityActionsProps) => {
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

export type DirectBuyItemQuantitySelectProps = {
  options?: string[]
  class?: string
  children?: JSX.Element
}

export const DirectBuyItemQuantitySelect = (props: DirectBuyItemQuantitySelectProps) => {
  const [local] = splitProps(props, ['options', 'class', 'children'])
  const ctx = useDirectBuy()

  const max = () => ctx.maxQuantity()

  const cur = () => ctx.quantity()

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
    await ctx.refetch()
    ctx.setQuantity(value)
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
