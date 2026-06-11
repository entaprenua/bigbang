import { splitProps, type JSX, createMemo, createContext, useContext, Show } from "solid-js"
import { useSettings } from "~/components/ui/settings"
import type { ExchangeRateData as ExchangeRate } from "~/lib/api/settings"

const CurrenciesEntryContext = createContext<{
  label: string
  value: () => string | undefined
}>()

const useCurrenciesEntry = () => {
  const ctx = useContext(CurrenciesEntryContext)
  if (!ctx)
    throw new Error("useCurrenciesEntry must be used within CurrenciesEntry")
  return ctx
}

type CurrenciesEntryProps = {
  name: string
  children?: JSX.Element
}

const CurrenciesEntry = (props: CurrenciesEntryProps) => {
  const [local] = splitProps(props, ["name", "children"])
  const settingsCtx = useSettings()

  const exchangeRate = createMemo((): ExchangeRate | undefined => {
    const rates = settingsCtx?.settings()?.currencies?.rates
    if (!rates) return undefined
    return rates.find((r) => r.currency === local.name) ?? undefined
  })

  const value = createMemo(() => {
    const er = exchangeRate()
    if (!er) return undefined
    return er.symbol ?? undefined
  })

  const hasValue = createMemo(() => {
    const v = value()
    return v !== undefined && v !== null && v !== ""
  })

  return (
    <CurrenciesEntryContext.Provider
      value={{ label: exchangeRate()?.currency ?? local.name, value }}
    >
      {/* TODO: add onClick handler to set preferred currency once backend supports it */}
      <Show when={hasValue()}>{local.children}</Show>
    </CurrenciesEntryContext.Provider>
  )
}

const CurrenciesEntryLabel = () => <>{useCurrenciesEntry().label}</>

const CurrenciesEntryValue = () => <>{useCurrenciesEntry().value()}</>

export {
  CurrenciesEntry,
  CurrenciesEntryLabel,
  CurrenciesEntryValue,
}

export type {
  CurrenciesEntryProps,
}
