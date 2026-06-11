import { createContext, useContext, createSignal, onMount, type JSX, type Accessor } from "solid-js"
import { settingsApi, type SettingsField, type ParsedStoreSettings } from "~/lib/api/settings"

type SettingsContextValue = {
  settings: Accessor<Partial<ParsedStoreSettings>>
  isLoading: Accessor<boolean>
}

const SettingsContext = createContext<SettingsContextValue | undefined>()

export const useSettings = () => useContext(SettingsContext)

type SettingsProviderProps = {
  fields: SettingsField[]
  children?: JSX.Element
}

export const SettingsProvider = (props: SettingsProviderProps) => {
  const [settings, setSettings] = createSignal<Partial<ParsedStoreSettings>>({})
  const [loading, setLoading] = createSignal(true)

  onMount(async () => {
    try {
      const data = await settingsApi.get(props.fields)
      setSettings(data)
    } finally {
      setLoading(false)
    }
  })

  const value: SettingsContextValue = {
    settings,
    isLoading: loading,
  }

  return (
    <SettingsContext.Provider value={value}>
      {props.children}
    </SettingsContext.Provider>
  )
}

export type { SettingsContextValue, SettingsProviderProps }
