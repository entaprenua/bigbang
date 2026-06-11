import { Index, type JSX } from "solid-js"

type RepeatProps = {
  count: number
  children?: JSX.Element
}

const Repeat = (props: RepeatProps) => {
  return (
    <Index each={Array(props.count)}>
      {() => props.children}
    </Index>
  )
}

export { Repeat }
export type { RepeatProps }
