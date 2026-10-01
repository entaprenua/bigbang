import type { JSX } from "solid-js"
import { Drawer } from "~/components/ui/drawer"
import { Dialog } from "~/components/ui/dialog"
import { useAuthPromptState } from "./auth-prompt-state"

export const AuthPromptDrawer = (props: { children?: JSX.Element }) => {
  const prompt = useAuthPromptState()

  return (
    <Drawer open={prompt.open()} onOpenChange={prompt.onOpenChange} side="bottom">
      {props.children}
    </Drawer>
  )
}

export const AuthPromptDialog = (props: { children?: JSX.Element }) => {
  const prompt = useAuthPromptState()

  return (
    <Dialog open={prompt.open()} onOpenChange={prompt.onOpenChange}>
      {props.children}
    </Dialog>
  )
}
