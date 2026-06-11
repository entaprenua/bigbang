import { createContext, useContext, For, type JSX, type ValidComponent } from "solid-js"
import { splitProps } from "solid-js"

import type { PolymorphicProps } from "@kobalte/core/polymorphic"
import * as SegmentedControlPrimitive from "@kobalte/core/segmented-control"

type SegmentedControlOption = string | { value: string; label: string }

type SegmentedControlContextValue = { options: () => SegmentedControlOption[] | undefined }
const SegmentedControlContext = createContext<SegmentedControlContextValue>()

type SegmentedControlItemContextValue = { value: string; label?: string }
const SegmentedControlItemContext = createContext<SegmentedControlItemContextValue | undefined>()

function SegmentedControlItemsProvider(props: { value: string; label?: string; children?: JSX.Element }) {
  return (
    <SegmentedControlItemContext.Provider value={{ value: props.value, label: props.label }}>
      {props.children}
    </SegmentedControlItemContext.Provider>
  )
}

type SegmentedControlRootProps = SegmentedControlPrimitive.SegmentedControlRootProps & { options?: SegmentedControlOption[] }

const SegmentedControl = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, SegmentedControlRootProps>
) => {
  const [local, others] = splitProps(props as SegmentedControlRootProps, ["options"])
  return (
    <SegmentedControlContext.Provider value={{ options: () => local.options }}>
      <SegmentedControlPrimitive.Root {...others} />
    </SegmentedControlContext.Provider>
  )
}

function SegmentedControlItems(props: { children?: JSX.Element }) {
  const ctx = useContext(SegmentedControlContext)!
  return (
    <For each={ctx.options()}>
      {(option) => {
        const val = typeof option === "string" ? option : option.value
        const label = typeof option === "string" ? undefined : option.label
        return (
          <SegmentedControlItemsProvider value={val} label={label}>
            {props.children}
          </SegmentedControlItemsProvider>
        )
      }}
    </For>
  )
}

type SegmentedControlItemProps<T extends ValidComponent = "div"> =
  SegmentedControlPrimitive.SegmentedControlItemProps<T> & { class?: string | undefined; children?: JSX.Element }

const SegmentedControlItem = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, SegmentedControlItemProps<T>>
) => {
  const [local, others] = splitProps(props as SegmentedControlItemProps, ["class", "children", "value"])
  const itemCtx = useContext(SegmentedControlItemContext)
  const resolvedValue = () => local.value ?? itemCtx?.value ?? ""
  return (
    <SegmentedControlPrimitive.Item value={resolvedValue()} class={local.class} {...others}>
      {local.children}
    </SegmentedControlPrimitive.Item>
  )
}

const SegmentedControlItemLabel = (props: { class?: string }) => {
  const [local, others] = splitProps(props, ["class"])
  const itemCtx = useContext(SegmentedControlItemContext)
  return (
    <SegmentedControlPrimitive.ItemLabel class={local.class} {...others}>
      {itemCtx?.label ?? itemCtx?.value ?? ""}
    </SegmentedControlPrimitive.ItemLabel>
  )
}

const SegmentedControlLabel = SegmentedControlPrimitive.Label
const SegmentedControlDescription = SegmentedControlPrimitive.Description
const SegmentedControlErrorMessage = SegmentedControlPrimitive.ErrorMessage
const SegmentedControlIndicator = SegmentedControlPrimitive.Indicator
const SegmentedControlItemInput = SegmentedControlPrimitive.ItemInput
const SegmentedControlItemControl = SegmentedControlPrimitive.ItemControl
const SegmentedControlItemIndicator = SegmentedControlPrimitive.ItemIndicator
const SegmentedControlItemDescription = SegmentedControlPrimitive.ItemDescription

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
