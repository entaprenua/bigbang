import { splitProps, type JSX, createMemo, createContext, useContext, Show } from "solid-js"
import { useSettings } from "~/components/ui/settings"
import type { CoreValueData as CoreValue } from "~/lib/api/settings"

// ─── AboutEntry ───────────────────────────────────────────────

type AboutEntryField = "story" | "mission" | "vision" | "whyUs"

const AboutEntryContext = createContext<{
  label: string
  value: () => string | undefined
}>()

const useAboutEntry = () => {
  const ctx = useContext(AboutEntryContext)
  if (!ctx) throw new Error("useAboutEntry must be used within AboutEntry")
  return ctx
}

const formatLabel = (key: string): string =>
  key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (s) => s.toUpperCase())
    .trim()

type AboutEntryProps = {
  name: AboutEntryField
  defaultValue?: string
  children?: JSX.Element
}

const AboutEntry = (props: AboutEntryProps) => {
  const [local] = splitProps(props, ["name", "defaultValue", "children"])
  const settingsCtx = useSettings()

  const resolvedValue = createMemo(() => {
    const about = settingsCtx?.settings()?.about
    const fromAbout = about?.[local.name] ?? undefined
    return fromAbout !== undefined && fromAbout !== null && fromAbout !== ""
      ? fromAbout
      : local.defaultValue
  })

  const hasValue = createMemo(() => {
    const v = resolvedValue()
    return v !== undefined && v !== null && v !== ""
  })

  return (
    <AboutEntryContext.Provider
      value={{ label: formatLabel(local.name), value: resolvedValue }}
    >
      <Show when={hasValue()}>{local.children}</Show>
    </AboutEntryContext.Provider>
  )
}

const AboutEntryLabel = () => <>{useAboutEntry().label}</>

const AboutEntryValue = () => <>{useAboutEntry().value()}</>

// ─── AboutValuesEntry ─────────────────────────────────────────

const AboutValuesEntryContext = createContext<{
  label: string
  value: () => string | undefined
}>()

const useAboutValuesEntry = () => {
  const ctx = useContext(AboutValuesEntryContext)
  if (!ctx) throw new Error("useAboutValuesEntry must be used within AboutValuesEntry")
  return ctx
}

type AboutValuesEntryProps = {
  name: string
  defaultValue?: string
  children?: JSX.Element
}

const AboutValuesEntry = (props: AboutValuesEntryProps) => {
  const [local] = splitProps(props, ["name", "defaultValue", "children"])
  const settingsCtx = useSettings()

  const coreValue = createMemo((): CoreValue | undefined => {
    const values = settingsCtx?.settings()?.about?.values
    if (!values) return undefined
    return values.find((v) => v.label === local.name) ?? undefined
  })

  const resolvedValue = createMemo(() => {
    const cv = coreValue()
    const desc = cv?.description
    if (desc !== undefined && desc !== null && desc !== "") return desc
    return local.defaultValue
  })

  const hasValue = createMemo(() => {
    const v = resolvedValue()
    return v !== undefined && v !== null && v !== ""
  })

  return (
    <AboutValuesEntryContext.Provider
      value={{ label: coreValue()?.label ?? local.name, value: resolvedValue }}
    >
      <Show when={hasValue()}>{local.children}</Show>
    </AboutValuesEntryContext.Provider>
  )
}

const AboutValuesEntryLabel = () => <>{useAboutValuesEntry().label}</>

const AboutValuesEntryValue = () => <>{useAboutValuesEntry().value()}</>

// ─── Exports ──────────────────────────────────────────────────

export {
  AboutEntry,
  AboutEntryLabel,
  AboutEntryValue,
  AboutValuesEntry,
  AboutValuesEntryLabel,
  AboutValuesEntryValue,
}

export type {
  AboutEntryProps,
  AboutValuesEntryProps,
}
