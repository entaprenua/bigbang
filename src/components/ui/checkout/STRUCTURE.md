# Checkout Components Architecture

## Overview

Composable, context-driven checkout components for multi-step checkout flows. All option-based components (delivery methods, locations) fetch their available values internally from store settings — no manual `options` prop needed.

## Design Principles

1. **Context-Bound** — All checkout components read from `CheckoutContext` internally; no manual `value`/`onChange` wiring needed
2. **Self-Contained Fields** — Field atoms embed validation (email regex, phone regex) and default children (`Label` + `Input` + `ErrorMessage`)
3. **Override Mode** — Pass `children` to replace default markup while keeping context + validation binding
4. **Settings-Driven** — Delivery methods and locations are auto-derived from `deliveryZones` query via `CheckoutSettingsProvider`
5. **Primitive-Agnostic** — Same checkout concept (delivery method, location) available as `Select`, `RadioGroup`, or `SegmentedControl`
6. **No Defaults** — Consumer always provides full markup structure (trigger, content, items)

## Directory Structure

```
components/ui/checkout/
├── index.ts                      # Barrel exports
├── checkout-context.tsx           # CheckoutProvider + useCheckout() + CheckoutFormData
├── checkout-steps.tsx            # Step guards: CheckoutContactStep, CheckoutDeliveryStep, CheckoutPaymentStep, CheckoutConfirmationStep
├── checkout-settings.tsx         # CheckoutSettingsProvider — fetches delivery zones from API
├── checkout-delivery-method.tsx  # Delivery method selection: Select, RadioGroup, SegmentedControl
├── checkout-delivery-location.tsx # Delivery location selection: Select, RadioGroup, SegmentedControl
├── contact-fields.tsx            # Self-contained field atoms (email, name, phone, notes, paymentPhone)
├── address-fields.tsx            # Address field atoms via createAddressField factory
├── checkout-delivery-zone.tsx    # Zone resolution + method detail: label, price, conditions, class prices, estimates
├── checkout-payment-method.tsx   # Payment method selection: SelectButton, RadioGroup, SegmentedControl, wrapper
├── checkout-submit-provider.tsx  # MutationProvider wrapper — reads form data from context
├── checkout-result.tsx           # Success/error display from mutation state
└── STRUCTURE.md                  # This file
```

## Core Pattern

```tsx
<CheckoutSettingsProvider>
  <CheckoutProvider>
    <CheckoutDeliveryMethodSelect>
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectListbox />
      </SelectContent>
    </CheckoutDeliveryMethodSelect>

    <CheckoutDeliveryLocationSelect>
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectListbox />
      </SelectContent>
    </CheckoutDeliveryLocationSelect>
  </CheckoutProvider>
</CheckoutSettingsProvider>
```

No `options` prop — everything is fetched internally from store settings.

## Data Flow

```
CheckoutSettingsProvider
        │
        ▼
deliveryZones { locations (JSON string), methods (JSON string) }
        │
        ▼
Settings stored in CheckoutSettingsContext.deliveryZones
        │
        ▼
Delivery method options derived from deliveryZones.methods (parsed JSON object entries)
Delivery location options derived from deliveryZones.locations (parsed JSON string array)
        │
        ▼
User selects delivery method (label) → setField('deliveryMethod', label)
User selects delivery location → setField('deliveryLocation', value)
        │
        ▼
Zone auto-resolved from deliveryLocation → deliveryZones.find(zone with matching location in parsed array)
Delivery zone method details read the matched method by deliveryMethod label
        │
        ▼
CheckoutSubmitProvider reads formData and derives metadata from matched zone:
  → paymentMethod → provider
  → deliveryMethod → deliveryMethod (label), plus matched methodId + zoneId
  → deliveryLocation → deliveryCountry, deliveryCity (maps to backend fields)
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
  deliveryLocation: string
  billingAddress: Record<string, string>
  shippingAddress: Record<string, string>
  notes: string
  paymentMethod: string
  paymentPhone: string
}
```

### CheckoutSettingsProvider

Fetches delivery zones via GraphQL.

```typescript
type CheckoutSettingsProviderProps = {
  children?: JSX.Element
}

// Available via context:
type CheckoutSettings = {
  deliveryZones: DeliveryZone[]  // Zones with locations/methods as JSON strings
}
```

Below it, `CheckoutPaymentMethod` gates children by enabled methods, delivery method/location options are derived from `deliveryZones`, and zone method details read `formData.deliveryMethod` from `CheckoutContext`.

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

Three variants — `options` optional. When omitted, derived from `deliveryZones.methods` (parsed JSON object — unique label entries across all zones). Value stored as `formData.deliveryMethod` (label).

```typescript
// Select (dropdown) — also accepts placeholder, itemComponent
// RadioGroup (radio buttons) — children, class only
// SegmentedControl (segmented buttons) — children, class only
```

Options are derived from `CheckoutSettingsContext.deliveryZones` internally when `options` prop is omitted.

### Checkout Delivery Location

Three variants — `options` optional. When omitted, derived from `deliveryZones.locations` (parsed JSON string arrays across all zones). Value stored as `formData.deliveryLocation`.

```typescript
// Select (dropdown) — also accepts placeholder, itemComponent
// RadioGroup (radio buttons) — children, class only
// SegmentedControl (segmented buttons) — children, class only
```

Locations are unique string values parsed from each zone's `locations` JSON column.

### Checkout Delivery Zone

Once a location is selected, the matching zone is auto-resolved. `CheckoutDeliveryZoneMethod` reads `formData.deliveryMethod` from `CheckoutContext` — no `methodId` prop needed. All child components read the same matched method.

| Component | Role | Data source |
|-----------|------|-------------|
| `CheckoutDeliveryZoneName` | Zone name | Matched zone |
| `CheckoutDeliveryZoneMethod` | Context wrapper — gates children by method existence | Matched zone method by `formData.deliveryMethod` |
| `CheckoutDeliveryZoneMethodLabel` | Method display label | `method.label` |
| `CheckoutDeliveryZoneMethodPrice` | Method base price | `method.price` |
| `CheckoutDeliveryZoneMethodMinDays` / `MaxDays` | Est. delivery time (renders only if set) | `method.estMinDays` / `estMaxDays` |
| `CheckoutDeliveryZoneMethodConditions` | Auto-iterates parsed JSON conditions | `method.conditions` (JSON string) |
| `CheckoutDeliveryZoneMethodConditionLabel` / `Value` | Per-condition field label + value | Parent `Conditions` context |
| `CheckoutDeliveryZoneMethodClassPrices` | Auto-iterates class-specific prices from object | `method.classPrices` (JSON object) |
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
- `lineItems` from URL params `?productId=xxx&variantId=xxx` (Buy Now path)
- `provider` from `formData.paymentMethod`
- `deliveryMethod` (label), `deliveryMethodId` + `deliveryZoneId` derived from matched zone
- `deliveryLocation` → `deliveryCountry` / `deliveryCity` (maps to backend fields)
- `shippingAddress`, `billingAddress`
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

            <CheckoutDeliveryLocationSelect>
              <SelectTrigger>
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                <SelectListbox />
              </SelectContent>
            </CheckoutDeliveryLocationSelect>

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

### Delivery Location Variants

```tsx
// Select
<CheckoutDeliveryLocationSelect>
  <SelectTrigger><SelectValue /></SelectTrigger>
  <SelectContent><SelectListbox /></SelectContent>
</CheckoutDeliveryLocationSelect>

// RadioGroup
<CheckoutDeliveryLocationRadioGroup>
  <RadioGroupItems>
    <RadioGroupItem>
      <RadioGroupItemLabel />
    </RadioGroupItem>
  </RadioGroupItems>
</CheckoutDeliveryLocationRadioGroup>

// SegmentedControl
<CheckoutDeliveryLocationSegmentedControl>
  <SegmentedControlItems>
    <SegmentedControlItem>
      <SegmentedControlItemLabel />
    </SegmentedControlItem>
  </SegmentedControlItems>
</CheckoutDeliveryLocationSegmentedControl>
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
      <p>Delivering to: {formData.deliveryLocation}</p>
      <p>Via: {formData.deliveryMethod}</p>
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
  deliveryZones: DeliveryZone[]   // Zones with locations/methods as raw JSON strings
}
```

Provided by `CheckoutSettingsProvider`. Fetches delivery zones from the API. Payment method enablement comes from `getConfig()` in `src/lib/config.ts` (reads `.env` via `server$`).

### Step Guards

```typescript
<CheckoutContactStep>    // step === 'contact'
<CheckoutDeliveryStep>   // step === 'delivery'
<CheckoutPaymentStep>    // step === 'payment'
<CheckoutConfirmationStep> // step === 'confirmation'

// Steps are optional. Omit them to show all sections at once:
<CheckoutProvider>
  <CheckoutEmailTextField />
  <CheckoutDeliveryMethodRadioGroup />
  <CheckoutPaymentMethodRadioGroup />
  <CheckoutSubmitProvider>...</CheckoutSubmitProvider>
</CheckoutProvider>
```

## API Alignment

| Endpoint | Component Usage |
|----------|-----------------|
| `(getConfig server$ in src/lib/config.ts)` | `CheckoutPaymentMethod` — reads `mpesa_enabled`, `stripe_enabled` flags from `.env` |
| `deliveryZones { id name position locations methods }` | `CheckoutSettingsProvider` — location list, delivery methods, zone resolution, prices, conditions |
| `checkout(input: { ..., deliveryMethod, deliveryMethodId, deliveryZoneId, deliveryCountry, deliveryCity, ... })` | `CheckoutSubmitProvider` — infers provider, methodId + zoneId from matched zone, maps `deliveryLocation` to `deliveryCountry`/`deliveryCity`, builds AddressInput from formData |

No `options`, no `provider`, no `cartId`, no `methodId` props. Components read internally from `CheckoutContext` + `CheckoutSettingsContext` + `CartContext` + URL params + `getConfig()` for payment enablement.
