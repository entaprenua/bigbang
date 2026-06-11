# Category Components Architecture

## Overview

Codeless, composable category components with automatic depth-controlled recursion. Users compose UI by nesting components without manual data passing.

## Design Principles

1. **Codeless** - Components auto-read from context, no manual data passing
2. **Composable** - Section primitives that users combine freely
3. **Auto-Nesting** - Nested `CategorySubcategories` automatically fetches children
4. **Atomic** - Raw value components, user provides styling
5. **Layout Flexible** - Layout is controlled by user via Grid, Flex, etc.

## Directory Structure

```
components/ui/category/
├── index.ts                    # Barrel exports
├── category-context.tsx        # Context + useCategory() hook
├── category-root.tsx           # Category (CategoryRoot) — single category fetch
├── category-list.tsx           # CategoryList, CategorySubcategories
├── category-sections.tsx        # Atomic primitives (name, image, slug, etc.)
└── STRUCTURE.md               # This file
```

## Core Pattern

```tsx
<CategoryList>
  <div class="space-y-4">
    <CollectionView>
      <Category class="border rounded-lg p-4">
        <div class="flex items-center gap-3">
          <CategoryImage class="h-20 w-20 rounded" />
          <CategoryName class="font-medium" />
        </div>

        <CategorySubcategories>
          <div class="ml-8 mt-3 space-y-2">
            <CollectionView>
              <Category class="border-l-2 border-muted pl-4 py-2">
                <CategoryName class="text-sm" />

                <CategorySubcategories>
                  <div class="ml-6 mt-2">
                    <CollectionView>
                      <Category class="text-sm text-muted-foreground py-1">
                        <CategoryName />
                      </Category>
                    </CollectionView>
                  </div>
                </CategorySubcategories>
              </Category>
            </CollectionView>
          </div>
        </CategorySubcategories>
      </Category>
    </CollectionView>
  </div>
</CategoryList>
```

### How Auto-Nesting Works

1. `CategoryList` fetches categories (root or full tree depending on `mode`)
2. Each iteration provides a `Category` with context from the current item
3. Nested `CategorySubcategories` reads the parent category ID via `useCategory()`
4. `CategorySubcategories` fetches children, wraps each in a new `Category`
5. Pattern repeats arbitrarily deep — no recursion limit, just stop nesting

### Mode Behavior

`CategoryList` accepts a `mode` prop that controls how data is fetched:

| Mode | API Call | Subcategories Source |
|------|----------|---------------------|
| `"tree"` (default) | `categoriesApi.getTree()` — full nested tree | Reads `.children` from the tree data |
| `"root"` | `categoriesApi.getRoot()` — root categories only | `categoriesApi.getByParent(id)` — fetches on demand |

In tree mode, `CategorySubcategories` reads from the already-fetched `category.children` array. In root mode, it makes a separate API call per level.

## Components

### CategoryList

Fetches categories with mode control.

```typescript
type CategoryListProps = {
  mode?: string         // "tree" (default) or "root"
  queryKey?: unknown[]
  enabled?: boolean
  children?: JSX.Element
}
```

```tsx
// Tree mode — single API call, subcategories from .children
<CategoryList mode="tree">
  ...
</CategoryList>

// Root mode — per-level fetches
<CategoryList mode="root">
  ...
</CategoryList>
```

### CategorySubcategories

Fetches children of the current category. In tree mode reads from `category.children`; in root mode calls `categoriesApi.getByParent(id)`.

```typescript
type CategorySubcategoriesProps = {
  queryKey?: unknown[]
  enabled?: boolean
  class?: string
  children?: JSX.Element
}
```

### Category (CategoryRoot)

Exported as `Category` (alias for `CategoryRoot`). Fetches a single category by slug, or reads from `CategoryList` context, or accepts explicit `data`.

```typescript
type CategoryRootProps = {
  categorySlug?: string      // Explicit slug to fetch
  data?: CategoryProps | null  // Explicit data (bypass fetch)
  href?: string              // If set, wraps in <A> linking to href/slug
  queryKey?: unknown[]
  class?: string
  children?: JSX.Element
}
```

**Data resolution order:**
1. If `data` is provided → use it directly
2. If inside `CollectionView` → use the current collection item
3. If `categorySlug` is set (or slug from route params) → fetch via `categoriesApi.getBySlug()`

**Usage:**

```tsx
// Automatic — reads slug from route params (e.g. /categories/:slug)
<Category>
  <CategoryImage class="w-24 h-24 rounded-lg" />
  <CategoryName class="text-3xl font-bold" />
</Category>

// Explicit slug
<Category categorySlug="electronics">
  <CategoryImage />
  <CategoryName />
</Category>

// With href — wraps content in a link
<Category href="/categories">
  <CategoryImage />
  <CategoryName />
</Category>
```

## Contexts

### CategoryContext

Provided by `Category` (and `CategoryProvider` in category-list). Exposed via `useCategory()`.

```typescript
type CategoryContextValue = {
  data: Accessor<CategoryProps | null>
  id: Accessor<string | null>
  name: Accessor<string | null>
  slug: Accessor<string | null>
  image: Accessor<string | null>
  level: Accessor<number | null>
  parentId: Accessor<string | null>
  path: Accessor<string | null>
  depth: Accessor<number | null>     // Derived from path segments
  isRoot: Accessor<boolean>          // True when parentId is null
}

// Throws if used outside CategoryContext
export const useCategory = (): CategoryContextValue

// Returns undefined if outside CategoryContext
export const useCategoryOptional = (): CategoryContextValue | undefined
```

## Atomic Section Primitives

All components read from `useCategoryData()` (prefers `CollectionItem`, falls back to `useCategory()`). User composes styling.

```typescript
<CategoryName class?: string />
<CategorySlug class?: string />
<CategoryImage class?: string; alt?: string />
<CategoryLevel class?: string />
<CategoryDepth class?: string />        // Depth from path segments
<CategoryPath class?: string />
<CategoryParentId class?: string />
<CategoryId class?: string />
```

`CategoryDepth` computes depth from `category.path` (e.g. `"1.4.7"` → 3). Falls back to `category.level`.

## Usage Examples

### Simple Grid

Homepage-style grid of category image cards. Each card links to `/categories/<slug>`.

```tsx
<CategoryList>
    <CollectionContent>
      <Grid cols={2} colsMd={3} colsLg={4} class="gap-4">
        <CollectionView>
          <Category href="/categories" class="group">
            <div class="relative overflow-hidden rounded-xl aspect-square bg-muted">
              <CategoryImage class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div class="absolute bottom-3 left-3 right-3">
                <CategoryName class="text-white text-sm font-semibold" />
              </div>
            </div>
          </Category>
        </CollectionView>
      </Grid>
    </CollectionContent>
</CategoryList>
```

### Sidebar Navigation

Text-only vertical list for sidebar/drawer navigation. Uses tree mode.

```tsx
<CategoryList mode="tree">
  <CollectionView class="flex flex-col gap-1">
    <Category href="/categories" class="block">
      <div class="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-muted transition-colors">
        <CategoryName />
      </div>
    </Category>
  </CollectionView>
</CategoryList>
```

### Recursive Tree with Depth Indicator

Nested `CategorySubcategories` renders a depth-aware category tree. Each level is indented and styled differently.

```tsx
<CategoryList>
  <div class="space-y-4">
    <CollectionView>
      <Category class="border rounded-lg p-4">
        <div class="flex items-center gap-3">
          <CategoryDepth class="bg-muted w-8 h-8 rounded-full flex items-center justify-center text-sm" />
          <CategoryName class="font-bold text-lg" />
        </div>

        <CategorySubcategories>
          <div class="ml-8 mt-4 space-y-2 border-l-2 border-muted pl-4">
            <CollectionView>
              <Category class="py-2">
                <div class="flex items-center gap-2">
                  <CategoryDepth class="bg-muted w-6 h-6 rounded-full text-xs flex items-center justify-center" />
                  <CategoryName class="font-medium" />
                </div>

                <CategorySubcategories>
                  <div class="ml-6 mt-2">
                    <CollectionView>
                      <Category class="py-1 text-sm text-muted-foreground">
                        <div class="flex items-center gap-2">
                          <CategoryDepth class="bg-muted w-5 h-5 rounded-full text-xs flex items-center justify-center" />
                          <CategoryName />
                        </div>
                      </Category>
                    </CollectionView>
                  </div>
                </CategorySubcategories>
              </Category>
            </CollectionView>
          </div>
        </CategorySubcategories>
      </Category>
    </CollectionView>
  </div>
</CategoryList>
```

### Single Category Page

A full-featured category page: hero area with category info, subcategories grid, and product listing.

```tsx
function CategoryPage() {
  return (
    <div class="min-h-screen bg-background">
      {/* Category hero — slugs from route params */}
      <div class="bg-white border-b">
        <div class="max-w-7xl mx-auto px-4 py-8">
          <Category>
            <div class="flex items-center gap-6">
              <CategoryImage class="w-24 h-24 rounded-lg object-cover" />
              <div>
                <CategoryName class="text-3xl font-bold" />
              </div>
            </div>
          </Category>
        </div>
      </div>

      <div class="max-w-7xl mx-auto px-4 py-8 space-y-12">
        {/* Subcategories */}
        <Category>
          <CategorySubcategories>
            <CollectionContent>
              <section>
                <h2 class="text-xl font-semibold mb-4">Subcategories</h2>
                <Grid cols={2} colsMd={3} colsLg={4} class="gap-4">
                  <CollectionView>
                    <Category href="/categories" class="block bg-white rounded-lg border overflow-hidden hover:shadow-md transition-shadow">
                      <CategoryImage class="w-full aspect-square object-cover" />
                      <div class="p-4">
                        <CategoryName class="font-medium text-center" />
                      </div>
                    </Category>
                  </CollectionView>
                </Grid>
              </section>
            </CollectionContent>
          </CategorySubcategories>
        </Category>

        {/* Products */}
        <ProductList>
          <CollectionContent>
            <section>
              <h2 class="text-xl font-semibold mb-4">Products</h2>
              <Grid cols={2} colsMd={3} colsLg={4} class="gap-4">
                <CollectionView>
                  <Product class="group bg-white rounded-lg border overflow-hidden hover:shadow-lg transition-shadow">
                    <div class="relative overflow-hidden">
                      <ProductImage class="w-full aspect-square object-cover group-hover:scale-105 transition-transform" />
                    </div>
                    <div class="p-4">
                      <ProductName class="font-medium line-clamp-2" />
                      <div class="flex items-baseline gap-2 mt-2">
                        <ProductPrice class="text-lg font-bold text-primary" />
                        <ProductComparePrice class="text-sm text-muted-foreground" />
                      </div>
                      <div class="mt-4">
                        <ProductAddToCartTrigger class="w-full" />
                      </div>
                    </div>
                  </Product>
                </CollectionView>
              </Grid>
            </section>
          </CollectionContent>
        </ProductList>
      </div>
    </div>
  )
}
```

## API Reference

| Component | Exported As | Key Props |
|-----------|------------|-----------|
| `CategoryList` | `CategoryList` | `mode`, `queryKey`, `enabled` |
| `CollectionView` | — | from `collection/index.tsx` |
| `CategorySubcategories` | `CategorySubcategories` | `queryKey`, `enabled`, `class` |
| `Category` | `Category`, `CategoryRoot` | `categorySlug`, `data`, `href`, `queryKey`, `class` |
| `CollectionContent` | — | from `collection/index.tsx` |
| `CollectionEmpty` | — | from `collection/index.tsx` |
| `CategoryName` | `CategoryName` | `class` |
| `CategorySlug` | `CategorySlug` | `class` |
| `CategoryImage` | `CategoryImage` | `class`, `alt` |
| `CategoryLevel` | `CategoryLevel` | `class` |
| `CategoryDepth` | `CategoryDepth` | `class` |
| `CategoryPath` | `CategoryPath` | `class` |
| `CategoryParentId` | `CategoryParentId` | `class` |
| `CategoryId` | `CategoryId` | `class` |
