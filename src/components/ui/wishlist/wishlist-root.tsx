import { Show, splitProps, type JSX, createResource } from "solid-js"
import { WishlistProvider } from "./wishlist-context"
import { Collection } from "~/components/ui/collection"
import { wishlistsApi } from "~/lib/api/wishlists"
import type { Wishlist } from "~/lib/types"

export type WishlistRootProps = {
  data?: Wishlist
  class?: string
  children?: JSX.Element
}

const WishlistRootContent = (props: { data?: Wishlist; class?: string; children?: JSX.Element }) => {
  return (
    <Show when={props.data} fallback={null}>
      <WishlistProvider initialWishlist={props.data}>
        <div class={props.class}>{props.children}</div>
      </WishlistProvider>
    </Show>
  )
}

export const WishlistRoot = (props: WishlistRootProps) => {
  const [data] = createResource(
    async () => wishlistsApi.get()
  )

  return (
    <WishlistRootContent data={props.data ?? data()} class={props.class}>
      {props.children}
    </WishlistRootContent>
  )
}

export type WishlistItemsProps = {
  class?: string
  children?: JSX.Element
}

export const WishlistItems = (props: WishlistItemsProps) => {
  const [local] = splitProps(props, ["class", "children"])
  
  return (
    <Collection>
      {local.children}
    </Collection>
  )
}
