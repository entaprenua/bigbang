import { Show, type JSX } from 'solid-js'
import { useCheckout } from './checkout-context'

type StepProps = { children?: JSX.Element; class?: string }

function CheckoutContactStep(props: StepProps) {
  const checkout = useCheckout()
  return <Show when={checkout.step === 'contact'}><div class={props.class}>{props.children}</div></Show>
}

function CheckoutDeliveryStep(props: StepProps) {
  const checkout = useCheckout()
  return <Show when={checkout.step === 'delivery'}><div class={props.class}>{props.children}</div></Show>
}

function CheckoutPaymentStep(props: StepProps) {
  const checkout = useCheckout()
  return <Show when={checkout.step === 'payment'}><div class={props.class}>{props.children}</div></Show>
}

function CheckoutConfirmationStep(props: StepProps) {
  const checkout = useCheckout()
  return <Show when={checkout.step === 'confirmation'}><div class={props.class}>{props.children}</div></Show>
}

export { CheckoutContactStep, CheckoutDeliveryStep, CheckoutPaymentStep, CheckoutConfirmationStep }
