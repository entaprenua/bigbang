# Collection Components Architecture

## Overview

The `Collection` component is a unified data-fetching and layout system for rendering lists/grids of items. It provides a consistent pattern for item iteration across the entire component system, including Hero, Recommendations, and Product components.

## Design Principles

1. **Unified Pattern** - Single iteration pattern for all list-based components
2. **Context Provider** - `CollectionItemContext` for child component access
3. **Zero-Code Ready** - Works with existing components without explicit data passing
4. **Data or Query** - Accepts either direct data array or fetch function
5. **Layout Flexibility** - User controls layout via Grid, Flex, Carousel, etc.

## How It Works

### Collection

The main component that provides context and handles data:

```tsx
<Collection 
  data={items}           // Direct data array
  queryFn={fetchFn}      // OR remote fetch function
>
  <Grid cols={4}>
    <CollectionItems>
      {item => <ProductCard item={item} />}
    </CollectionItems>
  </Grid>
</Collection>
```

### CollectionItems

Renders the data for each item inside the layout wrapper. When children is a function, it's called with `(item, index)`. When children is static JSX, it's wrapped in `CollectionItem` for context access.

```tsx
// With function children
<Grid cols={4}>
  <CollectionItems>
    {item => <MyItem item={item} />}  // Function receives item
  </CollectionItems>
</Grid>

// With static children (uses CollectionItemContext)
<Grid cols={4}>
  <CollectionItems>
    <MyItem />  // Reads from useCollectionItem()
  </CollectionItems>
</Grid>
```

### CollectionItem

Wraps children in `CollectionItemContext`, providing access to the current item:

```tsx
<CollectionItem item={item} index={0} collection={items}>
  {children}
</CollectionItem>
```

### useCollectionItem

Hook to access the current item in child components:

```tsx
const collectionItem = useCollectionItem()
// Returns: { item, index, collection, value }
```

## Layout Wrappers

Layout is controlled by wrapping `CollectionItems` with your preferred layout component:

| Component | Usage | Description |
|----------|-------|-------------|
| `Grid` | `<Grid cols={4}>` | CSS Grid layout |
| `Flex` | `<Flex gap={4}>` | Flexbox layout |
| `Carousel` | `<CarouselContent>` | Carousel layout |
| Custom | `<YourLayout>` | Any wrapper component |

## Context API

### CollectionContextValue

```typescript
type CollectionContextValue = {
  data: Accessor<any[]>
}
```

### CollectionItemContextValue

```typescript
type CollectionItemContextValue = {
  item: any           // Current item
  collection: any      // Full data array
  index: number       // Current index
  value: any          // Same as item
}
```

### useCollectionItem

```typescript
const useCollectionItem = (): CollectionItemContextValue | undefined => {
  return useContext(CollectionItemContext)
}
```

## Props Reference

### Collection

```typescript
type CollectionProps = {
  children?: JSX.Element
  errorFallback?: JSX.Element         // JSX to show on error
  loadingFallback?: JSX.Element       // JSX to show while loading
  queryFn?: () => Promise<any>       // Fetch function (optional)
  data?: any[]                        // Direct data array (alternative to queryFn)
  queryKey?: unknown[]
  enabled?: boolean
}
```

### CollectionItems

```typescript
type CollectionItemsProps = {
  class?: string
  children?: JSX.Element | ((item: any, index: number) => JSX.Element)
}
```

### CollectionItem

```typescript
type CollectionItemProps = {
  item: any
  index: number
  collection: any
  children?: JSX.Element
}
```

### CollectionEmpty

```typescript
type CollectionEmptyProps = {
  class?: string
  children?: JSX.Element
}
```

### CollectionContent

Shows children only when the collection is not empty. This is a reusable wrapper for conditionally rendering content based on collection data.

```typescript
type CollectionContentProps = {
  class?: string
  children?: JSX.Element
}
```

**Usage:**

```tsx
<Categories>
  <CollectionContent>
    <CollectionItems>
      <Category />
    </CollectionItems>
  </CollectionContent>
</Categories>
```

## Usage Examples

### Grid Layout

```tsx
<Collection data={products}>
  <Grid cols={4} gap={4}>
    <CollectionItems>
      {product => <ProductCard product={product} />}
    </CollectionItems>
  </Grid>
</Collection>
```

### Flex Layout

```tsx
<Collection data={products}>
  <Flex gap={4}>
    <CollectionItems>
      {product => <ProductCard product={product} />}
    </CollectionItems>
  </Flex>
</Collection>
```

### Carousel Layout

```tsx
<Collection data={products}>
  <CarouselContent>
    <CollectionItems>
      <CarouselItem class="basis-1/4">
        {product => <ProductCard product={product} />}
      </CarouselItem>
    </CollectionItems>
  </CarouselContent>
</Collection>
```

### With Static Children (Context Access)

```tsx
<Collection data={items}>
  <Grid cols={4}>
    <CollectionItems>
      <MyItem />  // uses useCollectionItem() internally
    </CollectionItems>
  </Grid>
</Collection>
```

### With Function Children and Index

```tsx
<Collection data={items}>
  <Grid cols={4}>
    <CollectionItems>
      {(item, index) => (
        <div class="item">
          <span>{index}</span>
          <span>{item.name}</span>
        </div>
      )}
    </CollectionItems>
  </Grid>
</Collection>
```

### Remote Data with Query

```tsx
<Collection 
  queryFn={fetchProducts}
  queryKey={["products"]}
>
  <Grid cols={4} gap={4}>
    <CollectionItems>
      {product => <ProductCard product={product} />}
    </CollectionItems>
  </Grid>
</Collection>
```

### With Empty State

```tsx
<Collection data={items}>
  <Grid cols={4}>
    <CollectionItems>
      {item => <ItemCard item={item} />}
    </CollectionItems>
  </Grid>
  <CollectionEmpty>
    <p>No items found</p>
  </CollectionEmpty>
</Collection>
```

## Architecture Diagram

```
Collection
├── Query (optional, for remote data)
│   └── QueryBoundary
│       └── CollectionInner
│           └── CollectionContext.Provider
│               └── children
│                   └── Layout Wrapper (Grid, Flex, Carousel, etc.)
│                       └── CollectionItems
│                           └── CollectionItem (per item)
│                               └── CollectionItemContext.Provider
│                                   └── children
```

## Best Practices

1. **Wrap CollectionItems with a layout component** - Grid, Flex, Carousel, or custom
2. **Use function children for explicit data passing** - Clearer, more type-safe
3. **Use static children with useCollectionItem()** - For reusable components that auto-detect context
4. **Specify queryFn for remote data** - Automatic loading/error states

## Exports

```typescript
export {
  Collection,
  CollectionItem,
  CollectionItems,
  CollectionContent,
  CollectionEmpty,
  useCollection,
  useCollectionItem,
  CollectionItemContext,
}

export type {
  CollectionItemsProps,
  CollectionItemProps,
  CollectionContentProps,
}
```
