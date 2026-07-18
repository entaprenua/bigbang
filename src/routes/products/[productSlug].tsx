import {
  Product, ProductImage, ProductName, ProductDescription, ProductSku,
  ProductPrice, ProductComparePrice, ProductDiscount,
  ProductInStockBadge, ProductLowStockBadge, ProductOutOfStockBadge, ProductStockCount,
  ProductMedia, ProductMediaItem,
  ProductVariantProvider,
  ProductBackLink,
} from "~/components/ui/product"
import { Flex } from "~/components/ui/flex"
import { Grid } from "~/components/ui/grid"
import { CollectionItems, CollectionContent, CollectionEmpty } from "~/components/ui/collection"
import { RecommendationsRoot, RecommendationsItems } from "~/components/ui/recommendations"
import { Separator } from "~/components/ui/separator"
import { Text } from "~/components/ui/text"
import * as ProductActions from "~/components/product-actions"
import ProductCard from "~/components/product-card"
import { Currency } from "~/components/ui/currency"
import { Suspense } from "solid-js"

export default function ProductDetailPage() {
  return (
    <div class="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <ProductBackLink href="/products" class="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1">
        &larr; Back to products
      </ProductBackLink>

      <Product>
        <ProductVariantProvider>
          <Flex class="items-start flex-wrap md:flex-nowrap gap-4">
            <ProductImage class="max-h-70 max-w-70 min-w-60 min-h-60 object-contain rounded-lg" />
            <span class="absolute top-3 left-3 text-xs font-medium bg-primary text-primary-foreground px-2.5 py-1 rounded-full">
              -<ProductDiscount percentage />%
            </span>
            <Flex class="flex-col items-start bottom-3 left-3 flex gap-1.5">
              <span class="text-2xl font-bold tracking-tight"><ProductName /></span>
              <span class="text-3xl font-bold"><Currency /> <ProductPrice /></span>
              <span class="text-lg text-muted-foreground line-through"><Currency /> <ProductComparePrice /></span>
              <ProductActions.Options />
              <ProductInStockBadge>
                <span class="text-xs bg-success text-success-foreground px-2.5 py-1 rounded-full">In Stock</span>
              </ProductInStockBadge>
              <ProductLowStockBadge>
                <span class="text-xs bg-warning text-warning-foreground px-2.5 py-1 rounded-full">Low Stock</span>
              </ProductLowStockBadge>
              <ProductOutOfStockBadge>
                <span class="text-xs bg-destructive text-destructive-foreground px-2.5 py-1 rounded-full">Out of Stock</span>
              </ProductOutOfStockBadge>
              <div class="text-muted-foreground leading-relaxed"><ProductDescription /></div>
              <div class="flex flex-col justify-center p-3 gap-2 w-[60%]">
                <ProductActions.CartQuantityBadge />
                <ProductActions.AddToCart />
                <ProductActions.Order />
              </div>
            </Flex>
          </Flex>
          <ProductMedia>
            <CollectionContent>
              <div class="flex gap-2 overflow-x-auto pb-1">
                <CollectionItems>
                  <ProductMediaItem class="size-20 shrink-0 rounded-lg border-2 border-transparent hover:border-primary cursor-pointer object-cover transition-colors" />
                </CollectionItems>
              </div>
            </CollectionContent>
          </ProductMedia>
          <Separator />
          <section class="py-3">
            <div class="px-4">
              <Suspense fallback={"Fetching similar products"}>
                <RecommendationsRoot type="related" limit={8}>
                  <RecommendationsItems>
                    <CollectionContent>
                      <Flex class="flex-col items-center mb-8">
                        <Text variant="h2" class="text-xl font-bold">You might also like</Text>
                        <Text class="text-muted-foreground text-sm mt-1">Complete the look</Text>
                      </Flex>
                      <Grid cols={2} colsSm={3} colsMd={4} colsLg={5} colsXl={6} class="gap-4">
                        <CollectionItems>
                          <ProductCard />
                        </CollectionItems>
                      </Grid>
                    </CollectionContent>
                  </RecommendationsItems>
                </RecommendationsRoot>
              </Suspense>
            </div>
          </section>



        </ProductVariantProvider>
      </Product>
      {/*
      <Separator />

      <section class="space-y-6">
        <Text class="text-xl font-semibold">Reviews</Text>
        <ProductReviewList>
          <CollectionContent>
            <div class="space-y-4">
              <CollectionItems>
                <ProductReviewListItem>
                  <div class="rounded-lg border p-4 space-y-2">
                    <div class="flex items-center gap-2">
                      <ProductReviewListItemStars />
                      <span class="text-sm font-medium"><ProductReviewListItemAuthor /></span>
                      <span class="text-muted-foreground">&middot;</span>
                      <span class="text-xs text-muted-foreground"><ProductReviewListItemDate /></span>
                    </div>
                    <span class="text-sm text-muted-foreground"><ProductReviewListItemComment /></span>
                  </div>
                </ProductReviewListItem>
              </CollectionItems>
            </div>
          </CollectionContent>
          <CollectionEmpty>
            <Text class="text-muted-foreground text-sm">No reviews yet.</Text>
          </CollectionEmpty>
        </ProductReviewList>
      </section>
     */}
    </div>
  )
}
