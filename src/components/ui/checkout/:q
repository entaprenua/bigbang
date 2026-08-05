import { createContext, useContext, createResource, Show, splitProps, type JSX } from 'solid-js'
import { Button } from '../button'
import { RadioGroup } from '../radio-group'
import { SegmentedControl } from '../segmented-control'
import { cn } from '~/lib/utils'
import { getConfig } from '~/lib/config'
import { useCheckout } from './checkout-context'
import { PAYMENT_LABELS } from './checkout-settings'

// ─── CheckoutPaymentMethodContext ─────────────────────────────

type CheckoutPaymentMethodContextValue = {
  method: string
}

const CheckoutPaymentMethodContext = createContext<CheckoutPaymentMethodContextValue>()

const useCheckoutPaymentMethodOptional = () => useContext(CheckoutPaymentMethodContext)

// ─── CheckoutPaymentMethod ────────────────────────────────────

type CheckoutPaymentMethodProps = {
  method: string
  children?: JSX.Element
}

function CheckoutPaymentMethod(props: CheckoutPaymentMethodProps) {
  const [local] = splitProps(props, ['method', 'children'])
  const [cfg] = createResource(getConfig)
  const enabled = () => cfg()?.[`${local.method}_enabled`] !== false

  return (
    <Show when={enabled()}>
      <CheckoutPaymentMethodContext.Provider value={{ method: local.method }}>
        {local.children}
      </CheckoutPaymentMethodContext.Provider>
    </Show>
  )
}

// ─── CheckoutPaymentMethodSelectButton ────────────────────────

type CheckoutPaymentMethodSelectButtonProps = {
  method?: string
  class?: string
  children?: JSX.Element
}

function CheckoutPaymentMethodSelectButton(props: CheckoutPaymentMethodSelectButtonProps) {
  const [local] = splitProps(props, ['method', 'class', 'children'])
  const parent = useCheckoutPaymentMethodOptional()
  const { formData, setField } = useCheckout()
  const method = () => local.method ?? parent?.method ?? ''
  const selected = () => formData.paymentMethod === method()

  return (
    <Button
      type="button"
      variant="outline"
      data-selected={selected() ? '' : undefined}
      onClick={() => setField('paymentMethod', method())}
      class={cn(
        'not-data-[selected]:opacity-50 hover:not-data-[selected]:opacity-75',
        local.class
      )}
    >
      {local.children ?? PAYMENT_LABELS[method()] ?? method()}
    </Button>
  )
}

// ─── CheckoutPaymentMethodRadioGroup ──────────────────────────

type CheckoutPaymentMethodRadioGroupProps = {
  class?: string
  children?: JSX.Element
}

function CheckoutPaymentMethodRadioGroup(props: CheckoutPaymentMethodRadioGroupProps) {
  const [local] = splitProps(props, ['class', 'children'])
  const { formData, setField } = useCheckout()

  return (
    <RadioGroup
      value={formData.paymentMethod}
      onChange={(v) => setField('paymentMethod', v)}
      class={local.class}
    >
      {local.children}
    </RadioGroup>
  )
}

// ─── CheckoutPaymentMethodSegmentedControl ────────────────────

type CheckoutPaymentMethodSegmentedControlProps = {
  class?: string
  children?: JSX.Element
}

function CheckoutPaymentMethodSegmentedControl(props: CheckoutPaymentMethodSegmentedControlProps) {
  const [local] = splitProps(props, ['class', 'children'])
  const { formData, setField } = useCheckout()

  return (
    <SegmentedControl
      value={formData.paymentMethod}
      onChange={(v) => setField('paymentMethod', v)}
      class={local.class}
    >
      {local.children}
    </SegmentedControl>
  )
}

export {
  CheckoutPaymentMethod,
  CheckoutPaymentMethodSelectButton,
  CheckoutPaymentMethodRadioGroup,
  CheckoutPaymentMethodSegmentedControl,
}
