import {
  Product, ProductImage, ProductName, ProductDescription, ProductSku,
  ProductPrice, ProductComparePrice, ProductDiscount,
  ProductInStockBadge, ProductLowStockBadge, ProductOutOfStockBadge, ProductStockCount,
  ProductAddToCart, ProductToggleWishlist,
  ProductMedia, ProductMediaItem,
  ProductOptions, ProductOptionName,
  ProductOptionValuesSegmentedControl,
  ProductReviewList, ProductReviewListItem,
  ProductReviewListItemStars, ProductReviewListItemAuthor,
  ProductReviewListItemDate, ProductReviewListItemComment,
  ProductOrder,
  ProductCartQuantity,
  ProductAddToFavourite,
  ProductRemoveFromFavourite,
} from "~/components/ui/product"
import { CollectionItems, CollectionContent, CollectionEmpty } from "~/components/ui/collection"
import { SegmentedControlItems, SegmentedControlItem, SegmentedControlItemInput, SegmentedControlItemLabel } from "~/components/ui/segmented-control"
import { Text } from "~/components/ui/text"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Flex } from "~/components/ui/flex"
import { cn } from "~/lib/utils"
import { MutationButton, MutationErrorAlertDialog, MutationLoading } from "~/components/ui/query"
import {
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCloseButton,
} from "~/components/ui/alert-dialog"
import ShoppingCartIcon from "lucide-solid/icons/shopping-cart"
import HeartIcon from "lucide-solid/icons/heart"
import { Badge } from "~/components/ui/badge"


const AddToCart = () => {

  return (
    <>
      <ProductAddToCart>
        <div class="relative w-full">
          <MutationButton
            class="max-w-80 w-full px-12 h-10 hover:cursor-pointer bg-yellow-600 data-pending:text-transparent"
            variant="default"
          >
            <CartQuantityBadge />
            Add to Cart
          </MutationButton>
          <MutationLoading class="absolute inset-0 flex items-center justify-center" />
        </div>
        <MutationErrorAlertDialog>
          <AlertDialogContent>
            <AlertDialogTitle>Error</AlertDialogTitle>
            <AlertDialogDescription>Could not add this item to your cart.</AlertDialogDescription>
            <AlertDialogCloseButton />
          </AlertDialogContent>
        </MutationErrorAlertDialog>
      </ProductAddToCart>
    </>
  )
}

const CartQuantityBadge = () => {
  return (
    <div class="flex justify-center">
      <div class="w-auto">
        <ShoppingCartIcon size="20" />
        <Badge
          round
          class="relative bg- ring-none border-none -mt-4 ml-1 text-sm top-0 right-0 -translate-y-1/2 translate-x-1/2   w-4 h-4 flex items-center justify-center"
        >
          <ProductCartQuantity />
        </Badge>
      </div>
    </div>
  )
}
const Order = () => {
  return (
    <>
      <ProductOrder class="w-50 bg-red-500 h-10 hover:cursor-pointer hover:bg-secondary/80" href="/checkout" > Order Now </ProductOrder>
    </>
  )
}

const AddFavourite = () => {
  return (
    <ProductAddToFavourite>
      <div class="relative w-full">
        <MutationButton
          variant="outline"
          class="w-30 h-10 hover:cursor-pointer data-pending:text-transparent"
        >
          <HeartIcon />
          Add to Favorites
        </MutationButton>
        <MutationLoading class="absolute inset-0 flex items-center justify-center" />
      </div>
      <MutationErrorAlertDialog>
        <AlertDialogContent>
          <AlertDialogTitle>Error</AlertDialogTitle>
          <AlertDialogDescription>Could not update your favorites.</AlertDialogDescription>
          <AlertDialogCloseButton />
        </AlertDialogContent>
      </MutationErrorAlertDialog>
    </ProductAddToFavourite>
  )
}

const RemoveFavourite = () => {
  return (
    <ProductRemoveFromFavourite>
      <div class="relative w-full">
        <MutationButton
          variant="outline"
          class="w-full h-10 hover:cursor-pointer data-pending:text-transparent"
        >
          <HeartIcon class="fill-current text-destructive" />
          Remove from Favorites
        </MutationButton>
        <MutationLoading class="absolute inset-0 flex items-center justify-center" />
      </div>
      <MutationErrorAlertDialog>
        <AlertDialogContent>
          <AlertDialogTitle>Error</AlertDialogTitle>
          <AlertDialogDescription>Could not update your favorites.</AlertDialogDescription>
          <AlertDialogCloseButton />
        </AlertDialogContent>
      </MutationErrorAlertDialog>
    </ProductRemoveFromFavourite>
  )
}

const Options = () => {

  return (
    <ProductOptions>
      <CollectionItems>
        <Card class="w-auto">
          <CardHeader class="p-3 pb-2">
            <CardTitle class="text-sm"><ProductOptionName /></CardTitle>
          </CardHeader>
          <CardContent class="p-3 pt-0">
            <ProductOptionValuesSegmentedControl class="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-1">
              <SegmentedControlItems>
                <SegmentedControlItem class="hover:cursor-pointer">
                  <SegmentedControlItemInput />
                  <SegmentedControlItemLabel />
                </SegmentedControlItem>
              </SegmentedControlItems>
            </ProductOptionValuesSegmentedControl>
          </CardContent>
        </Card>
      </CollectionItems>
    </ProductOptions>
  )
}


export {
  Order,
  Options,
  AddToCart,
  CartQuantityBadge,
  AddFavourite,
  RemoveFavourite
}


