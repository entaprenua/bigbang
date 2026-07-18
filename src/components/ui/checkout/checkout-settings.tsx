import { createContext, useContext, createResource, type JSX } from 'solid-js'
import { executeGQL } from '~/lib/graphql/server'
import type { DeliveryZone } from '~/lib/types'

const DELIVERY_ZONES_QUERY = `
  query DeliveryZones {
    deliveryZones {
      id
      name
      position
      locations
      methods
    }
  }
`

type CheckoutSettings = {
  deliveryZones: DeliveryZone[]
}

type CheckoutSettingsContextType = {
  settings: () => CheckoutSettings
  isLoading: () => boolean
}

const CheckoutSettingsContext = createContext<CheckoutSettingsContextType>()

function useCheckoutSettings(): CheckoutSettingsContextType {
  const ctx = useContext(CheckoutSettingsContext)
  if (!ctx) throw new Error('useCheckoutSettings must be used within CheckoutSettingsProvider')
  return ctx
}

const useCheckoutSettingsOptional = () => useContext(CheckoutSettingsContext)

const PAYMENT_LABELS: Record<string, string> = {
  mpesa: 'M-Pesa',
  stripe: 'Card',
}

function CheckoutSettingsProvider(props: { children?: JSX.Element }) {
  const [data] = createResource(async () => {
    const zonesData = await executeGQL<{ deliveryZones: DeliveryZone[] }>(DELIVERY_ZONES_QUERY)
    return { deliveryZones: zonesData.deliveryZones ?? [] }
  })

  const value: CheckoutSettingsContextType = {
    settings: () => data() ?? { deliveryZones: [] },
    isLoading: () => data.loading,
  }

  return (
    <CheckoutSettingsContext.Provider value={value}>
      {props.children}
    </CheckoutSettingsContext.Provider>
  )
}

export { CheckoutSettingsProvider, useCheckoutSettings, useCheckoutSettingsOptional, PAYMENT_LABELS }
