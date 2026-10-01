import { createEffect, createSignal, onCleanup, type Accessor } from "solid-js"
import { useAuth } from "./auth-provider"

const DISMISS_KEY = "auth-prompt-dismissed"

export type AuthPromptState = {
  open: Accessor<boolean>
  onOpenChange: (open: boolean) => void
  dismiss: () => void
}

export const useAuthPromptState = (): AuthPromptState => {
  const auth = useAuth()
  const [open, setOpen] = createSignal(false)
  const [dismissed, setDismissed] = createSignal(
    typeof window !== "undefined" && sessionStorage.getItem(DISMISS_KEY) === "1"
  )

  createEffect(() => {
    if (auth.isLoading() || auth.isAuthenticated() || dismissed()) return
    const timer = setTimeout(() => setOpen(true), 1500)
    onCleanup(() => clearTimeout(timer))
  })

  createEffect(() => {
    if (auth.isAuthenticated()) setOpen(false)
  })

  const dismiss = () => {
    setOpen(false)
    setDismissed(true)
    if (typeof window !== "undefined") sessionStorage.setItem(DISMISS_KEY, "1")
  }

  const onOpenChange = (next: boolean) => {
    if (!next) dismiss()
  }

  return { open, onOpenChange, dismiss }
}
