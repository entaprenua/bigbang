import { CollectionItems, CollectionContent } from "~/components/ui/collection"
import { CartItems, CartItemCheckbox, CartEmpty, CartSummary, CartClearTrigger, CartCheckoutTrigger, CartSubtotal, CartSelectedSubtotal } from "~/components/ui/cart"
import {
  Product, ProductImage, ProductName, ProductPrice, ProductVariantProvider
} from "~/components/ui/product"
import { Button } from "~/components/ui/button"
import { Flex } from "~/components/ui/flex"
import { Grid } from "~/components/ui/grid"
import { Text } from "~/components/ui/text"
import { Link } from "~/components/ui/link"
import { RecommendationsRoot, RecommendationsItems } from "~/components/ui/recommendations"
import ProductCard from "~/components/product-card"
import * as CartActions from "~/components/cart-actions"
import { Currency } from "~/components/ui/currency"
import { Separator } from "~/components/ui/separator"
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogTitle, AlertDialogDescription, AlertDialogCloseButton } from "~/components/ui/alert-dialog"
import { Suspense } from "solid-js"

export default function CartPage() {
  return (
    <div class="bg-stone-50 min-h-screen">
      <div class="container mx-auto px-4 py-12 max-w-6xl">
        <Text variant="h2" class="font-serif font-light mb-3">Shopping Cart</Text>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div class="lg:col-span-2">
            <CartItems>
              <CollectionItems>
                <div class="space-y-4">
                  <div class="bg-white rounded-sm p-6">
                    <Flex class="flex-wrap items-start gap-2">
                      <CartItemCheckbox />
                      <Product href="/products" class="flex gap-4 hover:cursor-pointer flex-1 min-w-0">
                        <ProductVariantProvider>
                          <ProductImage class="w-24 h-24 object-cover rounded-sm shrink-0" />
                          <div class="flex flex-col gap-2 min-w-0 flex-1">
                            <span class="font-medium text-stone-800 truncate"><ProductName /></span>
                            <span class="text-stone-600"><Currency /> <ProductPrice /></span>
                            <CartActions.Quantity class="justify-start" />
                            <CartActions.Remove />
                          </div>
                        </ProductVariantProvider>
                      </Product>
                    </Flex>
                  </div>
                </div>
                <Separator />
              </CollectionItems>

              <CartEmpty>
                <div class="bg-white rounded-sm p-16 text-center">
                  <div class="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg class="w-10 h-10 text-stone-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>
                  <h2 class="text-xl font-serif font-light mb-3">Your cart is empty</h2>
                  <p class="text-stone-500 mb-6">Start adding furniture to your cart</p>
                  <Button as={Link} href="/products" class="bg-stone-800 hover:bg-stone-700 text-white px-8">
                    Browse Collection
                  </Button>
                </div>
              </CartEmpty>
            </CartItems>
          </div>

          <div class="lg:col-span-1">
            <div class="bg-white rounded-sm p-6 sticky top-4">
              <Text variant="h2" class="text-lg font-serif font-light mb-6">Order Summary</Text>

              <div class="space-y-4 mb-6">
                <Flex justifyContent="space-between">
                  <Text class="text-stone-500">Subtotal</Text>
                  <Currency /> <CartSubtotal />
                </Flex>
                <Flex justifyContent="space-between">
                  <Text class="text-stone-500">Shipping</Text>
                  <Text class="text-stone-500 text-sm">Calculated at checkout</Text>
                </Flex>
                <div class="border-t pt-4">
                  <Flex justifyContent="space-between">
                    <Text class="font-medium">Total</Text>
                    <Currency /> <CartSelectedSubtotal />
                  </Flex>
                </div>
              </div>

              <CartSummary>
                <CartCheckoutTrigger href="/checkout" class="w-full bg-blue-500 hover:bg-stone-700  py-3 rounded-sm " />
                <AlertDialog showBackdrop>
                  <AlertDialogTrigger
                    as={Button}
                    variant="destructive"
                    class="w-full mt-3 border-stone-300 text-stone-600 hover:bg-stone-50"
                  >
                    Clear Cart
                  </AlertDialogTrigger>
                  <AlertDialogContent class="sm:max-w-md">
                    <AlertDialogTitle>Clear Cart</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to remove all items from your cart? This action cannot be undone.
                    </AlertDialogDescription>
                    <Flex class="justify-between gap-3 mt-4">
                      <AlertDialogCloseButton
                        as={Button}
                        variant="outline"
                        class="border-stone-300"
                      >
                        Cancel
                      </AlertDialogCloseButton>
                      <CartClearTrigger variant="destructive" class="border-stone-300 text-stone-600 hover:bg-stone-50" />
                    </Flex>
                  </AlertDialogContent>
                </AlertDialog>
              </CartSummary>

              <CartEmpty>
                <Button as={Link} href="/products" variant="outline" class="w-full border-stone-300 text-stone-600 hover:bg-stone-50">
                  Continue Shopping
                </Button>
              </CartEmpty>
            </div>
          </div>
        </div>
        <section class="mt-16">
          <Suspense fallback={"Loading cart recommendations"}>
            <RecommendationsRoot type="cart_based" limit={8}>
              <RecommendationsItems>
                <CollectionContent>
                  <Separator class="mt-3" />
                  <Text variant="h2" class="text-xl font-semibold mb-6">Recommended based on your cart</Text>
                  <Grid cols={2} colsSm={3} colsMd={4} colsLg={5} colsXl={6} class="gap-4">
                    <CollectionItems>
                      <ProductCard />
                    </CollectionItems>
                  </Grid>
                </CollectionContent>
              </RecommendationsItems>
            </RecommendationsRoot>
          </Suspense>
        </section>
      </div>
    </div>
  )
}
