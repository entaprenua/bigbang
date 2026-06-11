import { createContext, useContext, splitProps, type JSX, type ParentComponent, type ValidComponent } from "solid-js"
import type { PolymorphicProps } from "@kobalte/core/polymorphic"
import * as SelectPrimitive from "@kobalte/core/select"
import { cva } from "class-variance-authority"
import { cn } from "~/lib/utils"

// ============================================================================
// SelectItem Context
// ============================================================================

type SelectItemContextValue = { item: unknown }
const SelectItemContext = createContext<SelectItemContextValue | undefined>()

type SelectItemProviderProps = { item: unknown; children?: JSX.Element }
const SelectItemProvider: ParentComponent<SelectItemProviderProps> = (props) => {
  return (
    <SelectItemContext.Provider value={{ item: props.item }}>
      {props.children}
    </SelectItemContext.Provider>
  )
}

// ============================================================================
// Select Root (custom wrapper)
// ============================================================================

type SelectProps<T = unknown> = {
  value?: T
  onChange?: (value: T) => void
  options?: T[]
  optionValue?: string
  optionTextValue?: string
  optionDisabled?: string
  placeholder?: string
  disabled?: boolean
  name?: string
  validationState?: "valid" | "invalid"
  required?: boolean
  itemComponent?: JSX.Element
  children?: JSX.Element
  class?: string
}

function Select<T = unknown>(props: SelectProps<T>) {
  const [local] = splitProps(props, [
    "value", "onChange", "options", "optionValue", "optionTextValue", "optionDisabled",
    "placeholder", "disabled", "name", "validationState", "required",
    "itemComponent", "children", "class",
  ])

  return (
    <SelectPrimitive.Root<T>
      value={local.value}
      onChange={local.onChange}
      options={local.options}
      optionValue={local.optionValue as any}
      optionTextValue={local.optionTextValue as any}
      optionDisabled={local.optionDisabled as any}
      placeholder={local.placeholder}
      disabled={local.disabled}
      name={local.name}
      validationState={local.validationState}
      required={local.required}
      itemComponent={local.itemComponent ? (itemProps: any) => (
        <SelectItemProvider item={itemProps.item}>
          {local.itemComponent}
        </SelectItemProvider>
      ) : undefined}
      class={local.class}
    >
      {local.children}
    </SelectPrimitive.Root>
  )
}

// ============================================================================
// SelectValue
// ============================================================================

const SelectValue = <T,>() => {
  return (
    <SelectPrimitive.Value<T>>
      {(state: { selectedOption: () => T | undefined }) => {
        const v = state.selectedOption()
        return (v as any)?.label ?? v
      }}
    </SelectPrimitive.Value>
  )
}

// ============================================================================
// SelectTrigger
// ============================================================================

type SelectTriggerProps<T extends ValidComponent = "button"> =
  SelectPrimitive.SelectTriggerProps<T> & { class?: string | undefined; children?: JSX.Element }

const SelectTrigger = <T extends ValidComponent = "button">(
  props: PolymorphicProps<T, SelectTriggerProps<T>>
) => {
  const [local, others] = splitProps(props as SelectTriggerProps, ["class", "children"])
  return (
    <SelectPrimitive.Trigger
      class={cn(
        "flex h-10 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        local.class
      )}
      {...others}
    >
      {local.children}
    </SelectPrimitive.Trigger>
  )
}

// ============================================================================
// SelectContent (handcoded with Listbox)
// ============================================================================

type SelectContentProps<T extends ValidComponent = "div"> =
  SelectPrimitive.SelectContentProps<T> & { class?: string | undefined }

const SelectContent = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, SelectContentProps<T>>
) => {
  const [local, others] = splitProps(props as SelectContentProps, ["class"])
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        class={cn(
          "relative z-50 min-w-32 overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md animate-in fade-in-80",
          local.class
        )}
        {...others}
      >
        <SelectPrimitive.Listbox class="m-0 p-1" />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  )
}

// ============================================================================
// SelectItem
// ============================================================================

const SelectListbox = SelectPrimitive.Listbox
const SelectPortal = SelectPrimitive.Portal
const SelectIcon = SelectPrimitive.Icon
const SelectHiddenSelect = SelectPrimitive.HiddenSelect

type SelectItemProps = {
  class?: string
  children?: JSX.Element
}

const SelectItem = (props: SelectItemProps) => {
  const [local, others] = splitProps(props, ["class", "children"])
  const ctx = useContext(SelectItemContext)

  return (
    <SelectPrimitive.Item
      item={ctx?.item as any}
      class={cn(
        "relative mt-0 flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        local.class
      )}
      {...others}
    >
      {local.children}
    </SelectPrimitive.Item>
  )
}

const SelectItemLabel = (props: { class?: string }) => {
  const [local, others] = splitProps(props, ["class"])
  const ctx = useContext(SelectItemContext)
  const rawValue = (ctx?.item as any)?.rawValue
  const displayText = () => {
    if (rawValue == null) return ""
    if (typeof rawValue === "string") return rawValue
    return rawValue.label ?? rawValue.name ?? String(rawValue)
  }
  return (
    <SelectPrimitive.ItemLabel class={local.class} {...others}>
      {displayText()}
    </SelectPrimitive.ItemLabel>
  )
}

const SelectItemIndicator = SelectPrimitive.ItemIndicator

// ============================================================================
// Form Field Primitives
// ============================================================================

const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
  {
    variants: {
      variant: {
        label: "data-[invalid]:text-destructive",
        description: "font-normal text-muted-foreground",
        error: "text-xs text-destructive",
      },
    },
    defaultVariants: { variant: "label" },
  }
)

type SelectLabelProps<T extends ValidComponent = "label"> = SelectPrimitive.SelectLabelProps<T> & {
  class?: string | undefined
}

const SelectLabel = <T extends ValidComponent = "label">(
  props: PolymorphicProps<T, SelectLabelProps<T>>
) => {
  const [local, others] = splitProps(props as SelectLabelProps, ["class"])
  return <SelectPrimitive.Label class={cn(labelVariants(), local.class)} {...others} />
}

type SelectDescriptionProps<T extends ValidComponent = "div"> =
  SelectPrimitive.SelectDescriptionProps<T> & { class?: string | undefined }

const SelectDescription = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, SelectDescriptionProps<T>>
) => {
  const [local, others] = splitProps(props as SelectDescriptionProps, ["class"])
  return (
    <SelectPrimitive.Description
      class={cn(labelVariants({ variant: "description" }), local.class)}
      {...others}
    />
  )
}

type SelectErrorMessageProps<T extends ValidComponent = "div"> =
  SelectPrimitive.SelectErrorMessageProps<T> & { class?: string | undefined }

const SelectErrorMessage = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, SelectErrorMessageProps<T>>
) => {
  const [local, others] = splitProps(props as SelectErrorMessageProps, ["class"])
  return (
    <SelectPrimitive.ErrorMessage
      class={cn(labelVariants({ variant: "error" }), local.class)}
      {...others}
    />
  )
}

export type SelectOption = { value: string; label: string }

export {
  Select,
  SelectValue,
  SelectHiddenSelect,
  SelectTrigger,
  SelectContent,
  SelectListbox,
  SelectPortal,
  SelectIcon,
  SelectItem,
  SelectItemProvider,
  SelectItemLabel,
  SelectItemIndicator,
  SelectLabel,
  SelectDescription,
  SelectErrorMessage,
  SelectItemContext,
}
