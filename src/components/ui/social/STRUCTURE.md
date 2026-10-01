# Social Components Architecture

## Overview

Atomic, composable social-link components that read from `SettingsProvider` context. Each `SocialEntry` targets a single platform from `storeSettings.social` via `useSettings()`.

## Design Principles

1. **Codeless** — Components auto-read from `useSettings()` context, no manual data passing
2. **Composable** — Entry-level compounds: user chooses which platforms to render and how
3. **Explicit** — Each entry targets a specific platform by `name`; user controls visibility
4. **Granular styling** — `Label`, `Value`, `Link` children accept `class` for independent styling

## Data Flow

```
SettingsProvider fields={["social"]}
        ↓
useSettings().settings()?.social  ←  Facebook, Instagram, LinkedIn, TikTok, Twitter, YouTube
        ↓
SocialEntry name="facebook"       ←  Finds social[name]
        ↓
Sub-context { label, value }
        ↓
SocialEntryLabel / SocialEntryValue / SocialEntryLink
```

## Fallback Resolution

1. Data from `storeSettings.social` (truthy, non-empty)
2. `defaultValue` prop
3. Hidden — entire subtree not rendered

## Components

### SocialEntry

Targets a single platform URL from `SocialLinks` by `name`.

```tsx
<SocialEntry
  name: "facebook" | "instagram" | "linkedin" | "tiktok" | "twitter" | "youtube"
  defaultValue?: string
  children?: JSX.Element
>
  <SocialEntryLabel class?: string />
  <SocialEntryValue class?: string />
  <SocialEntryLink class?: string; target?: string; rel?: string />
</SocialEntry>
```

### SocialEntryLabel

Renders formatted platform name: `"facebook"` → `"Facebook"`, `"linkedin"` → `"Linkedin"`.

```typescript
type SocialEntryLabelProps = { class?: string }
```

### SocialEntryValue

Renders raw URL string.

```typescript
type SocialEntryValueProps = { class?: string }
```

### SocialEntryLink

Wraps children in `<a href={value}>`. Defaults to `target="_blank"` and `rel="noopener noreferrer"`.

```typescript
type SocialEntryLinkProps = {
  class?: string
  target?: string
  rel?: string
  children?: JSX.Element
}
```

## Usage Examples

### With Link Wrapper

```tsx
import { SettingsProvider } from "~/components/ui/settings"
import {
  SocialEntry,
  SocialEntryLabel,
  SocialEntryLink,
} from "~/components/ui/social"

<SettingsProvider fields={["social"]}>
  <div class="flex gap-4">
    <SocialEntry name="facebook">
      <SocialEntryLink class="hover:underline">
        <FacebookIcon />
        <SocialEntryLabel />
      </SocialEntryLink>
    </SocialEntry>

    <SocialEntry name="instagram">
      <SocialEntryLink class="hover:underline">
        <InstagramIcon />
        <SocialEntryLabel />
      </SocialEntryLink>
    </SocialEntry>

    <SocialEntry name="youtube">
      <SocialEntryLink class="hover:underline">
        <YoutubeIcon />
        <SocialEntryLabel />
      </SocialEntryLink>
    </SocialEntry>

    <SocialEntry name="twitter">
      <SocialEntryLink class="hover:underline">
        <TwitterIcon />
      </SocialEntryLink>
    </SocialEntry>
  </div>
</SettingsProvider>
```

### With Defaults

```tsx
<SettingsProvider fields={["social"]}>
  <SocialEntry name="facebook" defaultValue="https://facebook.com/coming-soon">
    <SocialEntryLink>
      <SocialEntryLabel />
    </SocialEntryLink>
  </SocialEntry>
</SettingsProvider>
```

### Raw URL

```tsx
<SettingsProvider fields={["social"]}>
  <SocialEntry name="instagram">
    <SocialEntryValue />
  </SocialEntry>
</SettingsProvider>
```

### Combined with About and Contact

```tsx
<SettingsProvider fields={["about", "contact", "social"]}>
  <AboutEntry name="story">
    <AboutEntryLabel />
    <AboutEntryValue />
  </AboutEntry>

  <SocialEntry name="facebook">
    <SocialEntryLink>
      <SocialEntryLabel />
    </SocialEntryLink>
  </SocialEntry>
</SettingsProvider>
```

## File Structure

```
src/components/ui/social/
├── index.tsx          # All components + barrel exports
└── STRUCTURE.md       # This file
```

## Context Hierarchy

```
SettingsProvider fields={["social"]}   (fetches social from storeSettings)
  └── SocialEntry name="facebook"
        └── SocialEntryContext { label, value }
              ├── SocialEntryLabel
              ├── SocialEntryValue
              └── SocialEntryLink
```

## Implementation

| Component | Status |
|-----------|--------|
| SocialEntry | Done |
| SocialEntryLabel | Done |
| SocialEntryValue | Done |
| SocialEntryLink | Done |
