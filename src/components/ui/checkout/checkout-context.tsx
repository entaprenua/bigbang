import { createContext, useContext, type JSX } from 'solid-js'
import { createStore, type Store } from 'solid-js/store'
import { ReactiveSet } from '@solid-primitives/set'
import type { CheckoutItemInput } from '~/lib/types'

export type CheckoutItemEntry = {
  id: string
  productId: string
  quantity: number
  price: number | null
  name: string | null
  image?: string
  slug?: string
  options?: string
  optionValues?: string
  parentId?: string
  description?: string
  sku?: string
  stockQuantity?: number
  compareToPrice?: number
  weight?: number
  selected: boolean
  subtotal: number
  metadata?: string
}

type CheckoutItemsContextType = {
  items: Store<CheckoutItemEntry[]>
  apiItems: () => CheckoutItemInput[]
  updateQuantity: (itemId: string, quantity: number) => void
  removeItem: (itemId: string) => void
  refetch: (itemId: string) => Promise<void>
  maxQuantity: (itemId: string) => number
}

const CheckoutItemsContext = createContext<CheckoutItemsContextType>()

function useCheckoutItems(): CheckoutItemsContextType {
  const ctx = useContext(CheckoutItemsContext)
  if (!ctx) throw new Error('useCheckoutItems must be used within CheckoutItems')
  return ctx
}

type CheckoutFormData = {
  contact: string
  name: string
  deliveryMethod: string
  deliveryLocation: string
  deliveryZone: string
  billingAddress: Record<string, string>
  shippingAddress: Record<string, string>
  notes: string
  paymentMethod: string
  paymentPhone: string
}

type CheckoutStep = 'contact' | 'delivery' | 'payment' | 'confirmation'

type AddressType = 'shipping' | 'billing'

type CheckoutContextType = {
  formData: CheckoutFormData
  step: CheckoutStep
  setField: <K extends keyof CheckoutFormData>(key: K, value: CheckoutFormData[K]) => void
  setAddressField: (type: AddressType, key: string, value: string) => void
  setStep: (step: CheckoutStep) => void
  reset: () => void
  unsatisfiedFields: ReactiveSet<string>
}

const defaultFormData: CheckoutFormData = {
  contact: '',
  name: '',
  deliveryMethod: '',
  deliveryLocation: '',
  deliveryZone: '',
  billingAddress: {},
  shippingAddress: {},
  notes: '',
  paymentMethod: '',
  paymentPhone: '',
}

const CheckoutContext = createContext<CheckoutContextType>()

function CheckoutProvider(props: { children?: JSX.Element }) {
  const [state, setState] = createStore({
    formData: { ...defaultFormData },
    step: 'contact' as CheckoutStep,
  })
  const unsatisfiedFields = new ReactiveSet<string>()

  const setField = <K extends keyof CheckoutFormData>(key: K, value: CheckoutFormData[K]) => {
    setState('formData', key, value)
  }

  const setAddressField = (type: AddressType, key: string, value: string) => {
    setState('formData', type === 'shipping' ? 'shippingAddress' : 'billingAddress', key as any, value)
  }

  const setStep = (step: CheckoutStep) => setState('step', step)

  const reset = () => {
    setState('formData', { ...defaultFormData })
    setState('step', 'contact')
    unsatisfiedFields.clear()
  }

  return (
    <CheckoutContext.Provider
      value={{
        get formData() { return state.formData },
        get step() { return state.step },
        setField,
        setAddressField,
        setStep,
        reset,
        unsatisfiedFields,
      }}
    >
      <div class="group" data-can-checkout={unsatisfiedFields.size === 0 && !!state.formData.paymentMethod ? "" : undefined}>
        {props.children}
      </div>
    </CheckoutContext.Provider>
  )
}

function useCheckout() {
  const ctx = useContext(CheckoutContext)
  if (!ctx) throw new Error('useCheckout must be used within CheckoutProvider')
  return ctx
}

export { CheckoutProvider, useCheckout, CheckoutItemsContext, useCheckoutItems, type CheckoutFormData, type CheckoutStep, type AddressType, type CheckoutItemsContextType }
