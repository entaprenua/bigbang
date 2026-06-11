import { createContext, useContext, createMemo, createEffect, on, type JSX, type Accessor } from "solid-js"
import { createStore, produce } from "solid-js/store"
import { useAuth } from "~/components/ui/auth/auth-provider"
import { customerApi, type Customer } from "~/lib/api/customer"

type CustomerContextValue = {
  customer: Accessor<Customer | null>
  isLoading: Accessor<boolean>
  isAuthenticated: Accessor<boolean>
  refetch: () => Promise<void>
}

const CustomerContext = createContext<CustomerContextValue | undefined>()

export const useCustomer = (): CustomerContextValue | undefined =>
  useContext(CustomerContext)

type CustomerProviderProps = {
  children?: JSX.Element
}

export const CustomerProvider = (props: CustomerProviderProps) => {
  const [state, setState] = createStore<{
    customer: Customer | null
    loading: boolean
  }>({
    customer: null,
    loading: false,
  })

  let auth: ReturnType<typeof useAuth> | undefined
  try {
    auth = useAuth()
  } catch {
    /* auth context not available */
  }

  const fetch = async () => {
    setState("loading", true)
    try {
      const data = await customerApi.me()
      setState(produce((s) => { s.customer = data }))
    } finally {
      setState("loading", false)
    }
  }

  createEffect(on(() => auth?.isAuthenticated(), (authenticated) => {
    if (authenticated) fetch()
    else setState(produce((s) => { s.customer = null }))
  }))

  const value: CustomerContextValue = {
    customer: createMemo(() => state.customer),
    isLoading: createMemo(() => state.loading),
    isAuthenticated: createMemo(() => auth?.isAuthenticated() ?? false),
    refetch: fetch,
  }

  return (
    <CustomerContext.Provider value={value}>
      {props.children}
    </CustomerContext.Provider>
  )
}

export type { CustomerContextValue, CustomerProviderProps }
