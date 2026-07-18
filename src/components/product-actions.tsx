import {
  Product, ProductImage, ProductName, ProductDescription, ProductSku,
  ProductPrice, ProductComparePrice, ProductDiscount,
  ProductInStockBadge, ProductLowStockBadge, ProductOutOfStockBadge, ProductStockCount,
  ProductAddToCart, ProductToggleWishlist,
  ProductMedia, ProductMediaItem,
  ProductOptions, ProductOptionName,
  ProductOptionValuesRadioGroup,
  ProductReviewList, ProductReviewListItem,
  ProductReviewListItemStars, ProductReviewListItemAuthor,
  ProductReviewListItemDate, ProductReviewListItemComment,
  ProductOrder,
  ProductCartQuantity,
} from "~/components/ui/product"
import { CollectionItems, CollectionContent, CollectionEmpty } from "~/components/ui/collection"
import { RadioGroupItems, RadioGroupItem, RadioGroupItemLabel } from "~/components/ui/radio-group"
import { Text } from "~/components/ui/text"
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
import { Badge } from "~/components/ui/badge"


const AddToCart = () => {

  return (
    <>
      <ProductAddToCart>
        <div class="relative">
          <MutationButton
            class="w-full hover:cursor-pointer bg-amber-300  h-8 text-current data-pending:text-transparent"
            variant="ghost"
          >
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
    <div class="flex w-full justify-center">
      <div class="w-auto">
        <ShoppingCartIcon size="20" />
        <Badge
          round
          variant="error"
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
      <ProductOrder class="w-full bg-amber-500 hover:cursor-pointer h-8" href="/checkout" > Order Now </ProductOrder>
    </>
  )
}

const Options = () => {

  return (
    <ProductOptions>
      <CollectionItems>
        <div class="flex">
          <span class="mr-5"> <ProductOptionName /> </span>
          <ProductOptionValuesRadioGroup>
            <div class="flex wrap gap-3">
              <RadioGroupItems>
                <RadioGroupItem class="hover:cursor-pointer">
                  <RadioGroupItemLabel />
                </RadioGroupItem>
              </RadioGroupItems>
            </div>
          </ProductOptionValuesRadioGroup>
        </div>
      </CollectionItems>
    </ProductOptions>
  )
}


export {
  Order,
  Options,
  AddToCart,
  CartQuantityBadge
}


