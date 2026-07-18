import { createContext, useContext, For, type JSX, type ValidComponent } from "solid-js"
import { splitProps } from "solid-js"

import type { PolymorphicProps } from "@kobalte/core/polymorphic"
import * as SegmentedControlPrimitive from "@kobalte/core/segmented-control"

import { cn } from "~/lib/utils"

type SegmentedControlOption = string | { value: string; label: string; disabled?: boolean }

type SegmentedControlContextValue = { options: () => SegmentedControlOption[] | undefined }
const SegmentedControlContext = createContext<SegmentedControlContextValue>()

type SegmentedControlItemContextValue = { value: string; label?: string; disabled?: boolean }
const SegmentedControlItemContext = createContext<SegmentedControlItemContextValue | undefined>()

function SegmentedControlItemsProvider(props: { value: string; label?: string; disabled?: boolean; children?: JSX.Element }) {
  return (
    <SegmentedControlItemContext.Provider value={{ value: props.value, label: props.label, disabled: props.disabled }}>
      {props.children}
    </SegmentedControlItemContext.Provider>
  )
}

type SegmentedControlRootProps = SegmentedControlPrimitive.SegmentedControlRootProps & { class?: string | undefined; options?: SegmentedControlOption[] }

const SegmentedControl = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, SegmentedControlRootProps>
) => {
  const [local, others] = splitProps(props as SegmentedControlRootProps, ["class", "options"])
  return (
    <SegmentedControlContext.Provider value={{ options: () => local.options }}>
      <SegmentedControlPrimitive.Root
        class={cn("flex flex-col gap-2", local.class)}
        {...others}
      />
    </SegmentedControlContext.Provider>
  )
}

function SegmentedControlItems(props: { children?: JSX.Element }) {
  const ctx = useContext(SegmentedControlContext)!
  return (
    <For each={ctx.options()}>
      {(option) => {
        const isString = typeof option === "string"
        const val = isString ? option : option.value
        const label = isString ? undefined : option.label
        const disabled = isString ? undefined : option.disabled
        return (
          <SegmentedControlItemsProvider value={val} label={label} disabled={disabled}>
            {props.children}
          </SegmentedControlItemsProvider>
        )
      }}
    </For>
  )
}

type SegmentedControlItemProps<T extends ValidComponent = "div"> =
  Omit<SegmentedControlPrimitive.SegmentedControlItemProps<T>, "disabled" | "value"> & { value?: string; class?: string | undefined; children?: JSX.Element; disabled?: boolean }

const SegmentedControlItem = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, SegmentedControlItemProps<T>>
) => {
  const [local, others] = splitProps(props as SegmentedControlItemProps, ["class", "children", "value", "disabled"])
  const itemCtx = useContext(SegmentedControlItemContext)
  const resolvedValue = () => local.value ?? itemCtx?.value ?? ""
  const resolvedDisabled = () => local.disabled ?? itemCtx?.disabled ?? false
  return (
    <SegmentedControlPrimitive.Item value={resolvedValue()} disabled={resolvedDisabled()} class={cn("rounded-md data-[checked]:bg-primary/20 data-[checked]:text-foreground", local.class)} {...others}>
      {local.children}
    </SegmentedControlPrimitive.Item>
  )
}

const SegmentedControlItemLabel = (props: { class?: string }) => {
  const [local, others] = splitProps(props, ["class"])
  const itemCtx = useContext(SegmentedControlItemContext)
  return (
    <SegmentedControlPrimitive.ItemLabel
      class={cn(
        "cursor-pointer font-medium px-4 py-[0.563rem] text-muted-foreground transition-colors duration-200 select-none hover:not-data-[checked]:opacity-75 active:not-data-[checked]:opacity-50 data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed",
        local.class
      )}
      {...others}
    >
      {itemCtx?.label ?? itemCtx?.value ?? ""}
    </SegmentedControlPrimitive.ItemLabel>
  )
}

const SegmentedControlLabel = SegmentedControlPrimitive.Label
const SegmentedControlDescription = SegmentedControlPrimitive.Description
const SegmentedControlErrorMessage = SegmentedControlPrimitive.ErrorMessage
const SegmentedControlIndicator = (props: { class?: string }) => {
  const [local, others] = splitProps(props, ["class"])
  return (
    <SegmentedControlPrimitive.Indicator
      class={cn("absolute bg-white rounded-lg shadow-sm ring-1 ring-zinc-300 transition-all duration-200 ease-in-out", local.class)}
      {...others}
    />
  )
}
const SegmentedControlItemInput = SegmentedControlPrimitive.ItemInput
const SegmentedControlItemControl = SegmentedControlPrimitive.ItemControl
const SegmentedControlItemIndicator = SegmentedControlPrimitive.ItemIndicator
const SegmentedControlItemDescription = SegmentedControlPrimitive.ItemDescription

export type { SegmentedControlRootProps, SegmentedControlOption }

export {
  SegmentedControl,
  SegmentedControlItems,
  SegmentedControlItemsProvider,
  SegmentedControlItem,
  SegmentedControlItemLabel,
  SegmentedControlLabel,
  SegmentedControlDescription,
  SegmentedControlErrorMessage,
  SegmentedControlIndicator,
  SegmentedControlItemInput,
  SegmentedControlItemControl,
  SegmentedControlItemIndicator,
  SegmentedControlItemDescription,
  SegmentedControlItemContext,
}
