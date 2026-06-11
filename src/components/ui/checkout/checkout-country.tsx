import { splitProps, type JSX } from 'solid-js'
import { createMemo } from 'solid-js'
import { Select, type SelectOption } from '../select'
import { RadioGroup } from '../radio-group'
import { SegmentedControl } from '../segmented-control'
import { useCheckout } from './checkout-context'
import { useCheckoutSettingsOptional } from './checkout-settings'
import { COUNTRY_OPTIONS } from '~/lib/constants/countries'

function useCountryOptions(explicitCodes?: string[]) {
  const settingsCtx = useCheckoutSettingsOptional()
  return createMemo(() => {
    const codes = explicitCodes ?? settingsCtx?.settings().deliveryZones
      ?.flatMap((z) => z.locations.map((l) => l.country))
    return COUNTRY_OPTIONS.filter((c) => !codes || codes.includes(c.value))
  })
}

type CheckoutCountrySelectProps = {
  countryCodes?: string[]
  placeholder?: string
  itemComponent?: JSX.Element
  children?: JSX.Element
  class?: string
}

function CheckoutCountrySelect(props: CheckoutCountrySelectProps) {
  const [local] = splitProps(props, ['countryCodes', 'placeholder', 'itemComponent', 'children', 'class'])
  const { formData, setField } = useCheckout()
  const options = useCountryOptions(local.countryCodes)
  const selected = () => options().find((c) => c.value === formData.deliveryCountry)

  return (
    <Select<SelectOption>
      options={options()}
      optionValue="value"
      optionTextValue="label"
      value={selected()}
      onChange={(v) => setField('deliveryCountry', v.value)}
      placeholder={local.placeholder}
      itemComponent={local.itemComponent}
      class={local.class}
    >
      {local.children}
    </Select>
  )
}

type CheckoutCountryRadioGroupProps = {
  countryCodes?: string[]
  children?: JSX.Element
  class?: string
}

function CheckoutCountryRadioGroup(props: CheckoutCountryRadioGroupProps) {
  const [local] = splitProps(props, ['countryCodes', 'children', 'class'])
  const { formData, setField } = useCheckout()
  const options = useCountryOptions(local.countryCodes)

  return (
    <RadioGroup
      options={options()}
      value={formData.deliveryCountry}
      onChange={(v) => setField('deliveryCountry', v)}
      class={local.class}
    >
      {local.children}
    </RadioGroup>
  )
}

type CheckoutCountrySegmentedControlProps = {
  countryCodes?: string[]
  children?: JSX.Element
  class?: string
}

function CheckoutCountrySegmentedControl(props: CheckoutCountrySegmentedControlProps) {
  const [local] = splitProps(props, ['countryCodes', 'children', 'class'])
  const { formData, setField } = useCheckout()
  const options = useCountryOptions(local.countryCodes)

  return (
    <SegmentedControl
      options={options()}
      value={formData.deliveryCountry}
      onChange={(v) => setField('deliveryCountry', v)}
      class={local.class}
    >
      {local.children}
    </SegmentedControl>
  )
}

export { CheckoutCountrySelect, CheckoutCountryRadioGroup, CheckoutCountrySegmentedControl }
