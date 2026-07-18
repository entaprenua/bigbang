import {
  Product, ProductImage, ProductName, ProductPrice,
  ProductComparePrice, ProductDiscount, ProductInStockBadge,
  ProductLowStockBadge, ProductOutOfStockBadge, ProductAddToCart
} from "~/components/ui/product"
import { Flex } from "~/components/ui/flex"
import { Currency } from "~/components/ui/currency"
import { MutationButton, MutationLoading, MutationError } from "~/components/ui/query"
import * as ProductActions from "./product-actions"

export default function ProductCard() {
  return (
    <Product href="/products" class="group rounded-lg border bg-card overflow-hidden transition-all hover:shadow-xl hover:-translate-y-0.5">
      <div class="relative overflow-hidden bg-muted">
        <ProductImage class="w-full aspect-[4/5] object-cover transition-transform duration-500 group-hover:scale-105" />
        <span class="absolute top-2 right-2 text-[11px] font-semibold bg-primary text-primary-foreground px-2 py-1 rounded-md shadow-sm">
          -<ProductDiscount percentage />%
        </span>
        <div class="absolute top-2 left-2">
          <ProductOutOfStockBadge>
            <span class="text-[11px] font-medium bg-background/90 text-foreground px-2 py-1 rounded-md backdrop-blur-sm shadow-sm">Out of Stock</span>
          </ProductOutOfStockBadge>
        </div>
      </div>
      <div class="p-3 space-y-1.5">
        <div class="text-sm font-medium line-clamp-2 leading-snug"><ProductName /></div>
        <div class="flex items-baseline gap-1.5">
          <span class="text-sm font-bold"><Currency /> <ProductPrice /></span>
          <span class="text-xs text-muted-foreground line-through"><Currency /> <ProductComparePrice /></span>
        </div>
        <div class="flex flex-wrap items-center gap-x-2 gap-y-0.5">
          <ProductLowStockBadge>
            <span class="text-[11px] text-warning font-medium">Only few left</span>
          </ProductLowStockBadge>
          <ProductInStockBadge />
        </div>
      </div>
      <div class="flex flex-col justify-center p-3 gap-2 w-full">
        <ProductActions.CartQuantityBadge />
        <ProductActions.AddToCart />
      </div>

    </Product>
  )
}


