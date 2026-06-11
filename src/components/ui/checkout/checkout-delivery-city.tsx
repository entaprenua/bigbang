import { splitProps, type JSX } from 'solid-js'
import { createMemo } from 'solid-js'
import { Select } from '../select'
import { RadioGroup } from '../radio-group'
import { SegmentedControl } from '../segmented-control'
import { useCheckout } from './checkout-context'
import { useMatchedZone } from './checkout-delivery-zone'

function useCityOptions(explicit?: string[]) {
  const { formData } = useCheckout()
  const zone = useMatchedZone()
  return createMemo(() => {
    if (explicit) return explicit
    const country = formData.deliveryCountry
    if (!country) return []
    const location = zone()?.locations.find((l) => l.country === country)
    return location?.cities ?? []
  })
}

type CommonDeliveryCityProps = {
  options?: string[]
  children?: JSX.Element
  class?: string
}

function CheckoutDeliveryCitySelect(props: CommonDeliveryCityProps & { placeholder?: string; itemComponent?: JSX.Element }) {
  const [local] = splitProps(props, ['options', 'placeholder', 'itemComponent', 'children', 'class'])
  const { formData, setField } = useCheckout()
  const options = useCityOptions(local.options)

  return (
    <Select<string>
      value={formData.deliveryCity}
      onChange={(v) => setField('deliveryCity', v)}
      options={options()}
      placeholder={local.placeholder}
      itemComponent={local.itemComponent}
      class={local.class}
    >
      {local.children}
    </Select>
  )
}

function CheckoutDeliveryCityRadioGroup(props: CommonDeliveryCityProps) {
  const [local] = splitProps(props, ['options', 'children', 'class'])
  const { formData, setField } = useCheckout()
  const options = useCityOptions(local.options)

  return (
    <RadioGroup
      options={options()}
      value={formData.deliveryCity}
      onChange={(v) => setField('deliveryCity', v)}
      class={local.class}
    >
      {local.children}
    </RadioGroup>
  )
}

function CheckoutDeliveryCitySegmentedControl(props: CommonDeliveryCityProps) {
  const [local] = splitProps(props, ['options', 'children', 'class'])
  const { formData, setField } = useCheckout()
  const options = useCityOptions(local.options)

  return (
    <SegmentedControl
      options={options()}
      value={formData.deliveryCity}
      onChange={(v) => setField('deliveryCity', v)}
      class={local.class}
    >
      {local.children}
    </SegmentedControl>
  )
}

export { CheckoutDeliveryCitySelect, CheckoutDeliveryCityRadioGroup, CheckoutDeliveryCitySegmentedControl }
