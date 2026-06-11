import { splitProps, type JSX, createMemo, createContext, useContext, Show } from "solid-js"
import { useSettings } from "~/components/ui/settings"
import type { WorkingHoursData as WorkingHours } from "~/lib/api/settings"

// ─── Utilities ────────────────────────────────────────────────

const formatLabel = (key: string): string =>
  key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (s) => s.toUpperCase())
    .trim()

const formatHours = (wh: WorkingHours): string => {
  if (wh.closed) return "Closed"
  if (wh.opens && wh.closes) return `${wh.opens} - ${wh.closes}`
  return ""
}

const isNonEmpty = (v: unknown): boolean =>
  v !== undefined && v !== null && v !== ""

// ─── ContactEntry ─────────────────────────────────────────────

type ContactField = "email" | "phone" | "address" | "latitude" | "longitude"

const ContactEntryContext = createContext<{
  label: string
  value: () => string | undefined
}>()

const useContactEntry = () => {
  const ctx = useContext(ContactEntryContext)
  if (!ctx) throw new Error("useContactEntry must be used within ContactEntry")
  return ctx
}

type ContactEntryProps = {
  name: ContactField
  defaultValue?: string
  children?: JSX.Element
}

const ContactEntry = (props: ContactEntryProps) => {
  const [local] = splitProps(props, ["name", "defaultValue", "children"])
  const settingsCtx = useSettings()

  const resolvedValue = createMemo(() => {
    const contact = settingsCtx?.settings()?.contact
    const raw = contact?.[local.name]
    const fromContact =
      raw !== undefined && raw !== null ? String(raw) : undefined
    if (isNonEmpty(fromContact)) return fromContact
    return local.defaultValue
  })

  const hasValue = createMemo(() => isNonEmpty(resolvedValue()))

  return (
    <ContactEntryContext.Provider
      value={{ label: formatLabel(local.name), value: resolvedValue }}
    >
      <Show when={hasValue()}>{local.children}</Show>
    </ContactEntryContext.Provider>
  )
}

const ContactEntryLabel = () => <>{useContactEntry().label}</>

const ContactEntryValue = () => <>{useContactEntry().value()}</>

// ─── ContactWorkingHoursEntry ─────────────────────────────────

const ContactWorkingHoursEntryContext = createContext<{
  label: string
  value: () => string | undefined
}>()

const useContactWorkingHoursEntry = () => {
  const ctx = useContext(ContactWorkingHoursEntryContext)
  if (!ctx)
    throw new Error(
      "useContactWorkingHoursEntry must be used within ContactWorkingHoursEntry",
    )
  return ctx
}

type ContactWorkingHoursEntryProps = {
  name: string
  defaultValue?: string
  children?: JSX.Element
}

const ContactWorkingHoursEntry = (props: ContactWorkingHoursEntryProps) => {
  const [local] = splitProps(props, ["name", "defaultValue", "children"])
  const settingsCtx = useSettings()

  const workingHour = createMemo((): WorkingHours | undefined => {
    const hours = settingsCtx?.settings()?.contact?.workingHours
    if (!hours) return undefined
    return hours.find((wh) => wh.dayOfWeek === local.name) ?? undefined
  })

  const resolvedValue = createMemo(() => {
    const wh = workingHour()
    if (wh) {
      const fromHours = formatHours(wh)
      if (isNonEmpty(fromHours)) return fromHours
    }
    return local.defaultValue
  })

  const hasValue = createMemo(() => isNonEmpty(resolvedValue()))

  return (
    <ContactWorkingHoursEntryContext.Provider
      value={{
        label: workingHour()?.dayOfWeek ?? local.name,
        value: resolvedValue,
      }}
    >
      <Show when={hasValue()}>{local.children}</Show>
    </ContactWorkingHoursEntryContext.Provider>
  )
}

const ContactWorkingHoursEntryLabel = () => (
  <>{useContactWorkingHoursEntry().label}</>
)

const ContactWorkingHoursEntryValue = () => (
  <>{useContactWorkingHoursEntry().value()}</>
)

// ─── Exports ──────────────────────────────────────────────────

export {
  ContactEntry,
  ContactEntryLabel,
  ContactEntryValue,
  ContactWorkingHoursEntry,
  ContactWorkingHoursEntryLabel,
  ContactWorkingHoursEntryValue,
}

export type {
  ContactEntryProps,
  ContactWorkingHoursEntryProps,
}
