import {
  Product, ProductImage, ProductName, ProductPrice, ProductMedia, ProductMediaItem,
  ProductComparePrice, ProductDiscount, ProductInStockBadge,
  ProductLowStockBadge, ProductOutOfStockBadge, ProductAddToCartTrigger
} from "~/components/ui/product"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "~/components/ui/carousel"
import { Grid } from "~/components/ui/grid"
import { Flex } from "~/components/ui/flex"
import { Text } from "~/components/ui/text"
import { CollectionView, CollectionContent } from "~/components/ui/collection"


export default function ProductDetailPage() {

  const Media = () => {
    return (
      <ProductMedia>
        <CollectionContent>
          <section class="text-xl text-bold"> Product Media </section>
          <Flex class=" border border-2 overflow-auto">
            <CollectionView>
              <ProductMediaItem class="w-full h-50 m-2 bg-red-100 aspect-square object-cover rounded-lg" />
            </CollectionView>
          </Flex>
        </CollectionContent>
      </ProductMedia>
    )
  }
  return (
    <Product class="group rounded-xl border bg-card overflow-hidden transition-shadow hover:shadow-lg">
      <div class="w-auto relative overflow-hidden bg-muted">
        <ProductImage class="max-w-80 max-h-[80] aspect-square object-cover transition-transform duration-300 group-hover:scale-105" />
        <span class="absolute top-2 left-2 text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
          -<ProductDiscount percentage />%
        </span>
        <div class="absolute bottom-2 left-2">
          <ProductInStockBadge>
            <span class="text-xs bg-success text-success-foreground px-2 py-0.5 rounded-full">In Stock</span>
          </ProductInStockBadge>
          <ProductLowStockBadge>
            <span class="text-xs bg-warning text-warning-foreground px-2 py-0.5 rounded-full">Low Stock</span>
          </ProductLowStockBadge>
          <ProductOutOfStockBadge>
            <span class="text-xs bg-destructive text-destructive-foreground px-2 py-0.5 rounded-full">Out of Stock</span>
          </ProductOutOfStockBadge>
        </div>
      </div>
      <div class="p-3 space-y-2">
        <div class="text-sm font-medium line-clamp-2 min-h-[2.5rem]">
          <ProductName />
        </div>
        <div class="flex items-baseline gap-2">
          <span class="font-bold">
            <ProductPrice />
          </span>
          <span class="text-xs text-muted-foreground line-through">
            <ProductComparePrice />
          </span>
        </div>
        <ProductAddToCartTrigger class="w-full text-sm" />
      </div>
      <Media />
    </Product>
  )
}
