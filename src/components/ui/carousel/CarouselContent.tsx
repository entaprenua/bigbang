import type { Component, ComponentProps } from "solid-js"
import { splitProps, onMount, onCleanup } from "solid-js"
import { cn } from "~/lib/utils"
import { useCarousel } from "./CarouselContext"

type CarouselContentProps = ComponentProps<"div">

export const CarouselContent: Component<CarouselContentProps> = (props) => {
  const [local, others] = splitProps(props, ["class", "children"])
  const { carouselRef, orientation } = useCarousel()
  /*let ref: HTMLDivElement | undefined
  let initialized = false

  onMount(() => {
    if (!ref) return

    const tryInit = () => {
      if (initialized) return true
      if (ref!.children.length > 0 && ref!.children[0].children.length > 0) {
        initialized = true
        carouselRef(ref!)
        return true
      }
      return false
    }

    if (tryInit()) return

    const observer = new MutationObserver(() => {
      if (tryInit()) observer.disconnect()
    })
    observer.observe(ref, { childList: true, subtree: true })

    onCleanup(() => {
      observer.disconnect()
      if (initialized) carouselRef(null)
      initialized = false
    })
  })
  */
  return (
    <div ref={carouselRef/*ref*/} class="overflow-hidden">
      <div
        class={cn(
          "flex",
          orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col",
          local.class
        )}
        {...others}
      >
        {local.children}
      </div>
    </div>
  )
}
