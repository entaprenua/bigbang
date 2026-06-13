import { splitProps, createEffect, type JSX, Match, Switch, createMemo, createContext, useContext, type Accessor, mergeProps, Show } from "solid-js"
import { Collection } from "../collection"
import { useCategory } from "./category-context"
import { categoriesApi } from "~/lib/api/categories"
import type { Category } from "~/lib/types"

const ModeContext = createContext<() => string>()
const useMode = () => useContext(ModeContext)
const ModeProvider = (props: { value: string, children?: JSX.Element }) => {
  return (
    <ModeContext.Provider value={() => props.value}>
      {props.children}
    </ModeContext.Provider>
  )
}

type CategoryListProps = {
  mode?: string
  queryKey?: unknown[]
  enabled?: boolean
  children?: JSX.Element
}

const CategoryList = (rawProps: CategoryListProps) => {

  const props = mergeProps({
    mode: "tree",
  }, rawProps)
  const [local] = splitProps(props, [
    "mode",
    "queryKey",
    "enabled",
    "children",
  ])

  const isRootMode = () => local.mode === "root"
  const isTreeMode = () => local.mode === "tree"

  const queryFn = async (): Promise<Category[] | null> => {
    if (isRootMode()) {
      return await categoriesApi.getRoot()
    }
    else if (isTreeMode()) {
      return await categoriesApi.getTree()
    }
    return []
  }
  const queryKeys = () => {
    if (isRootMode()) return ["categories", "list"]
    else if (isTreeMode()) return ["categories", "tree"]
  }

  return (
    <Collection
      queryFn={queryFn}
      queryKey={queryKeys()}
      enabled={local.enabled ?? true}
    >
      <ModeProvider value={local.mode}>
        {local.children}
      </ModeProvider>
    </Collection>
  )
}

type CategorySubcategoriesProps = {
  queryKey?: unknown[]
  enabled?: boolean
  children?: JSX.Element
}

const CategorySubcategories = (props: CategorySubcategoriesProps) => {
  const [local] = splitProps(props, [
    "queryKey",
    "enabled",
    "children",
  ])
  const parentCategory = useCategory()
  const mode = useMode()
  const parentCategoryId = createMemo(() => parentCategory.id())
  if (!parentCategoryId()) return null

  const queryFn = async (): Promise<Category[] | null> => {
    if (!parentCategoryId()) return []
    return await categoriesApi.getByParent(parentCategoryId())
  }

  const childrenMemo = createMemo(() => {
    const conn = parentCategory?.data()?.children as any
    return conn?.edges?.map((e: any) => e.node) ?? null
  })

  const hasChildren = () => {
    const subs = childrenMemo()
    return subs && subs.length > 0
  }
  const forRootMode = () => mode?.() === "root"
  const forTreeMode = () => mode?.() === "tree"

  return (
    <Switch>
      <Match when={forRootMode() || childrenMemo() == null}>
        <Collection
          queryFn={queryFn}
          queryKey={["categories", "subcategories", parentCategoryId()]}
        >
          {local.children}
        </Collection>
      </Match>
      <Match when={hasChildren()/*Includes tree mode */}>
        <Collection
          data={childrenMemo()}
        >
          {local.children}
        </Collection>
      </Match>
    </Switch>
  )
}

const DefaultCategoryListLoading = (props: { class?: string }) => (
  <div class={props.class ?? "flex flex-col gap-2 p-2"}>
    <div class="animate-pulse h-12 bg-muted rounded" />
    <div class="animate-pulse h-12 bg-muted rounded" />
  </div>
)

export { CategoryList, CategorySubcategories, DefaultCategoryListLoading }
export type { CategoryListProps, CategorySubcategoriesProps }
