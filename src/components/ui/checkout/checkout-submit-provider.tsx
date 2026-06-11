import { splitProps, createMemo, type JSX } from 'solid-js'
import { useSearchParams } from '@solidjs/router'
import { MutationProvider } from '~/components/ui/query'
import { submitCheckout } from '~/lib/payments'
import { useCheckout } from './checkout-context'
import { useCheckoutSettingsOptional } from './checkout-settings'
import type { CheckoutResult } from '~/lib/types'

type CheckoutSubmitProviderProps = {
  onSuccess?: (data: CheckoutResult) => void
  onError?: (error: unknown) => void
  children?: JSX.Element
}

function CheckoutSubmitProvider(props: CheckoutSubmitProviderProps) {
  const [local] = splitProps(props, ['onSuccess', 'onError', 'children'])
  const { formData } = useCheckout()
  const [params] = useSearchParams()
  const settingsCtx = useCheckoutSettingsOptional()

  const matchedZone = createMemo(() => {
    const zones = settingsCtx?.settings().deliveryZones
    const country = formData.deliveryCountry
    if (!country || !zones) return undefined
    return zones.find((z) => z.locations.some((l) => l.country === country))
  })

  const matchedMethod = createMemo(() => {
    const label = formData.deliveryMethod
    const zone = matchedZone()
    if (!label || !zone) return undefined
    return zone.methods.find((m) => m.label === label)
  })

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
          deliveryMethodId: matchedMethod()?.methodId,
          deliveryZoneId: matchedZone()?.id,
          deliveryCountry: formData.deliveryCountry,
          deliveryCity: formData.deliveryCity,
          shippingAddress: formData.shippingAddress,
          billingAddress: formData.billingAddress,
          notes: formData.notes,
          directBuy: params.productId && !Array.isArray(params.productId)
            ? {
                productId: params.productId,
                variantId: typeof params.variantId === 'string' ? params.variantId : undefined,
                quantity: typeof params.qty === 'string' ? parseInt(params.qty) || 1 : 1,
              }
            : undefined,
        })
      }}
      onSuccess={(data) => local.onSuccess?.(data as CheckoutResult)}
      onError={(error) => local.onError?.(error)}
    >
      {local.children}
    </MutationProvider>
  )
}

export { CheckoutSubmitProvider }
