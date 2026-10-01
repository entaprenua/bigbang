import { A } from "@solidjs/router"
import { CartCount } from "~/components/ui/cart"
import { useAuth } from "~/components/ui/auth"
import { Logo } from "./store"
import { cn } from "~/lib/utils"
import ShoppingCartIcon from "lucide-solid/icons/shopping-cart"
import SearchIcon from "lucide-solid/icons/search"
import MoonIcon from "lucide-solid/icons/moon"
import SunIcon from "lucide-solid/icons/sun"
import UserRoundIcon from "lucide-solid/icons/user-round"
import { Badge } from "~/components/ui/badge"
import { ColorModeToggleButton } from "~/components/ui/color-mode"
import { ProductSearch } from "./ui/product/product-search"
import { Product, ProductImage, ProductName, ProductPrice } from "~/components/ui/product"
import { Currency } from "~/components/ui/currency"
import {
  SearchControl,
  SearchInput,
  SearchContent,
  SearchListbox,
  SearchItem,
  SearchNoResult,
} from "~/components/ui/search"


const searchItem = () => (
  <SearchItem class="rounded-lg px-1 data-[highlighted]:bg-accent">
    <Product href="/products" class="flex w-full items-center gap-3 px-3 py-2.5 text-sm text-foreground">
      <div class="min-w-0 flex-1">
        <div class="block truncate font-medium"><ProductName /></div>
        <div class="block text-xs font-medium text-foreground"><Currency /> <ProductPrice /></div>
      </div>
      <ProductImage class="h-10 w-10 shrink-0 rounded-md object-cover" />
    </Product>
  </SearchItem>
)

function CartButton(props: { class?: string }) {
  return (
    <A
      href="/cart"
      class={cn(
        "relative inline-flex items-center justify-center rounded-full p-2 text-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
        props.class
      )}
      aria-label="Cart"
      title="Cart"
    >
      <ShoppingCartIcon class="h-5 w-5" />
      <Badge
        round
        variant="error"
        class="absolute text-sm top-0 right-0 -translate-y-1/2 translate-x-1/2 font-medium w-4 h-4 flex items-center justify-center"
      >
        <CartCount />
      </Badge>
    </A>
  )
}

function AccountButton(props: { class?: string }) {
  const auth = useAuth()

  return (
    <A
      href={auth.isAuthenticated() ? "/account" : "/auth/login"}
      class={cn(
        "inline-flex items-center justify-center rounded-full p-2 text-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
        props.class
      )}
      aria-label="Account"
      title={auth.isAuthenticated() ? "Account" : "Sign in"}
    >
      <UserRoundIcon class="h-5 w-5" />
    </A>
  )
}

export function Header() {
  return (
    <header class="sticky top-0 z-50 w-full border-b border-border bg-background">
      <div class="container mx-auto flex w-full flex-col px-4">
        <div class="flex w-full flex-col gap-3 py-3 md:flex-row md:items-center md:gap-8">
          <div class="flex items-center justify-between gap-4">
            <A href="/" class="flex items-center">
              <Logo />
            </A>
            <CartButton class="md:hidden" />
            <AccountButton class="md:hidden" />
            <ColorModeToggleButton class="md:hidden">
              <MoonIcon class="h-5 w-5 dark:hidden" />
              <SunIcon class="hidden h-5 w-5 dark:block" />
            </ColorModeToggleButton>
          </div>

        <div class="w-full md:flex-1 md:max-w-xl">
          <ProductSearch
            searchPath="/products"
            placeholder="Search products…"
            itemComponent={searchItem}
          >
            <SearchControl class="relative block">
              <button
                type="submit"
                aria-label="Search"
                title="Search"
                class="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <SearchIcon class="h-4 w-4" />
              </button>
              <SearchInput
                class="h-11 w-full rounded-full border border-input bg-muted pl-5 pr-12 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring"
                placeholder="Search products…"
              />
            </SearchControl>
            <SearchContent class="left-0 right-0 top-full z-50 mt-2 w-full rounded-xl border border-border bg-popover p-1.5 text-foreground shadow-xl md:w-[26rem]">
              <SearchListbox />
              <SearchNoResult class="px-4 py-6 text-center text-sm text-muted-foreground">
                No products found
              </SearchNoResult>
            </SearchContent>
          </ProductSearch>
        </div>

        <CartButton class="hidden md:inline-flex" />
        <AccountButton class="hidden md:inline-flex" />
        <ColorModeToggleButton class="hidden md:inline-flex">
          <MoonIcon class="h-5 w-5 dark:hidden" />
          <SunIcon class="hidden h-5 w-5 dark:block" />
        </ColorModeToggleButton>
      </div>

      </div>
    </header>
  )
}
