import {
  DirectBuyItemQuantity, DirectBuyItemQuantityDecrement, DirectBuyItemQuantityIncrement,
  DirectBuyItemQuantityActions,
} from "./ui/direct-buy/direct-buy-sections"
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

export const DirectBuyQuantity = (props: { class?: string }) => {
  return (
    <Flex class={cn("items-center gap-4 justify-center p-0 w-auto", props.class)}>
      <DirectBuyItemQuantityActions>
        <DirectBuyItemQuantityDecrement>
          <div class="relative">
            <MutationButton
              class="hover:cursor-pointer hover:bg- data-pending:text-transparent"
              size="icon"
              variant="ghost"
            >
              <MinusIcon />
            </MutationButton>
            <MutationLoading />
          </div>
          <MutationErrorAlertDialog>
            <AlertDialogContent>
              <AlertDialogTitle>Error</AlertDialogTitle>
              <AlertDialogDescription>Could not update the quantity.</AlertDialogDescription>
              <AlertDialogCloseButton />
            </AlertDialogContent>
          </MutationErrorAlertDialog>
        </DirectBuyItemQuantityDecrement>
        <Separator orientation="vertical" class="w-0.5 mx-2 " />
        <DirectBuyItemQuantity />
        <Separator orientation="vertical" class="w-0.5 mx-2 " />
        <DirectBuyItemQuantityIncrement>
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
        </DirectBuyItemQuantityIncrement>
      </DirectBuyItemQuantityActions>
    </Flex>
  )
}
