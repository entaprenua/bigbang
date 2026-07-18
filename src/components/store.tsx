import {
  StoreName as Name,
  StoreLogo,
} from "~/components/ui/store"
import { splitProps } from "solid-js"
import { cn } from "~/lib/utils/"


export function Logo(props) {
  const [local, others] = splitProps(props, ["class"])
  return <StoreLogo class={cn("", local.class)} {...others} />
}

export const StoreName = () => <span class="text-xl font-serif font-medium tracking-wide"><Name /></span>
