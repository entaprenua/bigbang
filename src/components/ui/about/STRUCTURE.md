# About Components Architecture

## Overview

Atomic, composable about-section components that read from `SettingsProvider` context. Each `*Entry` compound component matches a single key/value or label/value pair from `storeSettings.about` via `useSettings()`.

## Design Principles

1. **Codeless** — Components auto-read from `useSettings()` context, no manual data passing
2. **Composable** — Entry-level compounds: user chooses which entries to render and how
3. **Explicit** — Each entry targets a specific field by name; user controls visibility
4. **Granular styling** — `Label`/`Value` children accept `class` for independent styling

## Data Flow

```
SettingsProvider fields={["about"]}
        ↓
useSettings().settings()?.about  ←  Story, Mission, Vision, WhyUs, Values[]
        ↓
AboutEntry / AboutValuesEntry   ←  Finds the matching entry by name
        ↓
Sub-context { label, value }
        ↓
AboutEntryLabel / AboutEntryValue
AboutValuesEntryLabel / AboutValuesEntryValue
```

## Components

### AboutEntry — flat text fields

Targets a single field from `AboutSettings` by `name`. Maps `story`, `mission`, `vision`, `whyUs` to label+value pairs.

```tsx
<AboutEntry name="story" children?: JSX.Element>
  <AboutEntryLabel class?: string />
  <AboutEntryValue class?: string />
</AboutEntry>

<AboutEntry name="mission" />
<AboutEntry name="vision" />
<AboutEntry name="whyUs" />
```

### AboutValuesEntry — core value items

Targets a single `CoreValue` from `about.values[]` by matching `name` against `CoreValue.label`.

```tsx
<AboutValuesEntry name="Innovation" children?: JSX.Element>
  <AboutValuesEntryLabel class?: string />
  <AboutValuesEntryValue class?: string />
</AboutValuesEntry>
```

## Fallback Resolution

Both entries resolve values in this order:

1. Data from `storeSettings.about` (truthy, non-empty)
2. `defaultValue` prop
3. Hidden — entire subtree not rendered

```tsx
// Renders "Coming soon." if story is unset
<AboutEntry name="story" defaultValue="Coming soon.">
  <AboutEntryLabel />
  <AboutEntryValue />
</AboutEntry>

// Renders default description if "Integrity" value not found
<AboutValuesEntry name="Integrity" defaultValue="We act with honesty.">
  <AboutValuesEntryLabel />
  <AboutValuesEntryValue />
</AboutValuesEntry>
```

## Props Reference

### AboutEntry

```typescript
type AboutEntryProps = {
  name: "story" | "mission" | "vision" | "whyUs"
  defaultValue?: string       // Fallback when value is unset
  children?: JSX.Element
}

type AboutEntryLabelProps = { class?: string }
type AboutEntryValueProps = { class?: string }
```

### AboutValuesEntry

```typescript
type AboutValuesEntryProps = {
  name: string                // Matches CoreValue.label
  defaultValue?: string       // Fallback when description is unset
  children?: JSX.Element
}

type AboutValuesEntryLabelProps = { class?: string }
type AboutValuesEntryValueProps = { class?: string }
```

## Usage Examples

### About Page

```tsx
import { SettingsProvider } from "~/components/ui/settings"
import {
  AboutEntry,
  AboutEntryLabel,
  AboutEntryValue,
  AboutValuesEntry,
  AboutValuesEntryLabel,
  AboutValuesEntryValue,
} from "~/components/ui/about"

<SettingsProvider fields={["about"]}>
  <section>
    <AboutEntry name="story">
      <AboutEntryLabel class="text-2xl font-bold" />
      <AboutEntryValue class="prose mt-4" />
    </AboutEntry>
  </section>

  <section>
    <AboutEntry name="mission">
      <AboutEntryLabel class="text-2xl font-bold" />
      <AboutEntryValue class="prose mt-4" />
    </AboutEntry>
  </section>

  <section>
    <AboutEntry name="vision">
      <AboutEntryLabel class="text-2xl font-bold" />
      <AboutEntryValue class="prose mt-4" />
    </AboutEntry>
  </section>

  <section>
    <AboutEntry name="whyUs">
      <AboutEntryLabel class="text-2xl font-bold" />
      <AboutEntryValue class="prose mt-4" />
    </AboutEntry>
  </section>

  <section>
    <h2>Our Values</h2>
    <div class="grid grid-cols-3 gap-4 mt-4">
      <AboutValuesEntry name="Integrity">
        <AboutValuesEntryLabel class="font-semibold" />
        <AboutValuesEntryValue class="text-sm text-muted-foreground" />
      </AboutValuesEntry>

      <AboutValuesEntry name="Innovation">
        <AboutValuesEntryLabel class="font-semibold" />
        <AboutValuesEntryValue class="text-sm text-muted-foreground" />
      </AboutValuesEntry>

      <AboutValuesEntry name="Excellence">
        <AboutValuesEntryLabel class="font-semibold" />
        <AboutValuesEntryValue class="text-sm text-muted-foreground" />
      </AboutValuesEntry>
    </div>

    {/* Values not set in the store are silently hidden */}
  </section>
</SettingsProvider>
```

### Minimal

```tsx
<SettingsProvider fields={["about"]}>
  <AboutEntry name="story">
    <AboutEntryLabel />
    <AboutEntryValue />
  </AboutEntry>
</SettingsProvider>
```

### With Defaults

```tsx
<SettingsProvider fields={["about"]}>
  <AboutEntry name="story" defaultValue="Our story coming soon.">
    <AboutEntryLabel class="text-2xl font-bold" />
    <AboutEntryValue class="prose" />
  </AboutEntry>
</SettingsProvider>
```

### Selective (only what has content)

Only entries whose resolved values exist render. If both the data value and `defaultValue` are empty, the entire subtree is hidden. The user includes entries unconditionally; the component decides whether to render.

## File Structure

```
src/components/ui/about/
├── index.tsx          # All components + barrel exports
└── STRUCTURE.md       # This file
```

## Context Hierarchy

```
SettingsProvider fields={["about"]}   (fetches about from storeSettings)
  └── AboutEntry name="story"
        └── AboutEntryContext { label, value }
              ├── AboutEntryLabel
              └── AboutEntryValue
  └── AboutValuesEntry name="Innovation"
        └── AboutValuesEntryContext { label, value }
              ├── AboutValuesEntryLabel
              └── AboutValuesEntryValue
```

## Implementation

| Component | Status |
|-----------|--------|
| AboutEntry | Done |
| AboutEntryLabel | Done |
| AboutEntryValue | Done |
| AboutValuesEntry | Done |
| AboutValuesEntryLabel | Done |
| AboutValuesEntryValue | Done |
