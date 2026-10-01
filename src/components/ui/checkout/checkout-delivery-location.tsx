import { splitProps, createMemo, type JSX } from 'solid-js'
import { Select } from '../select'
import { RadioGroup } from '../radio-group'
import { SegmentedControl } from '../segmented-control'
import { useCheckout } from './checkout-context'
import { useCollectionItem } from '../collection'
import { parseLocations } from './checkout-delivery-zones'

function useLocationOptions() {
  const collectionItem = useCollectionItem()
  return createMemo(() => parseLocations(collectionItem?.item?.locations))
}

function useOnSelectLocation() {
  const { setField } = useCheckout()
  const collectionItem = useCollectionItem()
  return (v: string) => {
    setField('deliveryLocation', v)
    if (collectionItem?.item?.name) setField('deliveryZone', collectionItem.item.name)
  }
}

type CommonDeliveryLocationProps = {
  children?: JSX.Element
  class?: string
}

function CheckoutDeliveryLocationSelect(props: CommonDeliveryLocationProps & { placeholder?: string; itemComponent?: JSX.Element }) {
  const [local] = splitProps(props, ['placeholder', 'itemComponent', 'children', 'class'])
  const { formData } = useCheckout()
  const options = useLocationOptions()
  const onSelect = useOnSelectLocation()

  return (
    <Select<string>
      options={options()}
      value={formData.deliveryLocation}
      onChange={onSelect}
      placeholder={local.placeholder}
      itemComponent={local.itemComponent}
      class={local.class}
    >
      {local.children}
    </Select>
  )
}

function CheckoutDeliveryLocationRadioGroup(props: CommonDeliveryLocationProps) {
  const [local] = splitProps(props, ['children', 'class'])
  const { formData } = useCheckout()
  const options = useLocationOptions()
  const onSelect = useOnSelectLocation()

  return (
    <RadioGroup
      options={options()}
      value={formData.deliveryLocation}
      onChange={onSelect}
      class={local.class}
    >
      {local.children}
    </RadioGroup>
  )
}

function CheckoutDeliveryLocationSegmentedControl(props: CommonDeliveryLocationProps) {
  const [local] = splitProps(props, ['children', 'class'])
  const { formData } = useCheckout()
  const options = useLocationOptions()
  const onSelect = useOnSelectLocation()

  return (
    <SegmentedControl
      options={options()}
      value={formData.deliveryLocation}
      onChange={onSelect}
      class={local.class}
    >
      {local.children}
    </SegmentedControl>
  )
}

export { CheckoutDeliveryLocationSelect, CheckoutDeliveryLocationRadioGroup, CheckoutDeliveryLocationSegmentedControl }
