import { Show, splitProps, type JSX } from "solid-js"
import { Avatar, AvatarImage, AvatarFallback } from "~/components/ui/avatar"
import { useCustomer } from "./customer-context"

export const CustomerName = () => {
  const ctx = useCustomer()
  return <Show when={ctx?.customer()}>{(c) => c().name ?? c().email}</Show>
}

export const CustomerEmail = () => {
  const ctx = useCustomer()
  return <Show when={ctx?.customer()?.email}>{(email) => email()}</Show>
}

export const CustomerPhone = () => {
  const ctx = useCustomer()
  return <Show when={ctx?.customer()?.phone}>{(phone) => phone()}</Show>
}

export const CustomerAvatar = (props: { children?: JSX.Element }) => {
  const ctx = useCustomer()
  return (
    <Show when={ctx?.customer()}>
      <Avatar>{props.children}</Avatar>
    </Show>
  )
}

export const CustomerAvatarImage = (props: Record<string, unknown>) => {
  const ctx = useCustomer()
  const [_, others] = splitProps(props, [])
  const customer = ctx?.customer()
  return (
    <Show when={customer?.avatarUrl}>
      <AvatarImage src={customer!.avatarUrl!} {...others} />
    </Show>
  )
}

export const CustomerAvatarFallback = (props: { children?: JSX.Element }) => {
  const ctx = useCustomer()
  const customer = ctx?.customer()
  return (
    <Show when={customer}>
      <AvatarFallback {...props}>
        {props.children ?? (customer!.name ?? customer!.email)?.charAt(0)}
      </AvatarFallback>
    </Show>
  )
}
