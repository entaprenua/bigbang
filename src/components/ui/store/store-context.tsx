import { createContext, useContext, createMemo, onMount, type JSX, type Accessor } from "solid-js"
import { createStore, produce } from "solid-js/store"
import { storeApi } from "~/lib/api/store"
import type { Store } from "~/lib/generated/graphql"

type StoreContextValue = {
  store: Accessor<Store | null>
  isLoading: Accessor<boolean>
  isInMaintenance: Accessor<boolean>
  refetch: () => Promise<void>
}

const StoreContext = createContext<StoreContextValue | undefined>()

export const useStore = (): StoreContextValue | undefined =>
  useContext(StoreContext)

type StoreProviderProps = {
  children?: JSX.Element
}

export const StoreProvider = (props: StoreProviderProps) => {
  const [state, setState] = createStore<{
    store: Store | null
    loading: boolean
  }>({
    store: null,
    loading: true,
  })

  const fetch = async () => {
    setState("loading", true)
    try {
      const data = await storeApi.get()
      setState(produce((s) => { s.store = data }))
    } finally {
      setState("loading", false)
    }
  }

  onMount(fetch)

  const value: StoreContextValue = {
    store: createMemo(() => state.store),
    isLoading: createMemo(() => state.loading),
    isInMaintenance: createMemo(() => state.store?.isInMaintenanceMode ?? false),
    refetch: fetch,
  }

  return (
    <StoreContext.Provider value={value}>
      {props.children}
    </StoreContext.Provider>
  )
}

export type { StoreContextValue, StoreProviderProps }
