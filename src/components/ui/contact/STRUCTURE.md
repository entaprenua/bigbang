# Contact Components Architecture

## Overview

Atomic, composable contact-section components that read from `SettingsProvider` context. `ContactEntry` targets flat fields from `storeSettings.contact`, `ContactWorkingHoursEntry` targets a single `WorkingHours` item from the array.

## Design Principles

1. **Codeless** — Components auto-read from `useSettings()` context, no manual data passing
2. **Composable** — Entry-level compounds: user chooses which entries to render and how
3. **Explicit** — Each entry targets a specific field by `name`; user controls visibility
4. **Granular styling** — `Label`/`Value` children accept `class` for independent styling

## Data Flow

```
SettingsProvider fields={["contact"]}
        ↓
useSettings().settings()?.contact
        ↓
ContactEntry name="email"            ←  contact[name] flat field
ContactWorkingHoursEntry name="Mon"  ←  contact.workingHours.find(v => v.dayOfWeek === name)
        ↓
Sub-context { label, value }
        ↓
ContactEntryLabel / ContactEntryValue
ContactWorkingHoursEntryLabel / ContactWorkingHoursEntryValue
```

## Fallback Resolution

1. Data from `storeSettings.contact` (truthy, non-empty)
2. `defaultValue` prop
3. Hidden — entire subtree not rendered

## Components

### ContactEntry — flat fields

Targets a single field from `ContactSettings` by `name`.

```tsx
<ContactEntry
  name: "email" | "phone" | "address" | "latitude" | "longitude"
  defaultValue?: string
  children?: JSX.Element
>
  <ContactEntryLabel class?: string />
  <ContactEntryValue class?: string />
</ContactEntry>
```

`latitude` and `longitude` are floats — coerced to string for display.

### ContactWorkingHoursEntry — array items

Targets a single `WorkingHours` from `contact.workingHours[]` by matching `name` against `dayOfWeek`.

```tsx
<ContactWorkingHoursEntry
  name: string                // Matches WorkingHours.dayOfWeek
  defaultValue?: string
  children?: JSX.Element
>
  <ContactWorkingHoursEntryLabel class?: string />
  <ContactWorkingHoursEntryValue class?: string />
</ContactWorkingHoursEntry>
```

`ContactWorkingHoursEntryValue` auto-formats: `"Closed"` if `closed` is true, otherwise `"opens - closes"`.

## Usage Examples

### Contact Page

```tsx
import { SettingsProvider } from "~/components/ui/settings"
import {
  ContactEntry,
  ContactEntryLabel,
  ContactEntryValue,
  ContactWorkingHoursEntry,
  ContactWorkingHoursEntryLabel,
  ContactWorkingHoursEntryValue,
} from "~/components/ui/contact"

<SettingsProvider fields={["contact"]}>
  <section>
    <ContactEntry name="email">
      <ContactEntryLabel class="font-semibold" />
      <ContactEntryValue class="text-muted-foreground" />
    </ContactEntry>

    <ContactEntry name="phone" defaultValue="Coming soon">
      <ContactEntryLabel class="font-semibold" />
      <ContactEntryValue class="text-muted-foreground" />
    </ContactEntry>

    <ContactEntry name="address">
      <ContactEntryLabel class="font-semibold" />
      <ContactEntryValue class="text-muted-foreground" />
    </ContactEntry>
  </section>

  <section>
    <h3>Working Hours</h3>
    <div class="flex flex-col gap-1">
      <ContactWorkingHoursEntry name="Monday">
        <ContactWorkingHoursEntryLabel class="w-32 text-sm font-medium" />
        <ContactWorkingHoursEntryValue class="text-sm text-muted-foreground" />
      </ContactWorkingHoursEntry>

      <ContactWorkingHoursEntry name="Tuesday">
        <ContactWorkingHoursEntryLabel class="w-32 text-sm font-medium" />
        <ContactWorkingHoursEntryValue class="text-sm text-muted-foreground" />
      </ContactWorkingHoursEntry>

      <ContactWorkingHoursEntry name="Sunday" defaultValue="Closed">
        <ContactWorkingHoursEntryLabel class="w-32 text-sm font-medium" />
        <ContactWorkingHoursEntryValue class="text-sm text-muted-foreground" />
      </ContactWorkingHoursEntry>
    </div>
  </section>
</SettingsProvider>
```

### Minimal

```tsx
<SettingsProvider fields={["contact"]}>
  <ContactEntry name="email">
    <ContactEntryLabel />
    <ContactEntryValue />
  </ContactEntry>
</SettingsProvider>
```

### Combined with Map + Social

```tsx
<SettingsProvider fields={["contact", "integrations", "social"]}>
  <GoogleMap class="h-96" />
  <ContactEntry name="address">
    <ContactEntryValue />
  </ContactEntry>
  <ContactEntry name="phone">
    <ContactEntryLabel class="font-semibold" />
    <ContactEntryValue />
  </ContactEntry>
  <SocialEntry name="facebook">
    <SocialEntryLink />
  </SocialEntry>
</SettingsProvider>
```

## File Structure

```
src/components/ui/contact/
├── index.tsx          # All components + barrel exports
└── STRUCTURE.md       # This file
```

## Context Hierarchy

```
SettingsProvider fields={["contact"]}   (fetches contact from storeSettings)
  └── ContactEntry name="email"
        └── ContactEntryContext { label, value }
              ├── ContactEntryLabel
              └── ContactEntryValue
  └── ContactWorkingHoursEntry name="Monday"
        └── ContactWorkingHoursEntryContext { label, value }
              ├── ContactWorkingHoursEntryLabel
              └── ContactWorkingHoursEntryValue
```

## Implementation

| Component | Status |
|-----------|--------|
| ContactEntry | Done |
| ContactEntryLabel | Done |
| ContactEntryValue | Done |
| ContactWorkingHoursEntry | Done |
| ContactWorkingHoursEntryLabel | Done |
| ContactWorkingHoursEntryValue | Done |
