import { createContext, useContext, type JSX } from 'solid-js'
import { createStore } from 'solid-js/store'

type CheckoutFormData = {
  email: string
  name: string
  phone: string
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
}

const defaultFormData: CheckoutFormData = {
  email: '',
  name: '',
  phone: '',
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
      }}
    >
      {props.children}
    </CheckoutContext.Provider>
  )
}

function useCheckout() {
  const ctx = useContext(CheckoutContext)
  if (!ctx) throw new Error('useCheckout must be used within CheckoutProvider')
  return ctx
}

export { CheckoutProvider, useCheckout, type CheckoutFormData, type CheckoutStep, type AddressType }
