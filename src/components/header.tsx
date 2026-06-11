import { A } from "@solidjs/router"
import { Navbar, NavbarBrand, NavbarContent, NavbarEnd, NavbarLink } from "~/components/ui/navbar"
import { Flex } from "~/components/ui/flex"
import { CartCount } from "~/components/ui/cart"
import { StoreName } from "./store"
export function Header() {
  return (
    <Navbar position="sticky" variant="default" class="bg-white border-b">
      <NavbarBrand>
        <A href="/" class="flex items-center gap-3">
          <div class="w-10 h-10 bg-stone-800 rounded-full flex items-center justify-center">
            <svg class="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9,22 9,12 15,12 15,22" />
            </svg>
          </div>
          <StoreName />
        </A>
      </NavbarBrand>

      <NavbarContent>
        <Flex class="gap-8 ml-8">
          <NavbarLink href="/categories" class="text-sm uppercase tracking-widest hover:text-stone-600">Categories</NavbarLink>
          <NavbarLink href="/products" class="text-sm uppercase tracking-widest hover:text-stone-600">Products</NavbarLink>
          <NavbarLink href="/about" class="text-sm uppercase tracking-widest hover:text-stone-600">About</NavbarLink>
          <NavbarLink href="/contact" class="text-sm uppercase tracking-widest hover:text-stone-600">Contact</NavbarLink>
        </Flex>
      </NavbarContent>
      <NavbarEnd>
        <Flex class="gap-4">
          <NavbarLink href="/cart" class="relative p-2">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            <span class="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 bg-stone-800 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center" >
              <CartCount />
            </span>
          </NavbarLink>
        </Flex>
      </NavbarEnd>
    </Navbar>
  )
}
