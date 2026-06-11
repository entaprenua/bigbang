import type { ValidComponent } from "solid-js"
import { splitProps } from "solid-js"

import type { PolymorphicProps } from "@kobalte/core/polymorphic"
import * as CheckboxPrimitive from "@kobalte/core/checkbox"

import { cn } from "~/lib/utils"

type CheckboxRootProps<T extends ValidComponent = "div"> =
  CheckboxPrimitive.CheckboxRootProps<T> & {
    class?: string | undefined
  }

const Checkbox = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, CheckboxRootProps<T>>,
) => {
  const [local, others] = splitProps(props as CheckboxRootProps, ["class"])
  return (
    <CheckboxPrimitive.Root
      class={cn("flex items-center gap-2", local.class)}
      {...others}
    />
  )
}

type CheckboxControlProps<T extends ValidComponent = "div"> =
  CheckboxPrimitive.CheckboxControlProps<T> & {
    class?: string | undefined
  }

const CheckboxControl = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, CheckboxControlProps<T>>,
) => {
  const [local, others] = splitProps(props as CheckboxControlProps, ["class"])
  return (
    <CheckboxPrimitive.Control
      class={cn(
        "flex size-4 shrink-0 items-center justify-center rounded-sm border border-primary ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[checked]:bg-primary data-[checked]:text-primary-foreground",
        local.class,
      )}
      {...others}
    />
  )
}

type CheckboxIndicatorProps<T extends ValidComponent = "div"> =
  CheckboxPrimitive.CheckboxIndicatorProps<T> & {
    class?: string | undefined
    children?: any
  }

const CheckboxIndicator = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, CheckboxIndicatorProps<T>>,
) => {
  const [local, others] = splitProps(props as CheckboxIndicatorProps, [
    "class",
    "children",
  ])
  return (
    <CheckboxPrimitive.Indicator
      class={cn("flex items-center justify-center text-current", local.class)}
      {...others}
    >
      {local.children ?? (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="size-4"
        >
          <path d="M5 12l5 5l10 -10" />
        </svg>
      )}
    </CheckboxPrimitive.Indicator>
  )
}

const CheckboxInput = CheckboxPrimitive.Input
const CheckboxLabel = CheckboxPrimitive.Label
const CheckboxDescription = CheckboxPrimitive.Description
const CheckboxErrorMessage = CheckboxPrimitive.ErrorMessage

export {
  Checkbox,
  CheckboxInput,
  CheckboxControl,
  CheckboxIndicator,
  CheckboxLabel,
  CheckboxDescription,
  CheckboxErrorMessage,
}
