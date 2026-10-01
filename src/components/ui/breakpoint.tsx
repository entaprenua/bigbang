import { Show, type JSX } from "solid-js"
import { createMediaQuery } from "@solid-primitives/media"

const BREAKPOINTS = {
  xs: 480,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const

export type BreakpointSize = keyof typeof BREAKPOINTS

export type BreakpointProps = {
  min?: BreakpointSize
  max?: BreakpointSize
  children?: JSX.Element
}

export const Breakpoint = (props: BreakpointProps) => {
  const query = () => {
    const parts: string[] = []
    if (props.min) parts.push(`(min-width: ${BREAKPOINTS[props.min]}px)`)
    if (props.max) parts.push(`(max-width: ${BREAKPOINTS[props.max] - 1}px)`)
    return parts.join(" and ")
  }

  const matches = createMediaQuery(query())

  return <Show when={matches()}>{props.children}</Show>
}
