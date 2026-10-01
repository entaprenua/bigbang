import { useStore } from "~/components/ui/store"

const Currency = () => {
  const store = useStore()
  return <>{store?.store()?.currency ?? "USD"}</>
}

export { Currency }
