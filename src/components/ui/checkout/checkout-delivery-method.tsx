import { splitProps, type JSX } from 'solid-js'
import { createMemo } from 'solid-js'
import { Select } from '../select'
import { RadioGroup } from '../radio-group'
import { SegmentedControl } from '../segmented-control'
import { cn } from '~/lib/utils'
import { useCheckout } from './checkout-context'
import { useCheckoutSettingsOptional } from './checkout-settings'

function useDeliveryMethodOptions(explicit?: string[]) {
  const settingsCtx = useCheckoutSettingsOptional()
  return createMemo(() => {
    if (explicit) return explicit
    const zones = settingsCtx?.settings().deliveryZones
    if (!zones || zones.length === 0) return []
    const seen = new Set<string>()
    return zones
      .flatMap((z) => z.methods)
      .filter((m) => {
        if (seen.has(m.methodId)) return false
        seen.add(m.methodId)
        return true
      })
      .map((m) => m.label)
  })
}

type CommonDeliveryMethodProps = {
  options?: string[]
  children?: JSX.Element
  class?: string
}

function CheckoutDeliveryMethodSelect(props: CommonDeliveryMethodProps & { placeholder?: string; itemComponent?: JSX.Element }) {
  const [local] = splitProps(props, ['options', 'placeholder', 'itemComponent', 'children', 'class'])
  const { formData, setField } = useCheckout()
  const options = useDeliveryMethodOptions(local.options)

  return (
    <Select<string>
      value={formData.deliveryMethod}
      onChange={(v) => setField('deliveryMethod', v)}
      options={options()}
      placeholder={local.placeholder}
      itemComponent={local.itemComponent}
      class={local.class}
    >
      {local.children}
    </Select>
  )
}

function CheckoutDeliveryMethodRadioGroup(props: CommonDeliveryMethodProps) {
  const [local] = splitProps(props, ['options', 'children', 'class'])
  const { formData, setField } = useCheckout()
  const options = useDeliveryMethodOptions(local.options)

  return (
    <RadioGroup
      options={options()}
      value={formData.deliveryMethod}
      onChange={(v) => setField('deliveryMethod', v)}
      class={local.class}
    >
      {local.children}
    </RadioGroup>
  )
}

function CheckoutDeliveryMethodSegmentedControl(props: CommonDeliveryMethodProps) {
  const [local] = splitProps(props, ['options', 'children', 'class'])
  const { formData, setField } = useCheckout()
  const options = useDeliveryMethodOptions(local.options)

  return (
    <SegmentedControl
      options={options()}
      value={formData.deliveryMethod}
      onChange={(v) => setField('deliveryMethod', v)}
      class={local.class}
    >
      {local.children}
    </SegmentedControl>
  )
}

export { CheckoutDeliveryMethodSelect, CheckoutDeliveryMethodRadioGroup, CheckoutDeliveryMethodSegmentedControl }
