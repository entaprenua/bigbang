import {
  Product, ProductImage, ProductName, ProductDescription, ProductSku,
  ProductPrice, ProductComparePrice, ProductDiscount,
  ProductInStockBadge, ProductLowStockBadge, ProductOutOfStockBadge, ProductStockCount,
  ProductMedia, ProductMediaItem,
  ProductVariantProvider, ProductVariants, ProductVariant,
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
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "~/components/ui/card"
import { Suspense } from "solid-js"

export default function ProductDetailPage() {


  const ProductVariantsThumbnails = () => {

    return (
      <ProductVariants>
        <CollectionContent>
          <Card class="w-full">
            <CardHeader>
              <CardTitle>Variants</CardTitle>
            </CardHeader>
            <CardContent>
              <div class="flex gap-2 overflow-x-auto pb-1 justify-center">
                <CollectionItems>
                  <ProductVariant class="border-2 rounded-lg border-transparent [&[data-selected]]:border-primary hover:border-muted-foreground/50 transition-colors">
                    <ProductImage class="size-16 shrink-0 rounded-lg cursor-pointer object-cover" />
                  </ProductVariant>
                </CollectionItems>
              </div>
            </CardContent>
          </Card>
        </CollectionContent>
      </ProductVariants>
    )
  }



  return (
    <div class=" mx-auto px-1 py-8 space-y-8">
      <Product>
        <ProductVariantProvider>
          <Flex class="items-start flex-wrap md:flex-nowrap gap-4">
            <Flex class="items-center justify-start w-150">
              <ProductImage class="h-60 w-60 object-contain rounded-lg" />
            </Flex>
            <span class="absolute top-3 left-3 text-xs font-medium bg-primary text-primary-foreground px-2.5 py-1 rounded-full">
              -<ProductDiscount percentage />%
            </span>
            <Flex class="flex-col items-start bottom-3 left-3 flex gap-1.5">
              <span class="text-2xl font-bold tracking-tight"><ProductName /></span>
              <span class="text-3xl font-bold"><Currency /> <ProductPrice /></span>
              <span class="text-lg text-muted-foreground line-through"><Currency /> <ProductComparePrice /></span>
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
              <ProductActions.Options />
              <div class="flex flex-col justify-center items-center w-full p-3 gap-2">
                <ProductActions.AddToCart />
                <ProductActions.Order />
                <ProductActions.AddFavourite />
                <ProductActions.RemoveFavourite />
              </div>
            </Flex>
          </Flex>
          <ProductVariantsThumbnails />
          <ProductMedia>
            <CollectionContent>
              <Card class="w-full">
                <CardHeader>
                  <CardTitle>Product Gallery</CardTitle>
                  <CardDescription>See the product in action</CardDescription>
                </CardHeader>
                <CardContent>
                  <div class="flex gap-3 overflow-x-auto pb-2 justify-center">
                    <CollectionItems>
                      <ProductMediaItem class="w-50 max-h-50 shrink-0 rounded-xl border-2 border-transparent hover:border-primary hover:shadow-lg cursor-pointer object-cover transition-all duration-200" />
                    </CollectionItems>
                  </div>
                </CardContent>
              </Card>
            </CollectionContent>
          </ProductMedia>
          <Separator />
        </ProductVariantProvider>
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

        <section class="py-3">
          <div class="px-4">
            <Suspense fallback={"Fetching recommendations"}>
              <RecommendationsRoot type="bought_together" limit={8}>
                <RecommendationsItems>
                  <CollectionContent>
                    <Flex class="flex-col items-center mb-8">
                      <Text variant="h2" class="text-xl font-bold">Frequently bought together</Text>
                      <Text class="text-muted-foreground text-sm mt-1">Complete the set</Text>
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
