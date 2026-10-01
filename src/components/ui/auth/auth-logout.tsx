import type { JSX } from "solid-js"
import { MutationProvider } from "~/components/ui/query"
import { useAuth } from "./auth-provider"

type AuthLogoutProps = {
  onSuccess?: () => void
  children?: JSX.Element
}

const AuthLogout = (props: AuthLogoutProps) => {
  const auth = useAuth()

  return (
    <MutationProvider mutationFn={() => auth.logout()} onSuccess={props.onSuccess}>
      {props.children}
    </MutationProvider>
  )
}

export { AuthLogout }
export type { AuthLogoutProps }