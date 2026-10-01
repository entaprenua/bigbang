import { createContext, useContext, createMemo, type JSX, type Accessor } from "solid-js"
import { QueryProvider, useQueryState } from "~/components/ui/query"
import { useAuth } from "~/components/ui/auth/auth-provider"
import { customerApi, type Customer } from "~/lib/api/customer"

type CustomerContextValue = {
  customer: Accessor<Customer | null>
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
  let auth: ReturnType<typeof useAuth> | undefined
  try {
    auth = useAuth()
  } catch {
    /* auth context not available */
  }

  const isAuthenticated = createMemo(() => auth?.isAuthenticated() ?? false)

  return (
    <QueryProvider
      queryKey={["customer"]}
      queryFn={() => customerApi.me()}
      enabled={isAuthenticated()}
      staleTime={1000 * 60 * 5}
      gcTime={1000 * 60 * 5}
      retry={1}
    >
      <CustomerContextBridge isAuthenticated={isAuthenticated}>
        {props.children}
      </CustomerContextBridge>
    </QueryProvider>
  )
}

type CustomerContextBridgeProps = {
  isAuthenticated: Accessor<boolean>
  children?: JSX.Element
}

function CustomerContextBridge(props: CustomerContextBridgeProps) {
  const query = useQueryState<Customer | null>()

  const customer = createMemo(() =>
    props.isAuthenticated() ? query?.data ?? null : null
  )

  const value: CustomerContextValue = {
    customer,
    isAuthenticated: props.isAuthenticated,
    refetch: async () => {
      await query?.refetch()
    },
  }

  return (
    <CustomerContext.Provider value={value}>
      {props.children}
    </CustomerContext.Provider>
  )
}

export type { CustomerContextValue, CustomerProviderProps }
