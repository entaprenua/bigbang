# Currencies Components Architecture

## Overview

Atomic, composable currency display components that read from `SettingsProvider` context. Each `CurrenciesEntry` targets a single `ExchangeRate` from `storeSettings.currencies.rates[]` via `useSettings()`.

## Design Principles

1. **Codeless** — Components auto-read from `useSettings()` context, no manual data passing
2. **Composable** — Entry-level compounds: user chooses which currencies to display and how
3. **Explicit** — Each entry targets a specific currency by ISO code; user controls visibility
4. **Granular styling** — `Label`/`Value` children accept `class` for independent styling

## Data Flow

```
SettingsProvider fields={["currencies"]}
        ↓
useSettings().settings()?.currencies.rates  ←  ExchangeRate[]
        ↓
CurrenciesEntry name="KES"                 ←  finds rate where currency === name
        ↓
Sub-context { label (code), value (symbol) }
        ↓
CurrenciesEntryLabel / CurrenciesEntryValue
```

## Components

### CurrenciesEntry

Targets a single `ExchangeRate` from `currencies.rates[]` by matching `name` against `ExchangeRate.currency` (ISO code).

```tsx
<CurrenciesEntry name="KES" children?: JSX.Element>
  <CurrenciesEntryLabel class?: string />
  <CurrenciesEntryValue class?: string />
</CurrenciesEntry>
```

### CurrenciesEntryLabel

Renders the currency code (e.g. "KES", "USD", "EUR").

### CurrenciesEntryValue

Renders the currency symbol (e.g. "KSh", "$", "€").

## Usage

```tsx
import { SettingsProvider } from "~/components/ui/settings"
import {
  CurrenciesEntry,
  CurrenciesEntryLabel,
  CurrenciesEntryValue,
} from "~/components/ui/currencies"

<SettingsProvider fields={["currencies"]}>
  <CurrenciesEntry name="KES">
    <CurrenciesEntryLabel class="text-sm" />
    <CurrenciesEntryValue class="font-medium" />
  </CurrenciesEntry>

  <CurrenciesEntry name="USD">
    <CurrenciesEntryLabel />
    <CurrenciesEntryValue />
  </CurrenciesEntry>

  <CurrenciesEntry name="EUR">
    <CurrenciesEntryLabel />
    <CurrenciesEntryValue />
  </CurrenciesEntry>
</SettingsProvider>
```

### Combined with other settings

```tsx
<SettingsProvider fields={["about", "contact", "currencies"]}>
  <AboutEntry name="story">...</AboutEntry>
  <CurrenciesEntry name="KES">
    <CurrenciesEntryLabel />
    <CurrenciesEntryValue />
  </CurrenciesEntry>
</SettingsProvider>
```

## File Structure

```
src/components/ui/currencies/
├── index.tsx          # All components + barrel exports
└── STRUCTURE.md       # This file
```

## Context Hierarchy

```
SettingsProvider fields={["currencies"]}   (fetches currencies from storeSettings)
  └── CurrenciesEntry name="KES"
        └── CurrenciesEntryContext { label, value }
              ├── CurrenciesEntryLabel
              └── CurrenciesEntryValue
```

## Implementation

| Component | Status |
|-----------|--------|
| CurrenciesEntry | Done |
| CurrenciesEntryLabel | Done |
| CurrenciesEntryValue | Done |

## Future

- TODO: Add click handler to `CurrenciesEntry` to set preferred currency once backend supports it
