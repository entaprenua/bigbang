import { splitProps, createMemo, type JSX } from 'solid-js'
import { Select } from '../select'
import { RadioGroup } from '../radio-group'
import { SegmentedControl } from '../segmented-control'
import { useCheckout } from './checkout-context'
import { useCollectionItem } from '../collection'
import { parseMethods } from './checkout-delivery-zones'

function useDeliveryMethodOptions() {
  const collectionItem = useCollectionItem()
  return createMemo(() => {
    const methods = parseMethods(collectionItem?.item?.methods)
    return Object.keys(methods)
  })
}

type CommonDeliveryMethodProps = {
  children?: JSX.Element
  class?: string
}

function CheckoutDeliveryMethodSelect(props: CommonDeliveryMethodProps & { placeholder?: string; itemComponent?: JSX.Element }) {
  const [local] = splitProps(props, ['placeholder', 'itemComponent', 'children', 'class'])
  const { formData, setField } = useCheckout()
  const options = useDeliveryMethodOptions()

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
  const [local] = splitProps(props, ['children', 'class'])
  const { formData, setField } = useCheckout()
  const options = useDeliveryMethodOptions()

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
  const [local] = splitProps(props, ['children', 'class'])
  const { formData, setField } = useCheckout()
  const options = useDeliveryMethodOptions()

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
