import { createMemo, splitProps, type JSX } from 'solid-js'
import { TextField, TextFieldInput, TextFieldLabel, TextFieldErrorMessage } from '../text-field'
import { cn } from '~/lib/utils'
import { useCheckout } from './checkout-context'

type AddressFieldProps = {
  children?: JSX.Element
  class?: string
}

function createAddressField(type: 'shipping' | 'billing', key: string, label: string, placeholder: string) {
  const Comp = (props: AddressFieldProps) => {
    const [local, others] = splitProps(props, ['children', 'class'])
    const { formData, setAddressField } = useCheckout()
    const value = createMemo(() => {
      const addr = type === 'shipping' ? formData.shippingAddress : formData.billingAddress
      return addr[key] ?? ''
    })
    const error = createMemo(() => {
      const v = value()
      if (!v) return 'valid' as const
      return v.trim().length > 0 ? 'valid' as const : 'invalid' as const
    })

    return (
      <TextField
        value={value()}
        onChange={(v) => setAddressField(type, key, v)}
        validationState={error()}
        class={cn('w-full', local.class)}
        {...others}
      >
        {local.children ?? (
          <>
            <TextFieldLabel>{label}</TextFieldLabel>
            <TextFieldInput placeholder={placeholder} />
            <TextFieldErrorMessage>Please enter a valid {label.toLowerCase()}</TextFieldErrorMessage>
          </>
        )}
      </TextField>
    )
  }
  Comp.displayName = `Checkout${type.charAt(0).toUpperCase() + type.slice(1)}${key.charAt(0).toUpperCase() + key.slice(1)}Field`
  return Comp
}

const CheckoutShippingStreetField = createAddressField('shipping', 'street', 'Street Address', '123 Main St')
const CheckoutShippingCityField = createAddressField('shipping', 'city', 'City', 'Nairobi')
const CheckoutShippingStateField = createAddressField('shipping', 'state', 'State / Region', 'Nairobi')
const CheckoutShippingZipField = createAddressField('shipping', 'zip', 'ZIP / Postal Code', '00100')
const CheckoutShippingCountryField = createAddressField('shipping', 'country', 'Country', 'Kenya')

const CheckoutBillingStreetField = createAddressField('billing', 'street', 'Street Address', '123 Main St')
const CheckoutBillingCityField = createAddressField('billing', 'city', 'City', 'Nairobi')
const CheckoutBillingStateField = createAddressField('billing', 'state', 'State / Region', 'Nairobi')
const CheckoutBillingZipField = createAddressField('billing', 'zip', 'ZIP / Postal Code', '00100')
const CheckoutBillingCountryField = createAddressField('billing', 'country', 'Country', 'Kenya')

export {
  CheckoutShippingStreetField,
  CheckoutShippingCityField,
  CheckoutShippingStateField,
  CheckoutShippingZipField,
  CheckoutShippingCountryField,
  CheckoutBillingStreetField,
  CheckoutBillingCityField,
  CheckoutBillingStateField,
  CheckoutBillingZipField,
  CheckoutBillingCountryField,
}
