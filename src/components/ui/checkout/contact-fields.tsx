import { createMemo, splitProps, type JSX } from 'solid-js'
import { createStore } from 'solid-js/store'
import { TextField, TextFieldInput, TextFieldLabel, TextFieldTextArea, TextFieldErrorMessage } from '../text-field'
import { cn } from '~/lib/utils'
import { useCheckout } from './checkout-context'

type CheckoutFieldProps = {
  children?: JSX.Element
  class?: string
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const phoneRegex = /^(?:\+?254\d{9}|0\d{9})$/

function CheckoutEmailTextField(props: CheckoutFieldProps) {
  const [local, others] = splitProps(props, ['children', 'class'])
  const { formData, setField } = useCheckout()
  const error = createMemo(() => {
    const v = formData.email
    if (!v) return 'valid' as const
    return emailRegex.test(v) ? 'valid' as const : 'invalid' as const
  })

  return (
    <TextField
      value={formData.email}
      onChange={(v) => setField('email', v)}
      validationState={error()}
      class={cn('w-full', local.class)}
      {...others}
    >
      {local.children ?? (
        <>
          <TextFieldLabel>Email</TextFieldLabel>
          <TextFieldInput type="email" placeholder="Enter your email" />
          <TextFieldErrorMessage>Please enter a valid email</TextFieldErrorMessage>
        </>
      )}
    </TextField>
  )
}

function CheckoutNameTextField(props: CheckoutFieldProps) {
  const [local, others] = splitProps(props, ['children', 'class'])
  const { formData, setField } = useCheckout()

  return (
    <TextField
      value={formData.name}
      onChange={(v) => setField('name', v)}
      class={cn('w-full', local.class)}
      {...others}
    >
      {local.children ?? (
        <>
          <TextFieldLabel>Name</TextFieldLabel>
          <TextFieldInput type="text" placeholder="Enter your name" />
        </>
      )}
    </TextField>
  )
}

function CheckoutPhoneTextField(props: CheckoutFieldProps) {
  const [local, others] = splitProps(props, ['children', 'class'])
  const { formData, setField } = useCheckout()
  const error = createMemo(() => {
    const v = formData.phone
    if (!v) return 'valid' as const
    return phoneRegex.test(v) ? 'valid' as const : 'invalid' as const
  })

  return (
    <TextField
      value={formData.phone}
      onChange={(v) => setField('phone', v)}
      validationState={error()}
      class={cn('w-full', local.class)}
      {...others}
    >
      {local.children ?? (
        <>
          <TextFieldLabel>Phone</TextFieldLabel>
          <TextFieldInput type="tel" placeholder="+254712345678" />
          <TextFieldErrorMessage>Please enter a valid phone number</TextFieldErrorMessage>
        </>
      )}
    </TextField>
  )
}

function CheckoutNotesTextArea(props: CheckoutFieldProps) {
  const [local, others] = splitProps(props, ['children', 'class'])
  const { formData, setField } = useCheckout()

  return (
    <TextField
      value={formData.notes}
      onChange={(v) => setField('notes', v)}
      class={cn('w-full', local.class)}
      {...others}
    >
      {local.children ?? (
        <>
          <TextFieldLabel>Order Notes</TextFieldLabel>
          <TextFieldTextArea placeholder="Optional notes for your order" />
        </>
      )}
    </TextField>
  )
}

function CheckoutPaymentPhoneTextField(props: CheckoutFieldProps) {
  const [local, others] = splitProps(props, ['children', 'class'])
  const { formData, setField } = useCheckout()
  const error = createMemo(() => {
    const v = formData.paymentPhone
    if (!v) return 'valid' as const
    return phoneRegex.test(v) ? 'valid' as const : 'invalid' as const
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
          <TextFieldLabel>M-Pesa Phone</TextFieldLabel>
          <TextFieldInput type="tel" placeholder="254712345678" />
          <TextFieldErrorMessage>Please enter a valid M-Pesa phone number</TextFieldErrorMessage>
        </>
      )}
    </TextField>
  )
}

export {
  CheckoutEmailTextField,
  CheckoutNameTextField,
  CheckoutPhoneTextField,
  CheckoutNotesTextArea,
  CheckoutPaymentPhoneTextField,
}
