import { splitProps, type JSX, createMemo, createContext, useContext, Show } from "solid-js"
import { useSettings } from "~/components/ui/settings"

type SocialField = "facebook" | "instagram" | "linkedin" | "tiktok" | "twitter" | "youtube"

const SocialEntryContext = createContext<{
  label: string
  value: () => string | undefined
}>()

const useSocialEntry = () => {
  const ctx = useContext(SocialEntryContext)
  if (!ctx) throw new Error("useSocialEntry must be used within SocialEntry")
  return ctx
}

const formatLabel = (key: string): string =>
  key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (s) => s.toUpperCase())
    .trim()

type SocialEntryProps = {
  name: SocialField
  defaultValue?: string
  children?: JSX.Element
}

const SocialEntry = (props: SocialEntryProps) => {
  const [local] = splitProps(props, ["name", "defaultValue", "children"])
  const settingsCtx = useSettings()

  const resolvedValue = createMemo(() => {
    const social = settingsCtx?.settings()?.social
    const fromSocial = social?.[local.name] ?? undefined
    if (fromSocial !== undefined && fromSocial !== null && fromSocial !== "")
      return fromSocial
    return local.defaultValue
  })

  const hasValue = createMemo(() => {
    const v = resolvedValue()
    return v !== undefined && v !== null && v !== ""
  })

  return (
    <SocialEntryContext.Provider
      value={{ label: formatLabel(local.name), value: resolvedValue }}
    >
      <Show when={hasValue()}>{local.children}</Show>
    </SocialEntryContext.Provider>
  )
}

const SocialEntryLabel = () => <>{useSocialEntry().label}</>

const SocialEntryValue = () => <>{useSocialEntry().value()}</>

type SocialEntryLinkProps = {
  class?: string
  target?: string
  rel?: string
  children?: JSX.Element
}

const SocialEntryLink = (props: SocialEntryLinkProps) => {
  const [local, others] = splitProps(props, ["class", "target", "rel", "children"])
  const ctx = useSocialEntry()

  return (
    <a
      href={ctx.value()}
      target={local.target ?? "_blank"}
      rel={local.rel ?? "noopener noreferrer"}
      class={local.class}
      {...others}
    >
      {local.children}
    </a>
  )
}

export {
  SocialEntry,
  SocialEntryLabel,
  SocialEntryValue,
  SocialEntryLink,
}

export type {
  SocialEntryProps,
  SocialEntryLinkProps,
}
