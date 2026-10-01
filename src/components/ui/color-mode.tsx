import { isServer } from "solid-js/web"
import { ColorModeProvider, ColorModeScript, cookieStorageManagerSSR, useColorMode } from "@kobalte/core/color-mode"
import { getCookie } from "vinxi/http"
import { splitProps, mergeProps } from "solid-js"
import type { ParentComponent, ComponentProps } from "solid-js"
import { cn } from "~/lib/utils"
import { Button } from "./button"

function getServerCookies() {
  "use server"
  const colorMode = getCookie("kb-color-mode")
  return colorMode ? `kb-color-mode=${colorMode}` : ""
}

export const ColorMode: ParentComponent = (props) => {
  const storageManager = cookieStorageManagerSSR(isServer ? getServerCookies() : document.cookie)

  return (
    <>
      <ColorModeScript storageType={storageManager.type} />
      <ColorModeProvider storageManager={storageManager}>
        {props.children}
      </ColorModeProvider>
    </>
  )
}

export { useColorMode }

export function ColorModeToggleButton(rawProps: ComponentProps<typeof Button>) {
  const { toggleColorMode } = useColorMode()
  const props = mergeProps(
    {
      type: "button",
      variant: "ghost",
      size: "icon",
      onClick: () => toggleColorMode(),
    },
    rawProps
  )
  const [local, others] = splitProps(props, ["class"])
  return (
    <Button {...others} class={cn("rounded-full", local.class)}>
      {props.children}
    </Button>
  )
}
