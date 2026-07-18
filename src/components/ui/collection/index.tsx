/*
 * Collection Components
 * 
 * A data-fetching and layout system for rendering lists/grids of items.
 * 
 * Usage:
 *   - Remote fetch: Collection queryFn={fetchFn} layout="grid" columns={4} > CollectionItems > children
 *   - Local data: Collection data={array} layout="grid" columns={4} > CollectionItems > children
 *   - Static children: Collection > CollectionItems > Component (uses useCollectionItem)
 *   - Fallbacks: Collection loadingFallback={...} errorFallback={...}
 * 
 * Flow:
 *   1. Collection wraps TanStack Query (queryFn) OR accepts local data
 *   2. Layout props (layout, columns, gap) passed to Collection
 *   3. CollectionItems gets data/layout from Collection context
 *   4. Children: function (item, index) => JSX OR static JSX (wrapped in CollectionItem)
 *   5. CollectionItem provides context: { item, index, collection, value }
 *   6. useCollectionItem() accesses current item in child components
 */

import { Query, useQueryState } from "./../query"
import {
  splitProps, children, createContext, useContext, For, Show,
  type JSX, type Accessor,
} from "solid-js"
import { cn } from "~/lib/utils"


// Collection Context
// ============================================================================

type CollectionContextValue = {
  data: Accessor<any[]>
}

const CollectionContext = createContext<CollectionContextValue>()

const useCollectionContext = (): CollectionContextValue => {
  const ctx = useContext(CollectionContext)
  if (!ctx) {
    throw new Error("CollectionItems must be used within Collection")
  }
  return ctx
}

// ============================================================================
// CollectionItem (provides item context)
// ============================================================================

type CollectionItemContextValue = {
  item: any
  collection: any
  index: number
  value: any
}

const CollectionItemContext = createContext<CollectionItemContextValue | undefined>()

/**
 * Hook to access the query state from Collection
 * Alias for useQueryState - for accessing query data within Collection
 */
const useCollection = useQueryState

/**
 * Hook to access current item in Collection iteration
 */
const useCollectionItem = (): CollectionItemContextValue | undefined => useContext(CollectionItemContext)

/**
 * Hook to access Collection data (full array)
 */
const useCollectionData = (): Accessor<any[]> => {
  const ctx = useContext(CollectionContext)
  if (!ctx) {
    throw new Error("useCollectionData must be used within Collection")
  }
  return ctx.data
}

type CollectionItemProps = {
  item: any
  index: number
  collection: any
  children?: JSX.Element
}

const CollectionItem = (props: CollectionItemProps) => {
  const value: CollectionItemContextValue = {
    get index() { return props.index },
    get item() { return props.item },
    get collection() { return props.collection },
    get value() { return props.item },
  }

  return (
    <CollectionItemContext.Provider value={value}>
      {props.children}
    </CollectionItemContext.Provider>
  )
}

// ============================================================================
// Collection (data fetching + layout config)
// ============================================================================

type CollectionProps = {
  children?: JSX.Element
  /** Function to fetch data remotely */
  queryFn?: () => Promise<any>
  /** Direct data array (alternative to queryFn) */
  data?: any[]
  queryKey?: unknown[]
  enabled?: boolean
  /** Keep showing old data while fetching new data (prevents UI jump) */
  placeholderData?: (previousData: any) => any
}

const Collection = (props: CollectionProps) => {
  const [local] = splitProps(props, [
    "children",
    "queryFn",
    "data",
    "queryKey",
    "enabled",
    "placeholderData",
  ])

  // Data accessor - from query or direct
  const resolvedData = (): any[] => local.data ?? []

  // If queryFn is provided, use remote fetch mode
  return (
    <Show when={local.queryFn}
      fallback={
        <CollectionInner
          data={resolvedData}
        >
          {local.children}
        </CollectionInner>
      }
    >
      <Query
        queryFn={local.queryFn}
        queryKey={local.queryKey ?? ["collection"]}
        enabled={local.enabled ?? true}
        placeholderData={local.placeholderData}
      >
        <CollectionInner
          data={() => {
            const query = useQueryState()
            return (query?.data as any[]) ?? []
          }}
        >
          {local.children}
        </CollectionInner>
      </Query>
    </Show>
  )
}

// Inner component that provides context
const CollectionInner = (props: {
  data: Accessor<any[]>
  children?: JSX.Element
}) => {
  const contextValue: CollectionContextValue = {
    data: props.data,
  }

  return (
    <CollectionContext.Provider value={contextValue}>
      {props.children}
    </CollectionContext.Provider>
  )
}

// ============================================================================
// CollectionContent
// ============================================================================

/**
 * Shows children only when the collection is not empty.
 * Use this as a wrapper to conditionally render content based on collection data.
 *
 * Usage:
 *   <Categories>
 *     <CollectionContent>
 *       <CollectionItems>
 *         <Category />
 *       </CollectionItems>
 *     </CollectionContent>
 *   </Categories>
 *
 * Aliases (via re-export):
 *   - CategoriesContent (category/category-list.tsx)
 *   - ProductsContent (product/product-list.tsx)
 *   - HeroItemsContent (hero/hero-sections.tsx)
 *   - RecommendationsContent (recommendations/recommendations-root.tsx)
 */
type CollectionContentProps = {
  children?: JSX.Element
}

const CollectionContent = (props: CollectionContentProps) => {
  const [local, others] = splitProps(props, ["children"])
  const { data } = useCollectionContext()

  return (
    <Show when={data().length > 0}>
      {local.children}
    </Show>
  )
}

// ============================================================================
// CollectionEmpty
// ============================================================================

type CollectionEmptyProps = {
  class?: string
  children?: JSX.Element
}

const CollectionEmpty = (props: CollectionEmptyProps) => {
  const [local, others] = splitProps(props, ["class", "children"])
  const { data } = useCollectionContext()

  return (
    <Show when={data().length === 0}>
      <div
        class={cn(
          "flex flex-col justify-center items-center min-h-[30vh] h-full",
          local.class
        )}
        {...others}
      >
        {local.children}
      </div>
    </Show>
  )
}

// ============================================================================
// CollectionItems (renders with layout)
// ============================================================================

/**
 * Renders collection data with layout options
 * Gets data and layout from Collection context
 * 
 * Props:
 *   - class: CSS class for wrapper
 *   - children: JSX.Element OR function (item, index) => JSX
 */
type CollectionItemsProps = {
  children?: JSX.Element/* | ((item: any, index: number) => JSX.Element)*/
}

const CollectionItems = (props: CollectionItemsProps) => {
  const [local] = splitProps(props, ["children"])
  const { data } = useCollectionContext()

  return (
    <For each={data()}>
      {(item: any, index: () => number) => (
        <CollectionItem item={item} index={index()} collection={data()}>
          {local.children as JSX.Element}
        </CollectionItem>
      )}
    </For>
  )
}

export {
  Collection,
  CollectionItem,
  CollectionItems,
  CollectionContent,
  CollectionEmpty,
  useCollection,
  useCollectionItem,
  useCollectionData,
  useCollectionContext,
  CollectionContext,
  CollectionItemContext,
}

export type {
  CollectionItemsProps,
  CollectionItemProps,
  CollectionContentProps,
}
