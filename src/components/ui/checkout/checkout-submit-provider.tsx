import { splitProps, type JSX } from 'solid-js'
import { MutationProvider } from '~/components/ui/query'
import { submitCheckout } from '~/lib/payments'
import { useCheckout } from './checkout-context'
import { useDirectBuy } from '../direct-buy/direct-buy-context'

type CheckoutSubmitProviderProps = {
  onSuccess?: (data: unknown) => void
  onError?: (error: unknown) => void
  children?: JSX.Element
}

function CheckoutSubmitProvider(props: CheckoutSubmitProviderProps) {
  const [local] = splitProps(props, ['onSuccess', 'onError', 'children'])
  const { formData } = useCheckout()
  const directBuy = useDirectBuy()

  return (
    <MutationProvider
      mutationFn={async () => {
        return submitCheckout({
          email: formData.email,
          name: formData.name,
          phone: formData.phone,
          provider: formData.paymentMethod || 'mpesa',
          paymentPhone: formData.paymentPhone,
          deliveryMethod: formData.deliveryMethod,
          deliveryLocation: formData.deliveryLocation,
          deliveryZone: formData.deliveryZone,
          shippingAddress: formData.shippingAddress,
          billingAddress: formData.billingAddress,
          notes: formData.notes,
          directBuy: directBuy
            ? {
                productId: directBuy.productId()!,
                quantity: directBuy.quantity(),
                subtotal: (directBuy.item()?.subtotal ?? 0).toFixed(2),
              }
            : undefined,
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
