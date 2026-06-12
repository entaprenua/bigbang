import { createContext, useContext, createResource, type JSX } from 'solid-js'
import { settingsApi } from '~/lib/api/settings'
import { executeGQL } from '~/lib/graphql/client'
import type { DeliveryZone, ShippingClass } from '~/lib/types'

const DELIVERY_ZONES_QUERY = `
  query DeliveryZones {
    deliveryZones {
      id
      name
      position
      locations { id country cities }
      methods { id label methodId basePrice conditions estMinDays estMaxDays classPrices { classId price } }
    }
  }
`

type CheckoutSettings = {
  deliveryZones: DeliveryZone[]
  shippingClasses: ShippingClass[]
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
    const [settings, zonesData] = await Promise.all([
      settingsApi.get(['delivery']),
      executeGQL<{ deliveryZones: DeliveryZone[] }>(DELIVERY_ZONES_QUERY),
    ])

    return {
      deliveryZones: zonesData.deliveryZones ?? [],
      shippingClasses: settings.delivery?.shippingClasses ?? [],
    }
  })

  const value: CheckoutSettingsContextType = {
    settings: () => data() ?? { deliveryZones: [], shippingClasses: [] },
    isLoading: () => data.loading,
  }

  return (
    <CheckoutSettingsContext.Provider value={value}>
      {props.children}
    </CheckoutSettingsContext.Provider>
  )
}

export { CheckoutSettingsProvider, useCheckoutSettings, useCheckoutSettingsOptional, PAYMENT_LABELS }
