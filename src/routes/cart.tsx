import { CollectionItems, CollectionContent } from "~/components/ui/collection"
import { CartItems, CartEmpty, CartSummary, CartClearTrigger, CartCheckoutTrigger, CartSubtotal, CartSelectedSubtotal } from "~/components/ui/cart"
import { CartItemSelectToggle, CartItemSelectCheckbox } from "~/components/ui/cart/cart-sections"
import {
  Product, ProductImage, ProductName, ProductPrice,
  ProductSelectedOptionValues, ProductSelectedOptionValueName, ProductSelectedOptionValueValue,
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
import { MutationLoading, MutationErrorAlertDialog } from "~/components/ui/query"
import { CheckboxControl, CheckboxIndicator } from "~/components/ui/checkbox"
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogTitle, AlertDialogDescription, AlertDialogCloseButton } from "~/components/ui/alert-dialog"
import { Suspense } from "solid-js"

export default function CartPage() {

  const VariantOptionValues = () => {
    return (
      <ProductSelectedOptionValues>
        <CollectionContent>
          <CollectionItems>
            <span class="text-sm text-muted-foreground">
              <ProductSelectedOptionValueName />: <span class="font-medium text-foreground"><ProductSelectedOptionValueValue /></span>
            </span>
          </CollectionItems>
        </CollectionContent>
      </ProductSelectedOptionValues>
    )
  }

  return (
    <div class="min-h-screen bg-background">
      <div class="container mx-auto px-4 py-12 max-w-6xl">
        <Text variant="h2" class="font-serif font-light mb-3">Shopping Cart</Text>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div class="lg:col-span-2">
            <CartItems>
              <CollectionItems>
                <div class="space-y-4">
                  <div class="relative rounded-sm bg-card p-6">
                    <CartItemSelectToggle>
                      <Flex class="flex-wrap items-start gap-2">
                        <MutationLoading class="absolute inset-0 flex items-center justify-center pointer-events-none bg-background/80 h-full" />
                        <div class="relative">
                          <CartItemSelectCheckbox class="cursor-pointer">
                            <CheckboxControl>
                              <CheckboxIndicator />
                            </CheckboxControl>
                          </CartItemSelectCheckbox>
                        </div>
                        <Product href="/products" class="flex min-w-0 flex-1 gap-4 hover:cursor-pointer">
                          <ProductImage class="h-24 w-24 shrink-0 rounded-sm object-cover" />
                          <div class="flex min-w-0 flex-1 flex-col gap-2">
                            <span class="truncate font-medium text-foreground"><ProductName /></span>
                            <span class="font-medium text-foreground"><Currency /> <ProductPrice /></span>
                            <VariantOptionValues />
                            <CartActions.Quantity class="justify-start" />
                            <CartActions.Remove />
                          </div>
                        </Product>
                      </Flex>
                      <MutationErrorAlertDialog>
                        <AlertDialogContent>
                          <AlertDialogTitle>Error</AlertDialogTitle>
                          <AlertDialogDescription>Could not update selection.</AlertDialogDescription>
                          <AlertDialogCloseButton />
                        </AlertDialogContent>
                      </MutationErrorAlertDialog>
                    </CartItemSelectToggle>
                  </div>
                </div>
                <Separator />
              </CollectionItems>

              <CartEmpty>
                <div class="rounded-sm bg-card p-16 text-center">
                  <div class="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                    <svg class="h-10 w-10 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>
                  <h2 class="mb-3 text-xl font-serif font-light">Your cart is empty</h2>
                  <p class="mb-6 text-muted-foreground">Start adding items to your cart</p>
                  <Button as={Link} href="/products" class="bg-primary px-8 text-primary-foreground hover:bg-primary/90">
                    Browse Collection
                  </Button>
                </div>
              </CartEmpty>
            </CartItems>
          </div>

          <div class="lg:col-span-1">
            <div class="sticky top-4 rounded-sm bg-card p-6">
              <Text variant="h2" class="mb-6 text-lg font-serif font-light">Order Summary</Text>

              <div class="mb-6 space-y-4">
                <Flex justifyContent="space-between">
                  <Text class="text-muted-foreground">Subtotal</Text>
                  <Currency /> <CartSubtotal />
                </Flex>
                <Flex justifyContent="space-between">
                  <Text class="text-muted-foreground">Shipping</Text>
                  <Text class="text-sm text-muted-foreground">Calculated at checkout</Text>
                </Flex>
                <div class="border-t pt-4">
                  <Flex justifyContent="space-between">
                    <Text class="font-medium">Total</Text>
                    <Currency /> <CartSelectedSubtotal />
                  </Flex>
                </div>
              </div>

              <CartSummary>
                <CartCheckoutTrigger href="/checkout" class="w-full rounded-sm bg-primary py-3 text-primary-foreground hover:bg-primary/90" />
                <AlertDialog showBackdrop>
                  <AlertDialogTrigger
                    as={Button}
                    variant="destructive"
                    class="mt-3 w-full border-border text-muted-foreground hover:bg-accent hover:text-foreground"
                  >
                    Clear Cart
                  </AlertDialogTrigger>
                  <AlertDialogContent class="sm:max-w-md">
                    <AlertDialogTitle>Clear Cart</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to remove all items from your cart? This action cannot be undone.
                    </AlertDialogDescription>
                    <Flex class="mt-4 justify-between gap-3">
                      <AlertDialogCloseButton
                        as={Button}
                        variant="outline"
                        class="border-border"
                      >
                        Cancel
                      </AlertDialogCloseButton>
                      <CartClearTrigger variant="destructive" class="border-border text-muted-foreground hover:bg-accent hover:text-foreground" />
                    </Flex>
                  </AlertDialogContent>
                </AlertDialog>
              </CartSummary>

              <CartEmpty>
                <Button as={Link} href="/products" variant="outline" class="w-full border-border text-foreground hover:bg-accent">
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
