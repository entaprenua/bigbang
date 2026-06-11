# Checkout Components Architecture

## Overview

Composable, context-driven checkout components for multi-step checkout flows. All option-based components (delivery types, countries) fetch their available values internally from store settings — no manual `options` or `countryCodes` props.

## Design Principles

1. **Context-Bound** — All checkout components read from `CheckoutContext` internally; no manual `value`/`onChange` wiring needed
2. **Self-Contained Fields** — Field atoms embed validation (email regex, phone regex) and default children (`Label` + `Input` + `ErrorMessage`)
3. **Override Mode** — Pass `children` to replace default markup while keeping context + validation binding
4. **Settings-Driven** — Delivery methods, countries, and cities are auto-derived from `deliveryZones` query via `CheckoutSettingsProvider`
5. **Primitive-Agnostic** — Same checkout concept (delivery type, country) available as `Select`, `RadioGroup`, or `SegmentedControl`
6. **No Defaults** — Consumer always provides full markup structure (trigger, content, items)

## Directory Structure

```
components/ui/checkout/
├── index.ts                      # Barrel exports
├── checkout-context.tsx           # CheckoutProvider + useCheckout() + CheckoutFormData
├── checkout-steps.tsx            # Step guards: CheckoutContactStep, CheckoutDeliveryStep, CheckoutPaymentStep, CheckoutConfirmationStep
├── checkout-settings.tsx         # CheckoutSettingsProvider — fetches delivery settings from API
├── checkout-delivery-method.tsx # Delivery method selection: Select, RadioGroup, SegmentedControl
├── checkout-country.tsx          # Country wrappers: Select, RadioGroup, SegmentedControl
├── checkout-delivery-city.tsx   # City wrappers: Select, RadioGroup, SegmentedControl
├── contact-fields.tsx            # Self-contained field atoms (email, name, phone, notes, paymentPhone)
├── address-fields.tsx            # Address field atoms via createAddressField factory
├── checkout-delivery-zone.tsx  # Zone resolution + method detail: label, price, conditions, class prices, estimates
├── checkout-payment-method.tsx  # Payment method selection: SelectButton, RadioGroup, SegmentedControl, wrapper
├── checkout-submit-provider.tsx  # MutationProvider wrapper — reads form data from context
├── checkout-result.tsx           # Success/error display from mutation state
└── STRUCTURE.md                  # This file
```

## Core Pattern

```tsx
<CheckoutSettingsProvider>
  <CheckoutProvider>
    <CheckoutDeliveryTypeSelect>
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectListbox />
      </SelectContent>
    </CheckoutDeliveryTypeSelect>

    <CheckoutCountrySelect>
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectListbox />
      </SelectContent>
    </CheckoutCountrySelect>
  </CheckoutProvider>
</CheckoutSettingsProvider>
```

No `options`, no `countryCodes` — everything is fetched internally from store settings.

## Data Flow

```
CheckoutSettingsProvider
        │
        ▼
getConfig { mpesa_enabled, stripe_enabled }
deliveryZones { locations, methods, classPrices }
        │
        ▼
Settings stored in CheckoutSettingsContext (delivery) + config (payment flags)
        │
        ▼
Payment method wrappers read config flags via getConfig(), gate children per method
Delivery method options derived from deliveryZones (unique methodId+label pairs)
Country options derived from deliveryZones.locations (unique countries)
        │
        ▼
User selects delivery method → setField('deliveryMethod', methodId)
User selects delivery country → setField('deliveryCountry', code)
        │
        ▼
Zone auto-resolved from deliveryCountry → deliveryZones.find(zone with matching location)
Delivery zone method details read the matched method by deliveryMethod
        │
        ▼
CheckoutSubmitProvider reads formData and derives metadata from matched zone:
  → paymentMethod → provider
  → deliveryMethod → deliveryMethod (label), plus matched methodId + zoneId
  → deliveryCountry, deliveryCity
  → shippingAddress, billingAddress (AddressInput { street, city, state, zip, country })
  → name, phone, notes
        │
        ▼
GraphQL checkout(input: { cartId | lineItems, provider, deliveryMethod,
  deliveryMethodId, deliveryZoneId, deliveryCountry, deliveryCity,
  shippingAddress, billingAddress, name, phone, notes, paymentPhone, customerEmail })
```

## Components

### CheckoutFormData

```typescript
type CheckoutFormData = {
  email: string
  name: string
  phone: string
  deliveryMethod: string
  deliveryCountry: string
  deliveryCity: string
  billingAddress: Record<string, string>
  shippingAddress: Record<string, string>
  notes: string
  paymentMethod: string
  paymentPhone: string
}
```

### CheckoutSettingsProvider

Fetches store settings and delivery zones in parallel via GraphQL.

```typescript
type CheckoutSettingsProviderProps = {
  children?: JSX.Element
}

// Available via context:
type CheckoutSettings = {
  deliveryZones: DeliveryZone[]  // Full zone tree with locations, methods, classPrices
  shippingClasses: ShippingClass[]
}
```

Below it, `CheckoutPaymentMethod` gates children by enabled methods, delivery method/country options are derived from `deliveryZones`, and zone method details read `formData.deliveryMethod` from `CheckoutContext`.

```tsx
function useCheckoutSettings(): CheckoutSettingsContextType        // throws if outside provider
function useCheckoutSettingsOptional(): CheckoutSettingsContextType // returns undefined
```

### CheckoutProvider

```typescript
type CheckoutProviderProps = {
  children?: JSX.Element
}

// Context values (via useCheckout())
type CheckoutContextType = {
  formData: CheckoutFormData
  step: CheckoutStep       // 'contact' | 'delivery' | 'payment' | 'confirmation'
  setField: <K extends keyof CheckoutFormData>(key: K, value: CheckoutFormData[K]) => void
  setAddressField: (type: 'shipping' | 'billing', key: string, value: string) => void
  setStep: (step: CheckoutStep) => void
  reset: () => void
}
```

### Checkout Delivery Method

Three variants — `options` optional. When omitted, derived from `deliveryZones` (unique `methodId` + `label` pairs across all zones). Value stored as `formData.deliveryMethod` (methodId).

```typescript
// Select (dropdown) — also accepts placeholder, itemComponent
// RadioGroup (radio buttons) — children, class only
// SegmentedControl (segmented buttons) — children, class only
```

Options are derived from `CheckoutSettingsContext.deliveryZones` internally when `options` prop is omitted.

### Checkout Country

Three variants — `countryCodes` optional. When omitted, derived from `deliveryZones.locations` (unique country codes across all zones). Value stored as `formData.deliveryCountry` (country code).

```typescript
// CheckoutCountrySelect — also accepts placeholder, itemComponent
// CheckoutCountryRadioGroup — children, class only
// CheckoutCountrySegmentedControl — children, class only
```

Countries are filtered from `COUNTRY_OPTIONS` (from `i18n-iso-countries`) against unique country codes derived from `deliveryZones.locations`.

### Checkout Delivery City

Three variants — `options` optional. When omitted, derived from the matched zone's location for the selected country. Value stored as `formData.deliveryCity`.

```typescript
// Select (dropdown) — also accepts placeholder, itemComponent
// RadioGroup (radio buttons) — children, class only
// SegmentedControl (segmented buttons) — children, class only
```

Cities come from `matchedZone.locations[selectedCountry].cities`.

### Checkout Delivery Zone

Once a country is selected, the matching zone is auto-resolved. `CheckoutDeliveryZoneMethod` reads `formData.deliveryMethod` from `CheckoutContext` — no `methodId` prop needed. All child components read the same matched method.

| Component | Role | Data source |
|-----------|------|-------------|
| `CheckoutDeliveryZoneProvider` | Placeholder wrapper | — |
| `CheckoutDeliveryZoneName` | Zone name | Matched zone |
| `CheckoutDeliveryZoneMethod` | Context wrapper — gates children by method existence | Matched zone method by `formData.deliveryMethod` |
| `CheckoutDeliveryZoneMethodLabel` | Method display label | `method.label` |
| `CheckoutDeliveryZoneMethodPrice` | Method base price | `method.basePrice` |
| `CheckoutDeliveryZoneMethodMinDays` / `MaxDays` | Est. delivery time (renders only if set) | `method.estMinDays` / `estMaxDays` |
| `CheckoutDeliveryZoneMethodConditions` | Auto-iterates parsed JSON conditions | `method.conditions` (JSONB string) |
| `CheckoutDeliveryZoneMethodConditionLabel` / `Value` | Per-condition field label + value | Parent `Conditions` context |
| `CheckoutDeliveryZoneMethodClassPrices` | Auto-iterates class-specific prices | `method.classPrices` |
| `CheckoutDeliveryZoneMethodClassPriceLabel` / `Value` | Per-class shipping name + price | Parent `ClassPrices` context |

**Usage:**

```tsx
<CheckoutDeliveryZoneMethod>
  <CheckoutDeliveryZoneMethodLabel class="font-semibold" />
  <CheckoutDeliveryZoneMethodPrice />
  <CheckoutDeliveryZoneMethodMinDays />
  <span> – </span>
  <CheckoutDeliveryZoneMethodMaxDays />

  <CheckoutDeliveryZoneMethodConditions>
    <div class="flex justify-between">
      <CheckoutDeliveryZoneMethodConditionLabel />
      <CheckoutDeliveryZoneMethodConditionValue />
    </div>
  </CheckoutDeliveryZoneMethodConditions>

  <CheckoutDeliveryZoneMethodClassPrices>
    <div class="flex justify-between">
      <CheckoutDeliveryZoneMethodClassPriceLabel />
      <CheckoutDeliveryZoneMethodClassPriceValue />
    </div>
  </CheckoutDeliveryZoneMethodClassPrices>
</CheckoutDeliveryZoneMethod>
```

No `methodId` prop on any component. The method is selected via `formData.deliveryMethod` by the delivery method picker above.

### Checkout Payment Method

Three selection primitives + a gating wrapper. All write to `formData.paymentMethod` via `setField`. The `CheckoutPaymentMethod` wrapper gates children based on config flags returned by `getConfig()`.

| Component | Role | Wraps |
|-----------|------|-------|
| `CheckoutPaymentMethod` | Gating wrapper — hides children if method not enabled in config | Any payment UI element |
| `CheckoutPaymentMethodSelectButton` | Standalone button — `method` prop required or inferred from parent wrapper | `<Button>` |
| `CheckoutPaymentMethodRadioGroup` | Radio group — binds `value` + `onChange` to `formData.paymentMethod` | `<RadioGroup>` |
| `CheckoutPaymentMethodSegmentedControl` | Segmented control — binds `value` + `onChange` to `formData.paymentMethod` | `<SegmentedControl>` |

**Props:**

```typescript
// CheckoutPaymentMethod — gates children
type CheckoutPaymentMethodProps = {
  method: string           // "mpesa" | "stripe"
  children?: JSX.Element
}

// CheckoutPaymentMethodSelectButton — method inferred from parent or explicit
type CheckoutPaymentMethodSelectButtonProps = {
  method?: string          // Optional — inferred from parent CheckoutPaymentMethod wrapper
  class?: string
  children?: JSX.Element   // Defaults to label (e.g. "M-Pesa")
}

// CheckoutPaymentMethodRadioGroup — thin wrapper, no options prop
type CheckoutPaymentMethodRadioGroupProps = {
  class?: string
  children?: JSX.Element   // <RadioGroupItem value="..."> directly
}

// CheckoutPaymentMethodSegmentedControl — thin wrapper, no options prop
type CheckoutPaymentMethodSegmentedControlProps = {
  class?: string
  children?: JSX.Element   // <SegmentedControlItem value="..."> directly
}
```

**Data attribute:** `CheckoutPaymentMethodSelectButton` renders `data-selected` when the method is the current selection.

**Usage patterns:**

```tsx
// Radio group — each item gated
<CheckoutPaymentMethodRadioGroup>
  <CheckoutPaymentMethod method="mpesa">
    <RadioGroupItem value="mpesa">
      <RadioGroupItemLabel>M-Pesa</RadioGroupItemLabel>
    </RadioGroupItem>
  </CheckoutPaymentMethod>
  <CheckoutPaymentMethod method="stripe">
    <RadioGroupItem value="stripe">
      <RadioGroupItemLabel>Card</RadioGroupItemLabel>
    </RadioGroupItem>
  </CheckoutPaymentMethod>
</CheckoutPaymentMethodRadioGroup>

// Segmented control — same pattern
<CheckoutPaymentMethodSegmentedControl>
  <CheckoutPaymentMethod method="mpesa">
    <SegmentedControlItem value="mpesa">
      <SegmentedControlItemLabel>M-Pesa</SegmentedControlItemLabel>
    </SegmentedControlItem>
  </CheckoutPaymentMethod>
  <CheckoutPaymentMethod method="stripe">
    <SegmentedControlItem value="stripe">
      <SegmentedControlItemLabel>Card</SegmentedControlItemLabel>
    </SegmentedControlItem>
  </CheckoutPaymentMethod>
</CheckoutPaymentMethodSegmentedControl>

// Select button — method inferred from wrapper
<CheckoutPaymentMethod method="mpesa">
  <CheckoutPaymentMethodSelectButton>
    <span>M-Pesa</span>
    <span class="text-xs text-muted-foreground">Pay via mobile money</span>
  </CheckoutPaymentMethodSelectButton>
</CheckoutPaymentMethod>

// Select button — explicit method (standalone, no gating)
<CheckoutPaymentMethodSelectButton method="mpesa">
  <span>M-Pesa</span>
</CheckoutPaymentMethodSelectButton>
```

**Without `CheckoutSettingsProvider`:** All methods render (no gating). `CheckoutPaymentMethod` always shows children.

### Contact Fields

Self-contained field atoms with validation and default rendering:

```typescript
<CheckoutEmailTextField />         // Email validation regex
<CheckoutNameTextField />          // Required name
<CheckoutPhoneTextField />         // Phone format validation
<CheckoutNotesTextArea />          // Optional notes
<CheckoutPaymentPhoneTextField />  // Payment phone (M-Pesa number)
```

Each renders as:
```tsx
<TextField>
  <TextFieldLabel />
  <TextFieldInput />
  <TextFieldErrorMessage />
</TextField>
```

Override rendering by passing children:
```tsx
<CheckoutEmailTextField>
  <TextField class="flex flex-col gap-1">
    <TextFieldLabel class="font-semibold">Email Address</TextFieldLabel>
    <TextFieldInput class="border-2 p-3 rounded-lg" />
    <TextFieldErrorMessage class="text-red-500 text-sm" />
  </TextField>
</CheckoutEmailTextField>
```

### Address Fields

Created via `createAddressField` factory for each address type × field combination — 10 components total (Shipping + Billing × Street/City/State/Zip/Country).

### CheckoutSubmitProvider

```typescript
type CheckoutSubmitProviderProps = {
  onSuccess?: (data: CheckoutResult) => void
  onError?: (error: unknown) => void
  children?: JSX.Element
}
```

Wraps `MutationProvider`, reads `formData` from `CheckoutContext` and `deliveryZones` from `CheckoutSettingsContext`. Internally infers:
- `cartId` from `CartContext` (cart checkout path)
- `lineItems` from URL params `?productId=xxx&variantId=xxx` (Buy Now path)
- `provider` from `formData.paymentMethod`
- `deliveryMethod` (label), `deliveryMethodId` + `deliveryZoneId` derived from matched zone
- `deliveryCountry`, `deliveryCity`, `shippingAddress`, `billingAddress`
- `name`, `phone`, `notes`
- `paymentPhone`, `customerEmail`

All fields are sent to the GraphQL `checkout` mutation as `CheckoutInput`.

Exposes mutation state:
- `CheckoutMutationProvider` (alias for `MutationProvider`)
- `CheckoutButton` (alias for `MutationButton`)
- `CheckoutLoading` (alias for `MutationLoading`)
- `CheckoutError` (alias for `MutationError`)
- `CheckoutErrorMessage` (alias for `MutationErrorMessage`)

### CheckoutResult

Reads mutation state and renders success or error content.

## Usage Examples

### Complete Checkout Page

```tsx
function CheckoutPage() {
  return (
    <CheckoutSettingsProvider>
      <CheckoutProvider>
        <CheckoutContactStep>
          <div class="space-y-4">
            <CheckoutEmailTextField />
            <CheckoutNameTextField />
            <CheckoutPhoneTextField />
            <CheckoutNotesTextArea />
          </div>
        </CheckoutContactStep>

        <CheckoutDeliveryStep>
          <div class="space-y-4">
            <CheckoutDeliveryMethodSegmentedControl>
              <SegmentedControlItems>
                <SegmentedControlItem>
                  <SegmentedControlItemLabel />
                </SegmentedControlItem>
              </SegmentedControlItems>
            </CheckoutDeliveryMethodSegmentedControl>

            <CheckoutCountrySelect>
              <SelectTrigger>
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                <SelectListbox />
              </SelectContent>
            </CheckoutCountrySelect>

            <CheckoutDeliveryCitySelect>
              <SelectTrigger>
                <SelectValue placeholder="Select city" />
              </SelectTrigger>
              <SelectContent>
                <SelectListbox />
              </SelectContent>
            </CheckoutDeliveryCitySelect>

            <CheckoutDeliveryZoneMethod>
              <CheckoutDeliveryZoneMethodLabel />
              <CheckoutDeliveryZoneMethodPrice />
            </CheckoutDeliveryZoneMethod>
          </div>
        </CheckoutDeliveryStep>

        <CheckoutPaymentStep>
          <div class="space-y-4">
            <CheckoutPaymentMethodRadioGroup>
              <CheckoutPaymentMethod method="mpesa">
                <RadioGroupItem value="mpesa">
                  <RadioGroupItemLabel>M-Pesa</RadioGroupItemLabel>
                  <RadioGroupItemDescription>Pay via mobile money</RadioGroupItemDescription>
                </RadioGroupItem>
              </CheckoutPaymentMethod>
              <CheckoutPaymentMethod method="stripe">
                <RadioGroupItem value="stripe">
                  <RadioGroupItemLabel>Card</RadioGroupItemLabel>
                  <RadioGroupItemDescription>Debit or credit card</RadioGroupItemDescription>
                </RadioGroupItem>
              </CheckoutPaymentMethod>
            </CheckoutPaymentMethodRadioGroup>

            <CheckoutPaymentPhoneTextField />

            <CheckoutSubmitProvider>
              <CheckoutButton>Pay</CheckoutButton>
              <CheckoutLoading />
              <CheckoutErrorMessage />
            </CheckoutSubmitProvider>
          </div>
        </CheckoutPaymentStep>
      </CheckoutProvider>
    </CheckoutSettingsProvider>
  )
}
```

### Payment Method with Accordion

Each payment method is an accordion item. The trigger doubles as the selection
control. The submit button sits once at the bottom — the selected method is
already known from the accordion state. Two approaches:

**Composition** — `CheckoutPaymentMethodSelectButton` inside `AccordionTrigger`:

```tsx
<Accordion>
  <CheckoutPaymentMethod method="mpesa">
    <AccordionItem value="mpesa">
      <AccordionTrigger>
        <CheckoutPaymentMethodSelectButton>
          <span>M-Pesa</span>
          <span class="text-xs text-muted-foreground">Pay via mobile money</span>
        </CheckoutPaymentMethodSelectButton>
      </AccordionTrigger>
      <AccordionContent>
        <div class="space-y-4 pt-4">
          <CheckoutPaymentPhoneTextField />
        </div>
      </AccordionContent>
    </AccordionItem>
  </CheckoutPaymentMethod>
</Accordion>

<CheckoutSubmitProvider>
  <CheckoutButton>Pay</CheckoutButton>
</CheckoutSubmitProvider>
```

**Polymorphic** — `AccordionTrigger` renders as the select button via `as` prop:

```tsx
<Accordion>
  <CheckoutPaymentMethod method="mpesa">
    <AccordionItem value="mpesa">
      <AccordionTrigger as={CheckoutPaymentMethodSelectButton}>
        <span>M-Pesa</span>
        <span class="text-xs text-muted-foreground">Pay via mobile money</span>
      </AccordionTrigger>
      <AccordionContent>
        <div class="space-y-4 pt-4">
          <CheckoutPaymentPhoneTextField />
        </div>
      </AccordionContent>
    </AccordionItem>
  </CheckoutPaymentMethod>
</Accordion>

<CheckoutSubmitProvider>
  <CheckoutButton>Pay</CheckoutButton>
</CheckoutSubmitProvider>
```

### Delivery Method: Select

```tsx
<CheckoutDeliveryMethodSelect>
  <SelectTrigger>
    <SelectValue />
  </SelectTrigger>
  <SelectContent>
    <SelectListbox />
  </SelectContent>
</CheckoutDeliveryMethodSelect>
```

### Delivery Method: RadioGroup

```tsx
<CheckoutDeliveryMethodRadioGroup>
  <RadioGroupItems>
    <RadioGroupItem>
      <RadioGroupItemLabel />
    </RadioGroupItem>
  </RadioGroupItems>
</CheckoutDeliveryMethodRadioGroup>
```

### Delivery Method: SegmentedControl

```tsx
<CheckoutDeliveryMethodSegmentedControl>
  <SegmentedControlItems>
    <SegmentedControlItem>
      <SegmentedControlItemLabel />
    </SegmentedControlItem>
  </SegmentedControlItems>
</CheckoutDeliveryMethodSegmentedControl>
```

### Country Variants

```tsx
// Select
<CheckoutCountrySelect>
  <SelectTrigger><SelectValue /></SelectTrigger>
  <SelectContent><SelectListbox /></SelectContent>
</CheckoutCountrySelect>

// RadioGroup
<CheckoutCountryRadioGroup>
  <RadioGroupItems>
    <RadioGroupItem>
      <RadioGroupItemLabel />
    </RadioGroupItem>
  </RadioGroupItems>
</CheckoutCountryRadioGroup>

// SegmentedControl
<CheckoutCountrySegmentedControl>
  <SegmentedControlItems>
    <SegmentedControlItem>
      <SegmentedControlItemLabel />
    </SegmentedControlItem>
  </SegmentedControlItems>
</CheckoutCountrySegmentedControl>
```

### City Variants

```tsx
// Select
<CheckoutDeliveryCitySelect>
  <SelectTrigger><SelectValue /></SelectTrigger>
  <SelectContent><SelectListbox /></SelectContent>
</CheckoutDeliveryCitySelect>

// RadioGroup
<CheckoutDeliveryCityRadioGroup>
  <RadioGroupItems>
    <RadioGroupItem>
      <RadioGroupItemLabel />
    </RadioGroupItem>
  </RadioGroupItems>
</CheckoutDeliveryCityRadioGroup>

// SegmentedControl
<CheckoutDeliveryCitySegmentedControl>
  <SegmentedControlItems>
    <SegmentedControlItem>
      <SegmentedControlItemLabel />
    </SegmentedControlItem>
  </SegmentedControlItems>
</CheckoutDeliveryCitySegmentedControl>
```

### Custom Field Rendering

```tsx
<CheckoutEmailTextField>
  <TextField class="flex flex-col gap-1">
    <TextFieldLabel class="font-semibold">Email Address</TextFieldLabel>
    <TextFieldInput class="border-2 p-3 rounded-lg" />
    <TextFieldErrorMessage class="text-red-500 text-sm" />
  </TextField>
</CheckoutEmailTextField>
```

### Accessing Checkout State

```tsx
function OrderSummary() {
  const { formData } = useCheckout()
  return (
    <div>
      <p>Delivering to: {formData.deliveryCountry}</p>
      <p>Via: {formData.deliveryType}</p>
    </div>
  )
}
```

## Contexts

### CheckoutContext

```typescript
type CheckoutContextType = {
  formData: Accessor<CheckoutFormData>
  step: Accessor<CheckoutStep>
  setField: <K extends keyof CheckoutFormData>(key: K, value: CheckoutFormData[K]) => void
  setAddressField: (type: 'shipping' | 'billing', key: string, value: string) => void
  setStep: (step: CheckoutStep) => void
  reset: () => void
}

function useCheckout(): CheckoutContextType
// Throws if used outside CheckoutProvider
```

### CheckoutSettingsContext

```typescript
type CheckoutSettingsContextType = {
  settings: () => CheckoutSettings
  isLoading: () => boolean
}

type CheckoutSettings = {
  deliveryZones: DeliveryZone[]   // Full zone tree with locations, methods, classPrices
  shippingClasses: ShippingClass[]
}
```

Provided by `CheckoutSettingsProvider`. Fetches delivery zones from the API in parallel. Payment method enablement comes from `getConfig()` in `src/lib/config.ts` (reads `.env` via `server$`).

### Step Guards

```typescript
<CheckoutContactStep>    // step === 'contact'
<CheckoutDeliveryStep>   // step === 'delivery'
<CheckoutPaymentStep>    // step === 'payment'
<CheckoutConfirmationStep> // step === 'confirmation'

// Steps are optional. Omit them to show all sections at once:
<CheckoutProvider>
  <CheckoutEmailTextField />
  <CheckoutDeliveryTypeRadioGroup />
  <CheckoutPaymentMethodRadioGroup />
  <CheckoutSubmitProvider>...</CheckoutSubmitProvider>
</CheckoutProvider>
```

## Settings Schema

Store settings are configured in the admin panel. The delivery schema defines:

```json
{
  "type": "delivery",
  "fields": [
    {
      "key": "availableDeliveryTypes",
      "type": "OBJECT_ARRAY",
      "children": [
        { "key": "id", "type": "STRING" },
        { "key": "label", "type": "STRING" },
        { "key": "description", "type": "TEXT" },
        { "key": "price", "type": "NUMBER" }
      ]
    },
    {
      "key": "availableCountries",
      "type": "LIST",
      "itemType": "STRING"
    }
  ]
}
```

Admin configures which delivery types and countries are available. Storefront fetches them automatically.

## Countries Integration

```typescript
// src/lib/constants/countries.ts
import countries from "i18n-iso-countries"
import en from "i18n-iso-countries/langs/en.json"

countries.registerLocale(en)

export const COUNTRY_OPTIONS = Object.entries(countries.getNames("en"))
  .map(([value, label]) => ({ value, label }))
  .sort((a, b) => a.label.localeCompare(b.label))

export function getCountryName(code: string): string {
  return countries.getName(code, "en") ?? code
}
```

Store settings return `availableCountries: string[]` (codes). Checkout country wrappers filter `COUNTRY_OPTIONS` internally.

## API Alignment

| Endpoint | Component Usage |
|----------|-----------------|
| `(getConfig server$ in src/lib/config.ts)` | `CheckoutPaymentMethod` — reads `mpesa_enabled`, `stripe_enabled` flags from `.env` |
| `storeSettings { delivery { shippingClasses } }` | `CheckoutSettingsProvider` — shipping class names |
| `deliveryZones { locations, methods { ... }, classPrices { classId price } }` | `CheckoutSettingsProvider` — country list, delivery methods, zone resolution, prices, conditions |
| `checkout(input: { cartId \| lineItems, provider, deliveryMethod, deliveryMethodId, deliveryZoneId, deliveryCountry, deliveryCity, shippingAddress, billingAddress, name, phone, notes, paymentPhone, customerEmail })` | `CheckoutSubmitProvider` — infers provider, methodId + zoneId from matched zone, builds AddressInput from formData |

No `options`, no `provider`, no `cartId`, no `methodId` props. Components read internally from `CheckoutContext` + `CheckoutSettingsContext` + `CartContext` + URL params + `getConfig()` for payment enablement.
