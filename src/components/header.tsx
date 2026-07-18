import { A } from "@solidjs/router"
import { Navbar, NavbarBrand, NavbarContent, NavbarEnd, NavbarLink } from "~/components/ui/navbar"
import { Flex } from "~/components/ui/flex"
import { CartCount } from "~/components/ui/cart"
import { StoreName, Logo } from "./store"
import ShoppingCartIcon from "lucide-solid/icons/shopping-cart"
import { Badge } from "~/components/ui/badge"
import Categories from "./categories"
import { Popover, PopoverTrigger, PopoverContent } from "~/components/ui/popover"
import { Suspense } from "solid-js"

export function Header() {
  return (
    <Navbar position="sticky" variant="default" class="bg-white border-b">
      <div class="flex flex-col w-full">
        <div class="flex w-screen justify-between">
          <NavbarBrand>
            <A href="/" class="flex items-center gap-3">
              <Logo />
            </A>
          </NavbarBrand>
          <div class="flex w-full justify-center  items-center">
            <NavbarLink href="/cart" class="relative">
              <ShoppingCartIcon />
              <Badge
                round
                variant="error"
                class="absolute text-sm top-0 right-0 -translate-y-1/2 translate-x-1/2   w-4 h-4 flex items-center justify-center"
              >
                <CartCount />
              </Badge>
            </NavbarLink>
          </div>
        </div>
        <div class="flex w-full justify-around">
          <Categories />
          <NavbarLink href="/products" class="text-sm ppercase tracking-widest hover:text-stone-600">Products</NavbarLink>
        </div>
      </div>
    </Navbar>
  )
}
