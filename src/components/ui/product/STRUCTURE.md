# Product Components Architecture

## Overview

Zero-code ready product components for the visual builder. Components are designed to be fully composable - users can include/exclude sections by simply adding/removing child components.

## Design Principles

1. **Zero-Code Ready** - All components work without manual setup; just drop them in and configure via props
2. **Composable** - Sections are separate components that can be included/excluded via children
3. **Context-Based** - Components read from ProductContext, no manual data passing
4. **Action Wrappers** - All triggers prevent click propagation and include state data attributes
5. **Server-Aligned** - All server endpoints and filters are supported

## Directory Structure

```
components/ui/product/
├── STRUCTURE.md              # This file
├── index.ts                  # Barrel exports
├── product-context.tsx       # Context + useProduct() hook
├── product-root.tsx          # Main Product component
├── product-sections.tsx       # All product section components
├── product-list.tsx          # ProductList
├── product-media.tsx         # ProductMedia + ProductMediaItem
├── product-variant.tsx       # ProductVariantProvider + option selectors
├── product-filter-context.tsx # ProductFilterProvider + useProductFilters()
├── product-filter-options.tsx # Filter option wrappers (Select, RadioGroup, SegmentedControl, Sort)
├── product-filter-chips.tsx   # Price inputs + applied chips + clear all
├── product-search.tsx        # ProductSearch (uses SearchProvider internally)
├── product-metadata.tsx      # ProductMetadataEntry compound components
├── product-pagination-context.tsx  # Cursor-based pagination context + provider
└── product-pagination.tsx          # ProductPaginationNext, Previous, Total
```

## Data Sources

Product resolves data from multiple sources in priority order:

1. **Collection item** - From `useCollectionItem()` (within Collection/List)
2. **Explicit data** - `data` prop passed directly
3. **Route params** - `productSlug` from URL params

```typescript
// Resolution order
const resolvedData = () => {
  if (collectionItem?.item) return collectionItem.item  // 1. Collection item
  if (local.data) return local.data                   // 2. Explicit data
  return undefined
}
```

## Component Hierarchy

```
Product (provides ProductProvider context)
├── ProductVariantProvider (resolves selected options → matching variant)
│   ├── ProductVariantOptionSelect / RadioGroup / SegmentedControl
│   └── Sections auto-read selected variant:
│       ├── ProductImage
│       ├── ProductName
│       ├── ProductDescription
│       ├── ProductSku
│       ├── ProductPrice
│       ├── ProductComparePrice
│       ├── ProductStockBadge
│       ├── ProductStockCount
│       └── ProductActionWrapper (wraps all triggers)
│           ├── ProductAddToCartTrigger
│           ├── ProductRemoveFromCartTrigger
│           ├── ProductAddToWishlistTrigger
│           ├── ProductRemoveFromWishlistTrigger
│           ├── ProductToggleWishlistTrigger
│           ├── ProductOrderTrigger
│           └── ProductQuantityActions
│               ├── ProductQuantityDecrementTrigger
│               ├── ProductQuantityInput
│               └── ProductQuantityIncrementTrigger

ProductSearch (Typesense autocomplete, navigates to ?search=...)
└── ProductList (reads params.search from router, refetches on URL change)

ProductFilterProvider (URL-synced state)
├── ProductFilterOptionSelect / RadioGroup / SegmentedControl
├── ProductFilterSortSelect
├── ProductFilterPriceMin / Max
├── ProductFilterAppliedChips / Chip / Label / Value / Remove
├── ProductFilterClearAll
└── ProductList (auto-reads filters from context)

ProductList
├── Collection (data fetching)
├── CollectionView (layout)
│   └── Product (per item)
├── CollectionContent (non-empty gate)
└── CollectionEmpty (empty gate)

ProductPaginationProvider (wraps list + buttons, provides cursor context)
├── ProductPaginationNext     → <button data-has-next>
├── ProductPaginationPrevious → <button data-has-previous>
└── ProductPaginationTotal    → <span> N products</span>

ProductMedia
├── Collection (iterates product.media or selectedVariant.media)
├── CollectionView
└── ProductMediaItem (renders image/video/audio)
```

## Usage Examples

### Search + Filter + Product List

```tsx
import { ProductSearch } from "./product-search"
import { ProductList } from "./product-list"
import { CollectionView, CollectionContent, CollectionEmpty } from "../collection"
import { ProductFilterProvider } from "./product-filter-context"
import { ProductFilterOptionCheckboxGroup } from "./product-filter-options"
import { ProductPaginationProvider } from "./product-pagination-context"
import { ProductPaginationPrevious, ProductPaginationNext, ProductPaginationTotal } from "./product-pagination"
import { SearchControl, SearchInput, SearchContent, SearchListbox, SearchItemLabel, SearchNoResult, useSearchItem } from "../search"

function SearchSuggestion() {
  const item = useSearchItem()
  return <SearchItemLabel>{item?.rawValue as string}</SearchItemLabel>
}

export default function ProductsPage() {
  return (
    <div class="space-y-6">
      <ProductSearch itemComponent={<SearchSuggestion />}>
        <SearchControl>
          <SearchInput placeholder="Search products..." />
        </SearchControl>
        <SearchContent>
          <SearchListbox />
          <SearchNoResult>No products found</SearchNoResult>
        </SearchContent>
      </ProductSearch>

      <ProductFilterProvider>
        <div class="flex gap-6">
          <aside class="w-64 space-y-4">
            <ProductFilterOptionCheckboxGroup field="brands" />
            <ProductFilterOptionCheckboxGroup field="vendors" />
          </aside>

          <main class="flex-1">
            <ProductPaginationProvider>
              <ProductList>
                <CollectionContent>
                  <CollectionView class="grid grid-cols-4 gap-4">
                    <Product class="border rounded-lg p-4">
                      <ProductImage class="w-full aspect-square object-cover" />
                      <ProductName class="font-semibold mt-2" />
                      <ProductPrice class="text-lg font-bold" />
                      <ProductAddToCartTrigger class="w-full mt-4" />
                    </Product>
                  </CollectionView>
                </CollectionContent>
                <CollectionEmpty />
              </ProductList>

              <div class="flex items-center justify-between mt-6">
                <ProductPaginationPrevious>Previous</ProductPaginationPrevious>
                <ProductPaginationTotal />
                <ProductPaginationNext>Next</ProductPaginationNext>
              </div>
            </ProductPaginationProvider>
          </main>
        </div>
      </ProductFilterProvider>
    </div>
  )
}
```

### Product List (All Products)

```tsx
<ProductList>
  <Grid cols={4} gap={4}>
    <CollectionView>
      <Product class="border rounded-lg p-4">
        <ProductImage class="w-full aspect-square object-cover" />
        <ProductName class="font-semibold mt-2" />
        <ProductPrice class="text-lg font-bold" />
        
        <ProductAddToCartTrigger class="w-full mt-4" />
      </Product>
    </CollectionView>
  </Grid>
</ProductList>
```

### Product List (Category Products)

Products inside a `<Category>` automatically fetch for that category:

```tsx
<Category>
  {/* Products are fetched for this category */}
  <ProductList>
    <CollectionContent>
      <Grid cols={4} gap={4}>
        <CollectionView>
          <Product class="border rounded-lg p-4">
            <ProductImage class="w-full aspect-square object-cover" />
            <ProductName class="font-semibold mt-2" />
            <ProductPrice class="text-lg font-bold" />
            <ProductAddToCartTrigger class="w-full mt-4" />
          </Product>
        </CollectionView>
      </Grid>
    </CollectionContent>
  </ProductList>
  
  {/* Subcategories */}
  <SubcategoryList>
    <CollectionContent>
      <CollectionView>
        <Category>
          {/* Nested products for subcategory */}
          <ProductList>
            <CollectionContent>
              <CollectionView>
                <Product />
              </CollectionView>
            </CollectionContent>
          </ProductList>
        </Category>
      </CollectionView>
    </CollectionContent>
  </SubcategoryList>
</Category>
```

### Product with Actions

```tsx
<Product class="border rounded-lg p-6">
  <ProductImage class="w-full aspect-square" />
  
  <ProductName class="text-2xl font-bold mt-4" />
  <ProductDescription class="text-muted mt-2" />
  <ProductSku class="text-sm text-muted mt-1" />
  
  <div class="flex items-baseline gap-2 mt-4">
    <ProductPrice class="text-3xl font-bold" />
    <ProductComparePrice class="text-lg" />
  </div>
  
  <ProductStockBadge class="mt-4" />
  <ProductStockCount class="text-sm text-muted mt-1" />
  
  <ProductQuantityActions class="mt-4" />
  
  <ProductAddToCartTrigger class="w-full mt-4" />
  <ProductAddToWishlistTrigger class="w-full mt-2" />
</Product>
```

### CSS-Based Visibility with Data Attributes

Triggers include data attributes for CSS-based visibility control:

```tsx
<Product class="border rounded-lg">
  <ProductImage />
  <ProductName />
  <ProductPrice />
  
  {/* Show/hide based on cart state via CSS */}
  <ProductAddToCartTrigger 
    class="data-[in-cart]:hidden w-full mt-4" 
  />
  <ProductRemoveFromCartTrigger 
    class="hidden data-[in-cart]:block w-full mt-4" 
  />
  
  {/* Same pattern for wishlist */}
  <ProductAddToWishlistTrigger 
    class="data-[in-wishlist]:hidden w-full mt-2" 
  />
  <ProductRemoveFromWishlistTrigger 
    class="hidden data-[in-wishlist]:block w-full mt-2" 
  />
</Product>
```

### Custom Product Card

```tsx
<Product class="group">
  <div class="relative overflow-hidden rounded-lg">
    <ProductImage class="w-full aspect-square transition-transform group-hover:scale-105" />
    <ProductStockBadge class="absolute top-2 right-2" />
  </div>
  
  <div class="mt-3 space-y-1">
    <ProductSku class="text-xs text-muted" />
    <ProductName class="font-medium line-clamp-2" />
    <div class="flex items-baseline gap-2">
      <ProductPrice class="font-bold" />
      <ProductComparePrice />
    </div>
  </div>
  
  <ProductQuantityActions class="mt-3" />
  <ProductAddToCartTrigger class="w-full mt-3" />
</Product>
```

## ProductActionWrapper

All triggers are wrapped with `ProductActionWrapper` which:

1. Prevents click propagation (stops navigation to product page)
2. Includes state data attributes (`data-in-cart`, `data-in-wishlist`)

```tsx
<ProductActionWrapper>
  <Button data-in-cart="true">Remove</Button>
</ProductActionWrapper>
```

## ProductMedia

ProductMedia iterates over `product.data.media` array:

```tsx
<ProductMedia>
  <CollectionView layout="grid" columns={4} gap={2}>
    <ProductMediaItem />
  </CollectionView>
</ProductMedia>

// Or with custom item
<ProductMedia>
  <CollectionView>
    <ProductMediaItem class="rounded-lg" />
  </CollectionView>
</ProductMedia>

// Using Image component (more robust)
<Image class="size-full">
  <ImageImg alt="Product" />
  <ImageFallback>No image</ImageFallback>
</Image>
```

## Props Reference

### ProductRoot

```typescript
type ProductRootProps = {
  // Data source (auto-resolved from collection/route)
  data?: ProductContextData | Product
  
  // Query options
  includeMedia?: boolean     // Fetch media (default: false)
  includeMetadata?: boolean  // Fetch metadata (default: false)
  queryKey?: unknown[]
  
  // UI options
  errorFallback?: JSX.Element
  loadingFallback?: JSX.Element
  href?: string             // For wrapping in link
  class?: string
  children?: JSX.Element
}
```

### ProductList

```typescript
type ProductListProps = {
  storeId?: string
  categoryId?: string           // Fetch products for this category (reads from CategoryContext if omitted)
  filters?: ProductFilters
  queryKey?: unknown[]
  enabled?: boolean
  children?: JSX.Element
}
```

**Notes:**
- The `search` filter is read from router params (`useSearchParams().search`) internally — no `searchQuery` prop needed.
- When `?search=...` is in the URL, products are fetched via `productsApi.getAll()` with the `search` filter.
- Uses cursor-based pagination (`after`/`before`) via `ProductPaginationProvider`. Query key is memoized to react to cursor changes.
- When used inside `<Category>`, the `categoryId` is automatically read from the CategoryContext. No need to pass it explicitly.

### ProductMedia

```typescript
type ProductMediaProps = {
  class?: string
  children?: JSX.Element
}

type ProductMediaItemProps = {
  src?: string
  type?: ProductMediaItemType
  alt?: string
  class?: string
  autoplay?: boolean
  controls?: boolean
  loop?: boolean
  muted?: boolean
  poster?: string
}
```

## Product Pagination

Cursor-based pagination using `(insertedAt, id)` tuples. No page numbers — Next/Previous buttons only. `ProductList` wraps children in `ProductPaginationProvider`, which exposes cursor state to atomic components.

### Components

| Component | Data attributes | Reads from context |
|-----------|----------------|--------------------|
| `ProductPaginationProvider` | — | N/A (provides context) |
| `ProductPaginationNext` | `data-has-next` | `hasNextPage`, `goNext` |
| `ProductPaginationPrevious` | `data-has-previous` | `hasPreviousPage`, `goPrevious` |
| `ProductPaginationTotal` | — | `totalElements` |

Buttons render always, no `disabled` prop. Styling via data attributes:

```css
/* User CSS — dim + no-click when no next page */
[data-has-next]:not([data-has-next=""]) { }
[data-has-next] { opacity: 0.4; pointer-events: none; }
```

Default Tailwind via `not-data-` variants:
```
not-data-[has-next]:pointer-events-none not-data-[has-next]:opacity-50
```

### Context

```typescript
type ProductPaginationContextValue = {
  pageSize: Accessor<number>
  totalElements: Accessor<number>
  hasNextPage: Accessor<boolean>
  hasPreviousPage: Accessor<boolean>
  after: Accessor<string | null>        // Cursor for next page
  before: Accessor<string | null>       // Cursor for previous page
  goNext: () => void                    // Sets after = nextCursor
  goPrevious: () => void                // Sets before = previousCursor
  goFirst: () => void                   // Resets both cursors
  syncPage: (response: ProductConnection) => void
  resetPagination: () => void
}
```

### Props

```typescript
type ProductPaginationNextProps = {
  class?: string
  children?: JSX.Element     // Defaults to "Next"
}

type ProductPaginationPreviousProps = {
  class?: string
  children?: JSX.Element     // Defaults to "Previous"
}

type ProductPaginationTotalProps = {
  class?: string             // Span props spread via ...others
}
```

### Usage

```tsx
<ProductPaginationProvider>
  <ProductList>
    <CollectionView class="grid grid-cols-4 gap-4">
      <CollectionContent>
        <Product>...</Product>
      </CollectionContent>
    </CollectionView>
    <CollectionEmpty />
  </ProductList>

  <div class="flex items-center justify-between mt-6">
    <ProductPaginationPrevious>Previous</ProductPaginationPrevious>
    <ProductPaginationTotal class="text-muted-foreground" />
    <ProductPaginationNext>Next</ProductPaginationNext>
  </div>
</ProductPaginationProvider>
```

### How it works

1. User wraps `ProductList` and pagination buttons in `ProductPaginationProvider`
2. `ProductList` reads `after`/`before` from context (optional — works without provider)
3. Calls `productsApi.getAll(after, before, size, filters)` with cursors from context
4. Response carries `nextCursor`, `previousCursor`, `hasNextPage`, `hasPreviousPage`
5. `syncPage(response)` stores cursors — triggers `queryKey` change via `createMemo`
6. User clicks "Next" → `goNext()` → `after` signal updates → `queryKey` re-evaluates → refetch

## Context API

### ProductContextValue

```typescript
type ProductContextValue = {
  data: Product
  isInCart: () => boolean
  isInWishlist: () => boolean
  cartQuantity: () => number
  update: (updates: Partial<ProductContextData>) => void
  getStockStatus: () => ProductStockStatus
  getAvailableQuantity: () => number
  isBackorderAllowed: () => boolean
}
```

### ProductVariantContextValue

```typescript
type ProductVariantContextValue = {
  selectedOptions: Record<string, string>  // { "Color": "Red", "Size": "M" }
  availableValues: (optionName: string) => string[]
  selectedVariant: () => ProductVariant | undefined
  select: (optionName: string, value: string) => void
}

useProductVariant()          // throws if outside provider (for option components)
useProductVariantOptional()   // returns undefined (for section components)
```

### ProductFilterContextValue

```typescript
type ProductFilterContextValue = {
  filters: () => ProductFilters
  setFilter: <K extends keyof ProductFilters>(key: K, value: ProductFilters[K]) => void
  removeFilter: (key: keyof ProductFilters) => void
  clearAll: () => void
  hasActiveFilters: () => boolean
}

useProductFilters()         // throws if outside provider (for filter UI components)
useProductFilterOptional()  // returns undefined (for ProductList auto-detection)
useProductFilterOptions()   // returns { options: (field) => string[], isLoading }

// Shared hook (internal, used by Select/RadioGroup/SegmentedControl components)
useFilterOption(field: string, explicitOptions?: string[])  // returns { options, value, setFilter }
```

## Inventory Status Logic

```typescript
function getStockStatus(product: Product): "in_stock" | "low_stock" | "out_of_stock" {
  if (!product.trackInventory) return "in_stock"
  
  const available = product.stockQuantity - product.reservedQuantity
  
  if (available <= 0) {
    return product.allowBackorder ? "in_stock" : "out_of_stock"
  }
  
  if (available <= product.lowStockThreshold) {
    return "low_stock"
  }
  
  return "in_stock"
}
```

## Image Component Alternative

Users can also use the robust `Image` component for more features:

```tsx
<Image class="size-full">
  <ImageImg alt="Product" />
  <ImageFallback>No image</ImageFallback>
</Image>
```

The `Image` component automatically infers:
- Product image from product context
- Category image from category context

## ProductSearch

ProductSearch provides a search bar with an autocomplete suggestions dropdown. It wraps `SearchProvider` internally with `productsApi.suggestions()` (Typesense-powered). On suggestion select or Enter key, it navigates to `?search=...` updating the URL, which triggers `ProductList` to refetch.

### Flow

```
User types "nike" → Typesense autocomplete → ["Nike Air Max", "Nike Revolution", ...]
User clicks suggestion or presses Enter → navigate("?search=Nike+Air+Max")
ProductList reads params.search from router → queryKey updates → re-fetches products
```

```typescript
type ProductSearchProps = {
  placeholder?: string
  class?: string
  itemComponent?: JSX.Element   // Passed via SearchItemProvider, use useSearchItem() inside
  children?: JSX.Element
}
```

**Usage:**

```tsx
import { SearchControl, SearchInput, SearchContent, SearchListbox, SearchItemLabel, SearchNoResult, useSearchItem } from "../search"

// Custom suggestion item
function SearchSuggestion() {
  const item = useSearchItem()
  return <SearchItemLabel>{item?.rawValue as string}</SearchItemLabel>
}

// Basic usage
<ProductSearch itemComponent={<SearchSuggestion />}>
  <SearchControl>
    <SearchInput placeholder="Search products..." />
  </SearchControl>
  <SearchContent>
    <SearchListbox />
    <SearchNoResult>No products found</SearchNoResult>
  </SearchContent>
</ProductSearch>
```

**Note:** ProductSearch returns lightweight string suggestions from Typesense (not full product objects). The `itemComponent` receives a `CollectionNode<string>` via `SearchItemProvider` — use `useSearchItem()` from `"../search"` to access `item.rawValue`. For the generic search component, see `search/STRUCTURE.md`.

## API Alignment

| Endpoint | Component Usage |
|----------|-----------------|
| `products(filters, pagination)` | `ProductList` fetches all products |
| `products(filters: { brand: "Nike", sortBy: "price" })` | `ProductList` with `ProductFilterProvider` context |
| `products(filters: { categoryId: "..." })` | `ProductList` inside `<Category>` |
| `products(filters: { search: "..." }, pagination: { after, before })` | `ProductList` — cursor-based pagination |
| `productFilterOptions(fields: ["brands","vendors"])` | `useProductFilterOptions()` — auto-fetches filter values |
| `productSuggestions(query, limit)` | `ProductSearch` — autocomplete suggestions from Typesense |

### Filter Fields (Server)

```typescript
type ProductFiltersInput = {
  search?: string;       categoryId?: string;    brand?: string
  vendor?: string;       productType?: string;    minPrice?: string
  maxPrice?: string;     minRating?: string;      sortBy?: string
  sortOrder?: string;    status?: string;         visibility?: string
}
```

### Filter Fields (Client)

```typescript
interface ProductFilters {
  // Single-value
  search?: string;  categoryId?: string;  brand?: string
  vendor?: string;  productType?: string;  minPrice?: number
  maxPrice?: number;  minRating?: number
  sortBy?: "name" | "price" | "createdAt"
  sortOrder?: "asc" | "desc"
  // Array (checkbox groups)
  brands?: string[];  vendors?: string[];  productTypes?: string[]
}
```

Client arrays → URL comma-separated: `?brands=Nike,Adidas`. Client `number` → API bridge converts to `String()` for GraphQL. 6 of 12 server single-value fields supported.

## Product Variants

Variant selection system for products with multiple option combinations (Color, Size, etc.). Reuses existing `Select`, `RadioGroup`, and `SegmentedControl` primitives.

### Architecture

```
Product (provides ProductProvider context)
  └── ProductVariantProvider (resolves selected options → matching variant)
        ├── ProductVariantOptionSelect name="Color"    → <Select> with derived options
        ├── ProductVariantOptionRadioGroup name="Size"  → <RadioGroup> with derived options
        ├── ProductVariantOptionSegmentedControl name="Material" → <SegmentedControl>
        └── Product sections auto-read selected variant via useProductVariantOptional()
              ├── ProductImage   → selectedVariant()?.image ?? variants?.[0]?.image
              ├── ProductPrice   → selectedVariant()?.price ?? variants?.[0]?.price
              ├── ProductSku     → selectedVariant()?.sku ?? variants?.[0]?.sku
              └── ProductMedia   → selectedVariant()?.media ?? product.data.media
```

### Usage

```tsx
<Product>
  <ProductVariantProvider>
    <ProductVariantOptionRadioGroup name="Color" />
    <ProductVariantOptionSegmentedControl name="Size" />
  </ProductVariantProvider>

  <ProductImage class="w-full aspect-square" />
  <ProductName class="text-2xl font-bold" />
  <ProductPrice class="text-3xl font-bold" />
  <ProductAddToCartTrigger />
</Product>
```

### Components

| Component | Role | Data source |
|-----------|------|-------------|
| `ProductVariantProvider` | Context for option selection, resolves matching variant | `product.variants[]` |
| `ProductVariantOptionSelect` | Dropdown for an option group | `variant.optionValues[]` grouped by `optionName` |
| `ProductVariantOptionRadioGroup` | Radio buttons for an option group | Same |
| `ProductVariantOptionSegmentedControl` | Pills for an option group | Same |
| `useProductVariantOptional()` | Optional hook — returns undefined outside provider | Internal |

### How sections auto-switch

All variant-dependent sections (`ProductImage`, `ProductPrice`, `ProductSku`, `ProductComparePrice`, `ProductDiscount`, `ProductMedia`, `ProductAddToCartTrigger`, `ProductOrderTrigger`) read `selectedVariant()` first, fallback to `variants?.[0]`. Zero changes needed in user code.

No variant selector → falls back to first variant. With `ProductVariantProvider` → auto-switches on option change.

---

## Product Filters

URL-synced filter system. `ProductFilterProvider` holds state, syncs to `?brand=Nike&sortBy=price` URL params, `ProductList` auto-detects provider and reads filters automatically.

### Architecture

```
ProductFilterProvider (state + URL sync)
  ├── Filter pickers (write filters)
  │   ├── ProductFilterOptionCheckboxGroup field="brands" options={["Nike","Adidas"]}
  │   │   └── ProductFilterOptionCheckbox
  │   │       ├── CheckboxControl + CheckboxIndicator
  │   │       └── CheckboxLabel "Nike"
  │   ├── ProductFilterOptionRadioGroup field="vendor" options={["Vendor A","Vendor B"]}
  │   ├── ProductFilterOptionSegmentedControl field="productType" options={["Shoes","Shirts"]}
  │   ├── ProductFilterOptionSelect field="vendor" options={[...]}
  │   ├── ProductFilterSortSelect
  │   ├── ProductFilterPriceMin → <NumberField>
  │   │   └── <NumberFieldInput placeholder="Min" />
  │   └── ProductFilterPriceMax → <NumberField>
  │       └── <NumberFieldInput placeholder="Max" />
  ├── Feedback layer (read filters)
  │   ├── ProductFilterAppliedChips class="flex gap-2"
  │   │   └── ProductFilterAppliedChip  (one per value for arrays)
  │   │       ├── ProductFilterAppliedChipLabel
  │   │       ├── ProductFilterAppliedChipValue
  │   │       └── ProductFilterAppliedChipRemove
  │   └── ProductFilterClearAll
  └── ProductList (reads filters from context automatically)
```

### Usage

```tsx
<ProductFilterProvider>
  <aside class="w-64 space-y-6">
    {/* Multi-select checkbox group (auto-fetched options) */}
    <ProductFilterOptionCheckboxGroup field="brands">
      <ProductFilterOptionCheckbox class="flex items-center gap-2">
        <CheckboxControl>
          <CheckboxIndicator />
        </CheckboxControl>
        <CheckboxLabel />
      </ProductFilterOptionCheckbox>
    </ProductFilterOptionCheckboxGroup>

    {/* Single-select radio (auto-fetched) */}
    <ProductFilterOptionRadioGroup field="vendor" />

    {/* Single-select pills (auto-fetched) */}
    <ProductFilterOptionSegmentedControl field="productType" />

    {/* Dropdown (auto-fetched) */}
    <ProductFilterOptionSelect field="brand" placeholder="Brand" />

    {/* Or with explicit override */}
    <ProductFilterOptionSelect field="brand" options={["Nike","Adidas"]} placeholder="Brand" />

    <div class="flex gap-2">
      <ProductFilterPriceMin>
        <NumberFieldInput placeholder="Min" />
      </ProductFilterPriceMin>
      <ProductFilterPriceMax>
        <NumberFieldInput placeholder="Max" />
      </ProductFilterPriceMax>
    </div>

    <ProductFilterSortSelect />
    <ProductFilterClearAll>Reset</ProductFilterClearAll>
  </aside>

  <main class="flex-1">
    <ProductFilterAppliedChips class="flex gap-2 flex-wrap mb-4">
      <ProductFilterAppliedChip class="inline-flex items-center gap-1 rounded-full border px-3 py-1 text-sm">
        <ProductFilterAppliedChipLabel />
        <span>:</span>
        <ProductFilterAppliedChipValue class="font-medium" />
        <ProductFilterAppliedChipRemove class="ml-1 size-4 p-0" />
      </ProductFilterAppliedChip>
    </ProductFilterAppliedChips>

    <ProductList>
      <CollectionContent>
        <div class="grid grid-cols-3 gap-4">
          <CollectionView>
            <Product>...</Product>
          </CollectionView>
        </div>
      </CollectionContent>
    </ProductList>
  </main>
</ProductFilterProvider>
```

**Note:** `ProductList` auto-detects `ProductFilterProvider` in the tree — no explicit `filters` prop needed. Still accepts explicit `filters` prop for standalone use.

`options` prop is optional on all filter option components. When omitted, values are auto-fetched from the `productFilterOptions(fields)` GraphQL endpoint, which returns distinct non-null values for the store's products. Explicit `options` prop always wins.

### Backend Distint Values

```
query ProductFilterOptions($fields: [String!]!) {
  productFilterOptions(fields: $fields) {
    brands
    vendors
    productTypes
  }
}
```

Returns sorted distinct non-null values per field. Cached client-side across components. One API call per store page load regardless of how many filter groups reference it.

### Filter State

```typescript
type ProductFilters = {
  // Single-value fields (radio, select, segmented)
  search?: string
  categoryId?: string
  brand?: string
  vendor?: string
  productType?: string
  minPrice?: number
  maxPrice?: number
  minRating?: number
  sortBy?: "name" | "price" | "createdAt"
  sortOrder?: "asc" | "desc"
  // Array fields (checkbox groups)
  brands?: string[]
  vendors?: string[]
  productTypes?: string[]
}
```

### URL Sync

| Filter change | URL |
|---------------|-----|
| Pick brand "Nike" | `?brand=Nike` |
| Check "Nike" + "Adidas" | `?brands=Nike,Adidas` |
| Set min price 50 | `?brands=Nike,Adidas&minPrice=50` |
| Uncheck "Nike" | `?brands=Adidas` |
| Clear all | `?` (empty) |

### Components

| Component | Role |
|-----------|------|
| `ProductFilterProvider` | State management + URL sync. `useProductFilters()` (throws), `useProductFilterOptional()` (optional). |
| `useProductFilterOptions()` | Auto-fetches distinct filter values from `productFilterOptions(fields)` GraphQL query. Returns `{ options: (field) => string[], isLoading }`. |
| `useFilterOption(field, explicitOptions?)` | Shared hook used by filter option components. Returns `{ options, value, setFilter }`. Derives options from explicit prop or `useProductFilterOptions()`. |
| `ProductFilterOptionSelect` | Dropdown for a single-value filter field. Props: `field`, `options?` (auto-fetched if omitted). |
| `ProductFilterOptionRadioGroup` | Radio buttons for a single-value filter field. Same props. |
| `ProductFilterOptionSegmentedControl` | Pills for a single-value filter field. Same props. |
| `ProductFilterOptionCheckboxGroup` | Multi-select checkbox group for array fields. Props: `field` (ArrayFilterKey), `options?` (auto-fetched if omitted). |
| `ProductFilterOptionCheckbox` | Individual checkbox within a CheckboxGroup. Reads `checked` + `onToggle` from group context. |
| `ProductFilterSortSelect` | Sort dropdown. Auto-splits `sortBy:sortOrder`. |
| `ProductFilterPriceMin` / `Max` | Wraps `<NumberField>`. User passes `<NumberFieldInput>` as child. |
| `ProductFilterAppliedChips` | Iterates active filters, provides per-chip context. Array filters explode to per-value chips. |
| `ProductFilterAppliedChip` | Template wrapper for a single chip. |
| `ProductFilterAppliedChipLabel` | Renders filter field label (e.g. "Brand"). |
| `ProductFilterAppliedChipValue` | Renders filter value (e.g. "Nike"). |
| `ProductFilterAppliedChipRemove` | Button that calls `removeFilter(key)` or `toggleFilter(key, value)` for arrays. |
| `ProductFilterClearAll` | Button to reset all filters. `children` overrides text, `class` styles. |

### How ProductList reads filters

```typescript
// Inside ProductList (auto-detected):
const filterCtx = useProductFilterOptional()
const filters = () => filterCtx?.filters() ?? /* explicit props.filters */

// Cursor-based query key — reacts to search, filters, and pagination cursors
const key = createMemo(() => {
  const q = searchQuery()
  const a = paginationCtx?.after()
  const b = paginationCtx?.before()
  return q
    ? ["products", "search", q, filters(), a, b]
    : categoryId()
      ? ["products", "category", randomKey(), categoryId(), a, b]
      : ["products", "all", randomKey(), filters(), a, b]
})
```

---

## Future Enhancements

### QueryTrigger Integration

`ProductActionWrapper` is a placeholder for future enhancements. In the future, triggers will integrate with QueryTrigger for mutation handling via API calls.

```tsx
// Future usage
<ProductActionWrapper mutationFn={() => addToCart()}>
  <ProductAddToCartTrigger />
</ProductActionWrapper>
```
