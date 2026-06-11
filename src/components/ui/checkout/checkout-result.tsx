import { Show, splitProps, type JSX } from 'solid-js'
import { useMutationState } from '~/components/ui/query'
import { cn } from '~/lib/utils'

type CheckoutResultProps = {
  children?: JSX.Element
  class?: string
}

type CheckoutData = {
  orderId: string
  orderNumber: string
  total: number
  currency: string
  paymentMethod: string
  status: string
}

function CheckoutResult(props: CheckoutResultProps) {
  const [local, others] = splitProps(props, ['children', 'class'])
  const m = useMutationState()

  return (
    <Show when={m && (m.isSuccess || m.isError)}>
      <div class={cn(local.class)} {...others}>
        {local.children ?? (
          <>
            <Show when={m.isSuccess}>
              <div>
                Order {m.data && (m.data as CheckoutData).orderNumber} placed successfully!
              </div>
            </Show>
            <Show when={m.isError}>
              <div class="text-destructive">
                {m.error instanceof Error ? m.error.message : 'Checkout failed. Please try again.'}
              </div>
            </Show>
          </>
        )}
      </div>
    </Show>
  )
}

export { CheckoutResult, type CheckoutData }
