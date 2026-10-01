import { createMemo, createEffect, splitProps, type JSX } from 'solid-js'
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

function CheckoutContactTextField(props: CheckoutFieldProps) {
  const [local, others] = splitProps(props, ['children', 'class'])
  const { formData, setField, unsatisfiedFields } = useCheckout()
  const error = createMemo(() => {
    const v = formData.contact
    if (!v) return 'invalid' as const
    return emailRegex.test(v) || phoneRegex.test(v) ? 'valid' as const : 'invalid' as const
  })
  createEffect(() => {
    const v = formData.contact
    const ok = !!v && (emailRegex.test(v) || phoneRegex.test(v))
    ok ? unsatisfiedFields.delete('contact') : unsatisfiedFields.add('contact')
  })

  return (
    <TextField
      value={formData.contact}
      onChange={(v) => setField('contact', v)}
      validationState={error()}
      class={cn('w-full', local.class)}
      {...others}
    >
      {local.children ?? (
        <>
          <TextFieldLabel>Email or Phone</TextFieldLabel>
          <TextFieldInput type="text" placeholder="you@example.com or 0712345678" />
          <TextFieldErrorMessage>Enter a valid email or phone number</TextFieldErrorMessage>
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

export {
  CheckoutContactTextField,
  CheckoutNameTextField,
  CheckoutNotesTextArea,
}
