import { createContext, useContext, For, type JSX, type ValidComponent } from "solid-js"
import { splitProps } from "solid-js"

import type { PolymorphicProps } from "@kobalte/core/polymorphic"
import * as RadioGroupPrimitive from "@kobalte/core/radio-group"

import { cn } from "~/lib/utils"

type RadioGroupOption = string | { value: string; label: string; disabled?: boolean }

type RadioGroupContextValue = { options: () => RadioGroupOption[] | undefined; value: () => string | undefined }
const RadioGroupContext = createContext<RadioGroupContextValue>()

type RadioGroupItemContextValue = { value: string; label?: string; disabled?: boolean }
const RadioGroupItemContext = createContext<RadioGroupItemContextValue | undefined>()

function RadioGroupItemsProvider(props: { value: string; label?: string; disabled?: boolean; children?: JSX.Element }) {
  return (
    <RadioGroupItemContext.Provider value={{ value: props.value, label: props.label, disabled: props.disabled }}>
      {props.children}
    </RadioGroupItemContext.Provider>
  )
}

type RadioGroupRootProps<T extends ValidComponent = "div"> =
  RadioGroupPrimitive.RadioGroupRootProps<T> & { class?: string | undefined; options?: RadioGroupOption[] }

const RadioGroup = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, RadioGroupRootProps<T>>
) => {
  const [local, others] = splitProps(props as RadioGroupRootProps, ["class", "options", "value"])
  return (
    <RadioGroupContext.Provider value={{ options: () => local.options, value: () => local.value }}>
      <RadioGroupPrimitive.Root
        value={local.value}
        class={cn("grid gap-2", local.class)}
        {...others}
      />
    </RadioGroupContext.Provider>
  )
}

function RadioGroupItems(props: { children?: JSX.Element }) {
  const ctx = useContext(RadioGroupContext)!
  return (
    <For each={ctx.options()}>
      {(option) => {
        const isString = typeof option === "string"
        const val = isString ? option : option.value
        const label = isString ? undefined : option.label
        const disabled = isString ? undefined : option.disabled
        return (
          <RadioGroupItemsProvider value={val} label={label} disabled={disabled}>
            {props.children}
          </RadioGroupItemsProvider>
        )
      }}
    </For>
  )
}

type RadioGroupItemProps<T extends ValidComponent = "div"> =
  Omit<RadioGroupPrimitive.RadioGroupItemProps<T>, "value" | "disabled"> & {
    class?: string | undefined
    children?: JSX.Element
    value?: string
    disabled?: boolean
  }

const RadioGroupItem = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, RadioGroupItemProps<T>>
) => {
  const [local, others] = splitProps(props as RadioGroupItemProps, ["class", "children", "value", "disabled"])
  const itemCtx = useContext(RadioGroupItemContext)
  const resolvedValue = () => local.value ?? itemCtx?.value ?? ""
  const resolvedDisabled = () => local.disabled ?? itemCtx?.disabled ?? false
  return (
    <RadioGroupPrimitive.Item
      value={resolvedValue()}
      disabled={resolvedDisabled()}
      class={cn("flex items-center space-x-2", local.class)}
      {...others}
    >
      <RadioGroupPrimitive.ItemInput />
      <RadioGroupPrimitive.ItemControl class="aspect-square size-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 data-disabled:cursor-not-allowed data-disabled:opacity-50">
        <RadioGroupPrimitive.ItemIndicator class="flex h-full items-center justify-center ">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="size-2.5 fill-current text-current"
          >
            <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
          </svg>
        </RadioGroupPrimitive.ItemIndicator>
      </RadioGroupPrimitive.ItemControl>
      {local.children}
    </RadioGroupPrimitive.Item>
  )
}

type RadioGroupLabelProps<T extends ValidComponent = "label"> =
  RadioGroupPrimitive.RadioGroupLabelProps<T> & {
    class?: string | undefined
  }

const RadioGroupItemLabel = <T extends ValidComponent = "label">(
  props: PolymorphicProps<T, RadioGroupLabelProps<T>>
) => {
  const [local, others] = splitProps(props as RadioGroupLabelProps, ["class"])
  const itemCtx = useContext(RadioGroupItemContext)
  return (
    <RadioGroupPrimitive.ItemLabel
      class={cn(
        "text-sm font-medium leading-none data-disabled:cursor-not-allowed data-disabled:opacity-70",
        local.class
      )}
      {...others}
    >
      {itemCtx?.label ?? itemCtx?.value ?? ""}
    </RadioGroupPrimitive.ItemLabel>
  )
}

function RadioGroupValue() {
  const ctx = useContext(RadioGroupContext)!
  return <>{ctx.value() ?? ""}</>
}

const RadioGroupLabel = RadioGroupPrimitive.Label
const RadioGroupDescription = RadioGroupPrimitive.Description
const RadioGroupErrorMessage = RadioGroupPrimitive.ErrorMessage
const RadioGroupItemInput = RadioGroupPrimitive.ItemInput
const RadioGroupItemControl = RadioGroupPrimitive.ItemControl
const RadioGroupItemIndicator = RadioGroupPrimitive.ItemIndicator
const RadioGroupItemDescription = RadioGroupPrimitive.ItemDescription

export type { RadioGroupRootProps, RadioGroupOption }

export {
  RadioGroup,
  RadioGroupItems,
  RadioGroupItemsProvider,
  RadioGroupItem,
  RadioGroupItemLabel,
  RadioGroupValue,
  RadioGroupLabel,
  RadioGroupDescription,
  RadioGroupErrorMessage,
  RadioGroupItemInput,
  RadioGroupItemControl,
  RadioGroupItemIndicator,
  RadioGroupItemDescription,
  RadioGroupItemContext,
}
