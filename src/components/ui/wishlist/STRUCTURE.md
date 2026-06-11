# Wishlist Components Architecture

## Overview

This directory contains zero-code ready wishlist components for the visual builder. Components are designed to be fully composable - users can include/exclude sections by simply adding/removing child components. They integrate with existing `Product` components for displaying individual products.

## Design Principles

1. **Zero-Code Ready** - Components work without manual setup; just drop them in and configure via props
2. **Composable** - Sections are separate components that can be included/excluded via children
3. **Auto-Fetching** - Components fetch their own data using storeId from context
4. **Auto-Detection** - Components auto-detect storeId from `useStoreId()` context
5. **Context-Based** - Uses `CollectionItemContext` from Collection for unified item iteration
6. **Empty-Safe** - Hides completely when no products exist (no empty state shown)
7. **Auto-Save** - Wishlist changes are automatically synced to the server

## Backend Alignment

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/stores/{storeId}/wishlists` | Get user's wishlist for store |
| POST | `/api/v1/stores/{storeId}/wishlists` | Save wishlist with items |
| DELETE | `/api/v1/stores/{storeId}/wishlists/{id}` | Delete wishlist |

### WishlistResponse Type

```typescript
type WishlistResponse = {
  id: string;
  storeId: string;
  customerId: string;
  items?: WishlistItem[];
  insertedAt?: string;
  updatedAt?: string;
  version?: number;
}
```

## Directory Structure

```
src/components/ui/wishlist/
├── STRUCTURE.md              # This file
├── index.ts                  # Barrel exports
├── wishlist-context.tsx      # Context + useWishlist hook
└── wishlist-root.tsx         # WishlistRoot, WishlistItems
```

## useWishlist Hook

The `useWishlist` hook provides access to wishlist state and methods:

```typescript
const useWishlist = () => {
  // Returns WishlistStore
}
```

### WishlistStore

Extends `ItemListState` with wishlist-specific methods:

```typescript
type WishlistStore = ItemListState & {
  // State
  sync: (wishlist: WishlistResponse) => void
  addProduct: (product: ProductInput) => void
  toWishlistItems: () => WishlistItem[]
  
  // Actions
  save: () => Promise<void>           // Manual save
  isLoading: () => boolean
  error: () => string | null
  
  // Inherited from ItemListState
  items: Accessor<ItemListEntry[]>
  count: Accessor<number>
  isEmpty: Accessor<boolean>
  add: (item) => void
  remove: (id) => void
  clear: () => void
  hasProduct: (productId) => boolean
  // ... more
}
```

## Component Hierarchy

### Wishlist Page Layout
```
WishlistRoot (auto-fetches wishlist)
└── WishlistProvider (context)
    └── WishlistItems (Collection)
        └── Grid/Flex/Carousel (user's layout)
            └── CollectionView
                └── Product (auto-detects from context)
                    ├── ProductImage
                    ├── ProductName
                    └── ProductRemoveFromWishlistTrigger
    └── CollectionEmpty (shown when empty)
```

## Usage Pattern

```tsx
// With Grid layout
<WishlistRoot>
  <WishlistItems>
    <Grid cols={4} gap={4}>
      <CollectionView>
        {(item) => (
          <Product item={item}>
            <ProductImage class="rounded-lg aspect-square object-cover" />
            <ProductName />
            <ProductPrice />
            <ProductRemoveFromWishlistTrigger />
          </Product>
        )}
      </CollectionView>
    </Grid>
  </WishlistItems>
</WishlistRoot>

// With Flex layout
<WishlistRoot>
  <WishlistItems>
    <Flex gap={4}>
      <CollectionView>
        {(item) => (
          <Product item={item}>
            <ProductImage />
            <ProductName />
          </Product>
        )}
      </CollectionView>
    </Flex>
  </WishlistItems>
</WishlistRoot>
```

### Empty Wishlist

When the wishlist is empty, use `CollectionEmpty` to show a message:

```tsx
<WishlistRoot>
  <WishlistItems>
    <Grid cols={4} gap={4}>
      <CollectionView>
        <Product>
          <ProductImage />
          <ProductName />
        </Product>
      </CollectionView>
    </Grid>
    <CollectionEmpty />
  </WishlistItems>
</WishlistRoot>
```

## Props Reference

### WishlistRoot (wishlist-root.tsx)

```typescript
type WishlistRootProps = {
  data?: WishlistResponse           // Direct data passing (optional)
  class?: string
  children?: JSX.Element
}
```

**Note:** `storeId` is automatically inferred from `useStoreId()` context.

### WishlistItems (wishlist-root.tsx)

```typescript
type WishlistItemsProps = {
  class?: string
  children?: JSX.Element
}
```

## API Functions

### wishlistsApi (lib/api/wishlists.ts)

```typescript
export const wishlistsApi = {
  // Get user's wishlist for store
  get: async (storeId: string): Promise<WishlistResponse>
  
  // Save wishlist with items
  save: async (storeId: string, wishlist: Partial<WishlistResponse>): Promise<WishlistResponse>
  
  // Delete wishlist
  delete: async (storeId: string, wishlistId: string): Promise<{ deleted: boolean }>
}
```

## Integration with Product Components

Wishlist uses existing `Product` components for displaying each product. The Product component can include wishlist-specific triggers:

```tsx
<Product>
  <ProductImage />
  <ProductName />
  <ProductPrice />
  <ProductAddToWishlistTrigger />     // Add to wishlist
  <ProductRemoveFromWishlistTrigger /> // Remove from wishlist
  <ProductToggleWishlistTrigger />      // Toggle (smart button)
</Product>
```

### How It Works

1. `WishlistProvider` wraps the content and provides `useWishlist()`
2. `ProductRemoveFromWishlistTrigger` uses `useWishlist()` to remove the product
3. Changes are auto-synced to the server

## Empty Handling

Wishlist automatically hides when there are no items:

- No empty state message displayed
- Section is completely hidden if empty
- Consistent with standard wishlist behavior (show/hide)

## Loading & Error States

### Error Handling

- Network errors: Stored in `wishlist.error()`
- Failed to load: Error stored, can retry
- Save failed: Error stored, can retry

## Performance Considerations

- Auto-save on item changes (debounced)
- Uses TanStack Query for caching (via createResource)
- Product images lazy loaded

## Migration from Old Components

Old `WishlistProvider` from `~/lib/store-context` is deprecated.

```tsx
// OLD (deprecated)
<WishlistProvider>
  {children}
</WishlistProvider>

// NEW
<WishlistRoot>
  {children}
</WishlistRoot>
```
