import { createContext, useContext, createResource, createMemo, createEffect, Show, splitProps, type JSX } from 'solid-js'
import { Button, type ButtonProps } from '../button'
import { RadioGroup } from '../radio-group'
import { SegmentedControl } from '../segmented-control'
import { TextField, TextFieldInput, TextFieldLabel, TextFieldErrorMessage } from '../text-field'
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
    <CheckoutPaymentMethodContext.Provider value={{ method: local.method }}>
      <Show when={enabled()}>
        {local.children}
      </Show>
    </CheckoutPaymentMethodContext.Provider>
  )
}

// ─── CheckoutPaymentMethodSelectButton ────────────────────────

type CheckoutPaymentMethodSelectButtonProps = Omit<ButtonProps<"button">, "onClick"> & {
  method?: string
  onClick?: (e: MouseEvent) => void
}

function CheckoutPaymentMethodSelectButton(props: CheckoutPaymentMethodSelectButtonProps) {
  const [local, others] = splitProps(props, ['method', 'onClick', 'class', 'children'])
  const parent = useCheckoutPaymentMethodOptional()
  const { formData, setField } = useCheckout()
  const method = () => local.method ?? parent?.method ?? ''
  const selected = () => formData.paymentMethod === method()

  return (
    <Button
      type="button"
      variant="outline"
      data-selected={selected() ? '' : undefined}
      onClick={(e) => { setField('paymentMethod', method()); local.onClick?.(e) }}
      class={cn(
        'not-data-[selected]:opacity-50 hover:not-data-[selected]:opacity-75',
        local.class
      )}
      {...others}
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

// ─── CheckoutPaymentPhoneTextField ────────────────────────────

const phoneRegex = /^(?:\+?254\d{9}|0\d{9})$/

function CheckoutPaymentPhoneTextField(props: { children?: JSX.Element; class?: string }) {
  const [local, others] = splitProps(props, ['children', 'class'])
  const { formData, setField, unsatisfiedFields } = useCheckout()
  const parent = useCheckoutPaymentMethodOptional()
  const method = () => parent?.method ?? ''
  const error = createMemo(() => {
    const isSelected = formData.paymentMethod === method()
    if (!isSelected) return 'valid' as const
    if (!formData.paymentPhone) return 'invalid' as const
    return phoneRegex.test(formData.paymentPhone) ? 'valid' as const : 'invalid' as const
  })
  createEffect(() => {
    const isSelected = formData.paymentMethod === method()
    const ok = !isSelected || (!!formData.paymentPhone && phoneRegex.test(formData.paymentPhone))
    ok ? unsatisfiedFields.delete('paymentPhone') : unsatisfiedFields.add('paymentPhone')
  })

  return (
    <TextField
      value={formData.paymentPhone}
      onChange={(v) => setField('paymentPhone', v)}
      validationState={error()}
      class={cn('w-full', local.class)}
      {...others}
    >
      {local.children ?? (
        <>
          <TextFieldLabel>{PAYMENT_LABELS[method()] ?? method()} Phone</TextFieldLabel>
          <TextFieldInput type="tel" placeholder="254712345678" />
          <TextFieldErrorMessage>Please enter a valid {PAYMENT_LABELS[method()] ?? method()} phone number</TextFieldErrorMessage>
        </>
      )}
    </TextField>
  )
}

export {
  CheckoutPaymentMethod,
  CheckoutPaymentMethodSelectButton,
  CheckoutPaymentMethodRadioGroup,
  CheckoutPaymentMethodSegmentedControl,
  CheckoutPaymentPhoneTextField,
  useCheckoutPaymentMethodOptional,
}
