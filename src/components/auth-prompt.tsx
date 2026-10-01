import { createSignal, Show } from "solid-js"
import { LoginForm, SignupForm } from "~/components/auth"
import {
  AuthPromptDrawer,
  AuthPromptDialog,
} from "~/components/ui/auth"
import { Breakpoint } from "~/components/ui/breakpoint"
import {
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "~/components/ui/drawer"
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogCloseButton,
} from "~/components/ui/dialog"
import { Button } from "~/components/ui/button"

const useAuthMode = () => {
  const [mode, setMode] = createSignal<"login" | "signup">("login")
  return { mode, setMode }
}

const AuthPromptTabs = ({ mode, setMode }: { mode: () => "login" | "signup"; setMode: (v: "login" | "signup") => void }) => {
  return (
    <div class="grid grid-cols-2 gap-2">
      <button
        type="button"
        class="rounded-md border border-border p-2 text-sm font-medium hover:bg-accent"
        classList={{ "bg-accent text-accent-foreground": mode() === "login", "text-muted-foreground": mode() !== "login" }}
        onClick={() => setMode("login")}
      >
        Sign in
      </button>
      <button
        type="button"
        class="rounded-md border border-border p-2 text-sm font-medium hover:bg-accent"
        classList={{ "bg-accent text-accent-foreground": mode() === "signup", "text-muted-foreground": mode() !== "signup" }}
        onClick={() => setMode("signup")}
      >
        Create account
      </button>
    </div>
  )
}

const AuthPromptForm = ({ mode, setMode }: { mode: () => "login" | "signup"; setMode: (v: "login" | "signup") => void }) => {
  return (
    <div class="flex flex-col gap-4">
      <AuthPromptTabs mode={mode} setMode={setMode} />
      <Show when={mode() === "login"} fallback={<SignupForm />}>
        <LoginForm />
      </Show>
    </div>
  )
}

export const AuthPrompt = () => {
  const { mode, setMode } = useAuthMode()

  return (
    <>
      <Breakpoint min="md">
        <AuthPromptDialog>
          <DialogContent class="w-full max-w-lg">
            <DialogHeader>
              <DialogTitle>{mode() === "login" ? "Sign in" : "Create your account"}</DialogTitle>
              <DialogDescription>
                {mode() === "login"
                  ? "Sign in to track orders, save favourites, and checkout faster."
                  : "Track orders, save favourites, faster checkout."}
              </DialogDescription>
            </DialogHeader>
            <AuthPromptForm mode={mode} setMode={setMode} />
            <DialogFooter>
              <DialogCloseButton as={Button} variant="outline" class="w-full">
                Maybe later
              </DialogCloseButton>
            </DialogFooter>
          </DialogContent>
        </AuthPromptDialog>
      </Breakpoint>
      <Breakpoint max="md">
        <AuthPromptDrawer>
          <DrawerContent class="mx-auto w-full max-w-96 rounded-t-xl">
            <DrawerHeader>
              <DrawerTitle>{mode() === "login" ? "Sign in" : "Create your account"}</DrawerTitle>
              <DrawerDescription>
                {mode() === "login"
                  ? "Sign in to track orders, save favourites, and checkout faster."
                  : "Track orders, save favourites, faster checkout."}
              </DrawerDescription>
            </DrawerHeader>
            <AuthPromptForm mode={mode} setMode={setMode} />
            <DrawerFooter>
              <DrawerClose as={Button} variant="outline" class="w-full">
                Maybe later
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </AuthPromptDrawer>
      </Breakpoint>
    </>
  )
}
