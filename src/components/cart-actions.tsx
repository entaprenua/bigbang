import {
  CartItemQuantity, CartItemQuantityDecrement, CartItemQuantityIncrement,
  CartItemQuantityActions, CartItemRemove,
} from "./ui/cart/cart-sections"
import { Flex } from "./ui/flex"
import { Separator } from "./ui/separator"
import { cn } from "~/lib/utils"
import { MutationButton, MutationErrorAlertDialog, MutationLoading } from "./ui/query"
import {
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCloseButton,
} from "./ui/alert-dialog"
import PlusIcon from "lucide-solid/icons/plus"
import MinusIcon from "lucide-solid/icons/minus"
import DeleteIcon from "lucide-solid/icons/trash-2"

export const Quantity = (props: { class?: string }) => {
  return (
    <Flex class={cn("items-center gap-4 justify-center p-0 w-auto", props.class)}>
      <CartItemQuantityActions>
        <CartItemQuantityDecrement>
          <div class="relative">
            <MutationButton
              class="hover:cursor-pointer hover:bg- data-pending:text-transparent"
              size="icon"
              variant="ghost"
            >
              <MinusIcon />
            </MutationButton>
            <MutationLoading class="absolute inset-0 flex items-center justify-center" />
          </div>
          <MutationErrorAlertDialog>
            <AlertDialogContent>
              <AlertDialogTitle>Error</AlertDialogTitle>
              <AlertDialogDescription>Could not update the quantity.</AlertDialogDescription>
              <AlertDialogCloseButton />
            </AlertDialogContent>
          </MutationErrorAlertDialog>
        </CartItemQuantityDecrement>
        <Separator orientation="vertical" class="w-0.5 mx-2 " />
        <CartItemQuantity />
        <Separator orientation="vertical" class="w-0.5 mx-2 " />
        <CartItemQuantityIncrement>
          <div class="relative">
            <MutationButton
              class="hover:cursor-pointer hover:bg- data-pending:text-transparent"
              size="icon"
              variant="ghost"
            >
              <PlusIcon />
            </MutationButton>
            <MutationLoading class={"absolute inset-0 flex items-center justify-center"} />
          </div>
          <MutationErrorAlertDialog>
            <AlertDialogContent>
              <AlertDialogTitle>Error</AlertDialogTitle>
              <AlertDialogDescription>Could not update the quantity.</AlertDialogDescription>
              <AlertDialogCloseButton />
            </AlertDialogContent>
          </MutationErrorAlertDialog>
        </CartItemQuantityIncrement>
      </CartItemQuantityActions>
    </Flex>
  )
}

export const Remove = () => {
  return (
    <CartItemRemove>
      <div class="relative bg-destructive w-30 rounded-lg ">
        <MutationButton
          class="hover:cursor-pointer h-8 data-pending:text-transparent"
          variant="ghost"
        >
          <div class="flex gap-2 w-auto"> <DeleteIcon /> Remove </div>
        </MutationButton>
        <MutationLoading class="absolute inset-0 flex items-center justify-center" />
      </div>
      <MutationErrorAlertDialog>
        <AlertDialogContent>
          <AlertDialogTitle>Error</AlertDialogTitle>
          <AlertDialogDescription>Could not remove this item from your cart.</AlertDialogDescription>
          <AlertDialogCloseButton />
        </AlertDialogContent>
      </MutationErrorAlertDialog>
    </CartItemRemove>
  )
}
