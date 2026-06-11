import {
  Product, ProductImage, ProductName, ProductDescription, ProductSku,
  ProductPrice, ProductComparePrice, ProductDiscount,
  ProductInStockBadge, ProductLowStockBadge, ProductOutOfStockBadge, ProductStockCount,
  ProductAddToCartTrigger, ProductToggleWishlistTrigger,
  ProductQuantityActions,
  ProductMedia, ProductMediaItem,
  ProductVariantProvider, ProductVariantOptionRadioGroup,
  ProductReviewList, ProductReviewListItem,
  ProductReviewListItemStars, ProductReviewListItemAuthor,
  ProductReviewListItemDate, ProductReviewListItemComment,
  ProductBackLink,
} from "~/components/ui/product"
import { CollectionView, CollectionContent, CollectionEmpty } from "~/components/ui/collection"
import { Separator } from "~/components/ui/separator"
import { Text } from "~/components/ui/text"

export default function ProductDetailPage() {
  return (
    <div class="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <ProductBackLink href="/products" class="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1">
        &larr; Back to products
      </ProductBackLink>

      <Product class="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        <div class="space-y-4">
          <div class="relative overflow-hidden rounded-xl bg-muted flex items-center justify-center">
            <ProductImage class="w-full h-full max-h-[32rem] object-contain p-8" />
            <span class="absolute top-3 left-3 text-xs font-medium bg-primary text-primary-foreground px-2.5 py-1 rounded-full">
              -<ProductDiscount percentage />%
            </span>
            <div class="absolute bottom-3 left-3 flex gap-1.5">
              <ProductInStockBadge>
                <span class="text-xs bg-success text-success-foreground px-2.5 py-1 rounded-full">In Stock</span>
              </ProductInStockBadge>
              <ProductLowStockBadge>
                <span class="text-xs bg-warning text-warning-foreground px-2.5 py-1 rounded-full">Low Stock</span>
              </ProductLowStockBadge>
              <ProductOutOfStockBadge>
                <span class="text-xs bg-destructive text-destructive-foreground px-2.5 py-1 rounded-full">Out of Stock</span>
              </ProductOutOfStockBadge>
            </div>
          </div>
          <ProductMedia>
            <CollectionContent>
              <div class="flex gap-2 overflow-x-auto pb-1">
                <CollectionView>
                  <ProductMediaItem class="size-20 shrink-0 rounded-lg border-2 border-transparent hover:border-primary cursor-pointer object-cover transition-colors" />
                </CollectionView>
              </div>
            </CollectionContent>
          </ProductMedia>
        </div>

        <div class="space-y-6">
          <div class="space-y-2">
            <span class="text-2xl font-bold tracking-tight"><ProductName /></span>
            <span class="text-sm text-muted-foreground"><ProductSku /></span>
          </div>

          <div class="flex items-baseline gap-3">
            <span class="text-3xl font-bold"><ProductPrice /></span>
            <span class="text-lg text-muted-foreground line-through"><ProductComparePrice /></span>
          </div>

          <div class="flex items-center gap-2">
            <span class="text-sm text-muted-foreground"><ProductStockCount /></span>
          </div>

          <div class="text-muted-foreground leading-relaxed"><ProductDescription /></div>

          <ProductVariantProvider>
            <div class="space-y-4">
              <ProductVariantOptionRadioGroup name="Color" class="flex flex-wrap gap-2" />
              <ProductVariantOptionRadioGroup name="Size" class="flex flex-wrap gap-2" />
            </div>
          </ProductVariantProvider>

          <Separator />

          <div class="flex items-center gap-4">
            <ProductQuantityActions class="flex items-center border rounded-lg" />

            <ProductAddToCartTrigger class="flex-1 h-10 px-6 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
              Add to Cart
            </ProductAddToCartTrigger>

            <ProductToggleWishlistTrigger class="flex items-center justify-center size-10 border rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors" aria-label="Toggle wishlist">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="data-[in-wishlist]:fill-red-500 data-[in-wishlist]:stroke-red-500 transition-colors"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
            </ProductToggleWishlistTrigger>
          </div>
        </div>
      </Product>

      <Separator />

      <section class="space-y-6">
        <Text class="text-xl font-semibold">Reviews</Text>
        <ProductReviewList>
          <CollectionContent>
            <div class="space-y-4">
              <CollectionView>
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
              </CollectionView>
            </div>
          </CollectionContent>
          <CollectionEmpty>
            <Text class="text-muted-foreground text-sm">No reviews yet.</Text>
          </CollectionEmpty>
        </ProductReviewList>
      </section>
    </div>
  )
}
