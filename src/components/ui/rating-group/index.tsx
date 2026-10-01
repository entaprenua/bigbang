import { Index, createSignal, createContext, useContext, type JSX, type ValidComponent } from "solid-js"
import { splitProps } from "solid-js"

import type { PolymorphicProps } from "@kobalte/core/polymorphic"
import * as RatingGroupPrimitive from "./primitives"

import { cn } from "~/lib/utils"

type RatingGroupContextValue = { value: () => number }
const RatingGroupValueContext = createContext<RatingGroupContextValue>()

type RatingGroupRootProps<T extends ValidComponent = "div"> =
  RatingGroupPrimitive.RatingGroupRootProps<T> & { class?: string | undefined }

const RatingGroup = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, RatingGroupRootProps<T>>
) => {
  const [local, others] = splitProps(props as RatingGroupRootProps, ["class", "value", "defaultValue", "onChange"])

  const [internalValue, setInternalValue] = createSignal<number>(
    local.defaultValue ?? local.value ?? 0
  )
  const resolvedValue = () => local.value ?? internalValue()

  return (
    <RatingGroupValueContext.Provider value={{ value: resolvedValue }}>
      <RatingGroupPrimitive.Root
        value={resolvedValue()}
        onChange={(v: number) => { setInternalValue(v); local.onChange?.(v) }}
        class={cn("inline-flex", local.class)}
        {...others}
      />
    </RatingGroupValueContext.Provider>
  )
}

function RatingGroupValue() {
  const ctx = useContext(RatingGroupValueContext)!
  return <>{ctx.value()}</>
}

function RatingGroupItems(props: { children?: JSX.Element }) {
  return (
    <Index each={Array(5)}>
      {() => props.children}
    </Index>
  )
}

const RatingGroupControl = RatingGroupPrimitive.Control
const RatingGroupLabel = RatingGroupPrimitive.Label
const RatingGroupItem = RatingGroupPrimitive.Item
const RatingGroupItemControl = RatingGroupPrimitive.ItemControl
const RatingGroupItemLabel = RatingGroupPrimitive.ItemLabel
const RatingGroupHiddenInput = RatingGroupPrimitive.HiddenInput
const RatingGroupDescription = RatingGroupPrimitive.Description
const RatingGroupErrorMessage = RatingGroupPrimitive.ErrorMessage

export {
  RatingGroup,
  RatingGroupValue,
  RatingGroupItems,
  RatingGroupControl,
  RatingGroupLabel,
  RatingGroupItem,
  RatingGroupItemControl,
  RatingGroupItemLabel,
  RatingGroupHiddenInput,
  RatingGroupDescription,
  RatingGroupErrorMessage,
  RatingGroupValueContext,
}
