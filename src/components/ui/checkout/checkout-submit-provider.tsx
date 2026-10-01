import { splitProps, type JSX } from 'solid-js'
import { MutationProvider } from '~/components/ui/query'
import { submitCheckout } from '~/lib/api/checkout'
import { useCheckout, useCheckoutItems } from './checkout-context'

type CheckoutSubmitProviderProps = {
  onSuccess?: (data: unknown) => void
  onError?: (error: unknown) => void
  children?: JSX.Element
}

function CheckoutSubmitProvider(props: CheckoutSubmitProviderProps) {
  const [local] = splitProps(props, ['onSuccess', 'onError', 'children'])
  const { formData } = useCheckout()
  const checkout = useCheckoutItems()

  return (
    <MutationProvider
      mutationFn={async () => {
        return submitCheckout({
          contact: formData.contact,
          name: formData.name,
          provider: formData.paymentMethod || 'mpesa',
          paymentPhone: formData.paymentPhone,
          deliveryMethod: formData.deliveryMethod,
          deliveryLocation: formData.deliveryLocation,
          deliveryZone: formData.deliveryZone,
          shippingAddress: formData.shippingAddress,
          billingAddress: formData.billingAddress,
          notes: formData.notes,
          items: checkout.apiItems(),
        })
      }}
      onSuccess={(data) => local.onSuccess?.(data)}
      onError={(error) => local.onError?.(error)}
    >
      {local.children}
    </MutationProvider>
  )
}

export { CheckoutSubmitProvider }
