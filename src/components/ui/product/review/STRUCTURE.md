# Product Review Components Architecture

## Overview

Zero-code review components for displaying product reviews. Built on the Collection pattern — fully composable, context-driven, no manual data passing.

## Directory Structure

```
components/ui/product/review/
├── STRUCTURE.md                        # This file
├── index.ts                            # Barrel exports
├── product-review-list.tsx             # ProductReviewList
├── product-review-list-item.tsx        # ProductReviewListItem + Stars/Author/Date/Comment
└── product-review-list-item-media.tsx  # Review media sub-components
```

## Component Hierarchy

```
ProductReviewList (Collection + queryFn → reviewsApi.getByProduct)
├── CollectionContent (renders when reviews exist)
│   └── CollectionView (iterates reviews)
│       └── ProductReviewListItem (useCollectionItem → review context)
│           ├── ProductReviewListItemStars (RatingGroup, readOnly, auto-reads from collection)
│           ├── ProductReviewListItemAuthor
│           ├── ProductReviewListItemDate
│           ├── ProductReviewListItemComment
│           └── ProductReviewListItemMedia (nested Collection with review.media)
│               ├── CollectionContent
│               │   └── CollectionView
│               │       └── ProductReviewListItemMediaItem (MediaItem re-export)
│               └── CollectionEmpty
└── CollectionEmpty (renders when no reviews)
```

**Note:** `CollectionContent` and `CollectionEmpty` are alternatives. Pick one — not both.
- `CollectionContent` hides the section entirely when empty.
- `CollectionEmpty` shows a deliberate "no reviews" message.

## Usage Examples

### Inside a Product (auto-inferred)

```tsx
// productId is auto-inferred from Product context
import { CollectionView, CollectionContent, CollectionEmpty } from "../../collection"

<Product>
  <ProductReviewList>
    <CollectionContent>
      <CollectionView class="space-y-4">
        <ProductReviewListItem>
          <div class="flex items-center gap-2">
            <ProductReviewListItemStars />
            <ProductReviewListItemAuthor />
          </div>
          <ProductReviewListItemDate />
          <ProductReviewListItemComment />
        </ProductReviewListItem>
      </CollectionView>
    </CollectionContent>
  </ProductReviewList>
</Product>
```

### Standalone (explicit productId)

```tsx
import { CollectionView, CollectionContent } from "../../collection"

<ProductReviewList productId={productId}>
  <CollectionContent>
    <CollectionView class="space-y-4">
      <ProductReviewListItem>
        <div class="flex items-center gap-2">
          <ProductReviewListItemStars />
          <ProductReviewListItemAuthor />
        </div>
        <ProductReviewListItemDate />
        <ProductReviewListItemComment />
      </ProductReviewListItem>
    </CollectionView>
  </CollectionContent>
</ProductReviewList>
```

### With Empty State

```tsx
import { CollectionEmpty } from "../../collection"

<ProductReviewList productId={productId}>
  <CollectionEmpty>
    <span>No reviews yet. Be the first!</span>
  </CollectionEmpty>
</ProductReviewList>
```

### With Review Media

```tsx
import { CollectionView, CollectionContent, CollectionEmpty } from "../../collection"
import { ProductReviewListItemMedia, ProductReviewListItemMediaItem } from "~/components/ui/product"

<ProductReviewList productId={productId}>
  <CollectionContent>
    <CollectionView class="space-y-6">
      <ProductReviewListItem>
        <div class="flex items-center gap-2">
          <ProductReviewListItemStars />
          <ProductReviewListItemAuthor />
          <span class="text-muted-foreground">·</span>
          <ProductReviewListItemDate />
        </div>
        <ProductReviewListItemComment />
        <ProductReviewListItemMedia>
          <CollectionContent>
            <CollectionView class="flex gap-2">
              <ProductReviewListItemMediaItem class="size-24 rounded-md object-cover" />
            </CollectionView>
          </CollectionContent>
        </ProductReviewListItemMedia>
      </ProductReviewListItem>
    </CollectionView>
  </CollectionContent>
</ProductReviewList>
```

### Custom Stars (pass RatingGroup primitives)

```tsx
<ProductReviewListItemStars>
  <RatingGroupControl>
    <RatingGroupItems>
      <RatingGroupItem>
        <RatingGroupItemControl />
      </RatingGroupItem>
    </RatingGroupItems>
  </RatingGroupControl>
  <RatingGroupLabel>Rating</RatingGroupLabel>
</ProductReviewListItemStars>
```

Download the full usage snippet for the **RatingGroup primitives** view by clicking on the RatingGroup Label primitive in the component library.

When no children are passed, `ProductReviewListItemStars` renders default read-only stars using `RatingGroup` with `Control > Items > Item > ItemControl` boilerplate automatically.

## Props Reference

### ProductReviewList

```typescript
type ProductReviewListProps = {
  productId?: string           // Optional — auto-inferred from Product context when omitted
  page?: number                // Page number (default: 0)
  size?: number                // Page size (default: 20)
  sortBy?: string              // Sort field (e.g. "createdAt", "rating")
  queryKey?: unknown[]         // Custom query key (default: auto-generated)
  enabled?: boolean            // Whether to fetch (default: true)
  children?: JSX.Element
}
```

`productId` is auto-inferred from `useProduct()` context when omitted. Works inside `<Product>` without any props. Pass explicitly for standalone use.

### ProductReviewListItem

```typescript
type ProductReviewListItemProps = {
  children?: JSX.Element    // User provides their own layout
}
```

### ProductReviewListItemStars

```typescript
type ProductReviewListItemStarsProps = {
  readOnly?: boolean   // Default: true
  children?: JSX.Element   // Override default RatingGroup primitives
}
```

### ProductReviewListItemAuthor / Date / Comment

No props. Auto-read from `useCollectionItem()` context.

- **Author** — renders `review.authorName` (falls back to "Anonymous")
- **Date** — renders `review.createdAt` formatted as "Jan 1, 2024"
- **Comment** — conditionally renders `review.comment` via `<Show>`

### ProductReviewListItemMedia

```typescript
type ProductReviewListItemMediaProps = {
  children?: JSX.Element
}
```

### ProductReviewListItemMediaItem

Re-exported `MediaItem` from `~/components/ui/media`. Props match `MediaItemProps`:

```typescript
type MediaItemProps = {
  src?: string
  type?: "image" | "video" | "audio"
  alt?: string
  class?: string
  autoplay?: boolean
  controls?: boolean
  loop?: boolean
  muted?: boolean
  poster?: string
}
```

## Data Sources

All item-level components read from `useCollectionItem()`:

```typescript
const item = useCollectionItem()
const review = () => item?.item as Review | undefined
```

This works because `CollectionView` wraps each item in `CollectionItem` context. The `Review` shape:

```typescript
type Review = {
  id: string
  rating: number           // 1-5
  comment?: string | null
  authorName?: string | null
  createdAt?: string | null // ISO date string
  media?: ReviewMedia[] | null
}

type ReviewMedia = {
  id: string
  url: string
  type: string              // "image" | "video"
  mimeType?: string | null
  alt?: string | null
  displayOrder: number
}
```

## Query Keys

```typescript
import { reviewKeys } from "~/lib/query-keys"

reviewKeys.byProduct(productId)  // ['reviews', 'product', productId]
reviewKeys.stats(productId)      // ['reviews', 'stats', productId]
```
