import {
  CheckoutSettingsProvider,
  CheckoutProvider,
  CheckoutContactTextField,
  CheckoutNameTextField,
  CheckoutNotesTextArea,
  CheckoutDeliveryZones,
  CheckoutDeliveryZoneName,
  CheckoutDeliveryLocationSegmentedControl,
  CheckoutPaymentMethod,
  CheckoutPaymentMethodSelectButton,
  CheckoutShippingStreetField,
  CheckoutShippingCityField,
  CheckoutShippingStateField,
  CheckoutShippingZipField,
  CheckoutShippingCountryField,
  CheckoutPaymentPhoneTextField,
  CheckoutItems,
  CheckoutSubmitProvider,
  CheckoutResult,
} from "~/components/ui/checkout"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "~/components/ui/accordion"
import { DirectBuyProvider } from "~/components/ui/direct-buy/direct-buy-context"
import {
  MutationButton,
  MutationLoading,
  MutationErrorMessage,
  MutationErrorAlertDialog,
  MutationSuccessDialog,
  MutationSuccessMessage,
} from "~/components/ui/query"
import {
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCloseButton,
} from "~/components/ui/alert-dialog"
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogCloseButton,
} from "~/components/ui/dialog"
import { RadioGroupItems, RadioGroupItem, RadioGroupItemControl, RadioGroupItemLabel } from "~/components/ui/radio-group"
import { SegmentedControlItems, SegmentedControlItem, SegmentedControlItemLabel, SegmentedControlItemInput, SegmentedControlIndicator } from "~/components/ui/segmented-control"
import { CollectionItems } from "~/components/ui/collection"
import { Product, ProductImage, ProductName, ProductPrice } from "~/components/ui/product"
import { Currency } from "~/components/ui/currency"
import { CartItemQuantity } from "~/components/ui/cart/cart-sections"
import { Grid, Col } from "~/components/ui/grid"
import { Text } from "~/components/ui/text"
import { Flex } from "~/components/ui/flex"
import { Separator } from "~/components/ui/separator"

export default function CheckoutPage() {
  return (
    <CheckoutSettingsProvider>
      <CheckoutProvider>
        <DirectBuyProvider>
          <div class="bg-stone-50 min-h-screen">
            <div class="container mx-auto px-4 py-12 max-w-6xl">
              <Text variant="h2" class="font-serif font-light mb-8">Checkout</Text>

              <Grid cols={1} colsLg={3} class="gap-8">
                {/* Left — form sections */}
                <Col span={1} spanLg={2} class="space-y-10">

                  {/* ── Contact ── */}
                  <section>
                    <Text variant="h3" class="font-serif font-light mb-4">Contact</Text>
                    <div class="rounded-sm p-6 space-y-4">
                      <CheckoutContactTextField />
                      <CheckoutNameTextField />
                      <CheckoutNotesTextArea />
                    </div>
                  </section>

                  {/* ── Delivery ── */}
                  <section>
                    <Text variant="h3" class="font-serif font-light">Delivery Location</Text>
                    <div class="rounded-sm p-6 space-y-6">
                      <div class="border rounded-sm p-4 space-y-3">
                        <CheckoutDeliveryZones>
                          <Grid cols={1} colsSm={2} colsMd={3} colsLg={4} class="gap-4">
                            <CollectionItems>
                              <Col span={1}>
                                <CheckoutDeliveryZoneName class="text-lg font-medium" />
                                <CheckoutDeliveryLocationSegmentedControl class="flex flex-row flex-wrap  gap-1">
                                  <SegmentedControlItems>
                                    <SegmentedControlItem>
                                      <SegmentedControlItemInput />
                                      <SegmentedControlItemLabel />
                                    </SegmentedControlItem>
                                  </SegmentedControlItems>
                                </CheckoutDeliveryLocationSegmentedControl>
                              </Col>
                            </CollectionItems>
                          </Grid>
                        </CheckoutDeliveryZones>
                      </div>

                      {/* Shipping address */}
                      <div class="space-y-4">
                        <CheckoutShippingStreetField />
                        <Grid cols={1} colsMd={2} class="gap-4">
                          <CheckoutShippingCityField />
                          <CheckoutShippingStateField />
                          <CheckoutShippingZipField />
                          <CheckoutShippingCountryField />
                        </Grid>
                      </div>

                    </div>
                  </section>

                  {/* ── Payment ── */}
                  <section>
                    <Text variant="h3" class="font-serif font-light">Payment</Text>
                    <div class="rounded-sm p-6 space-y-4">
                      <Accordion collapsible>
                        <CheckoutPaymentMethod method="mpesa">
                          <AccordionItem value="mpesa">
                            <AccordionTrigger as={CheckoutPaymentMethodSelectButton}>
                              <span>M-Pesa</span>
                              <span class="text-xs text-muted-foreground">Pay via mobile money</span>
                            </AccordionTrigger>
                            <AccordionContent>
                              <div class="space-y-4 pt-4">
                                <CheckoutPaymentPhoneTextField />
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </CheckoutPaymentMethod>
                        <CheckoutPaymentMethod method="stripe">
                          <AccordionItem value="stripe">
                            <AccordionTrigger as={CheckoutPaymentMethodSelectButton}>
                              <span>Card</span>
                              <span class="text-xs text-muted-foreground">Pay via credit or debit card</span>
                            </AccordionTrigger>
                            <AccordionContent>
                              <div class="space-y-4 pt-4" />
                            </AccordionContent>
                          </AccordionItem>
                        </CheckoutPaymentMethod>
                      </Accordion>
                    </div>
                  </section>

                </Col>

                {/* Right — order summary */}
                <Col span={1} spanLg={1}>
                  <div class="bg-white rounded-sm p-6 sticky top-4 space-y-4">
                    <Text variant="h3" class="font-serif font-light">Order Summary</Text>

                    <CheckoutItems>
                      <CollectionItems>
                        <Product href="products" class="flex gap-3">
                          <ProductImage class="w-16 h-16 object-cover rounded-sm shrink-0" />
                          <div class="flex-1 min-w-0 space-y-1">
                            <Text class="text-sm font-medium truncate"><ProductName /></Text>
                            <Flex class="text-xs text-stone-500 gap-2 justify-start">
                              <span>Qty: </span><CartItemQuantity />
                            </Flex>
                            <Text class="text-sm"><Currency /> <ProductPrice /></Text>
                          </div>
                        </Product>
                      </CollectionItems>
                    </CheckoutItems>

                    <Separator />

                    <CheckoutSubmitProvider>
                      <MutationButton class="w-full bg-blue-500 hover:bg-stone-700 py-3 rounded-sm group-not-data-[can-checkout]:pointer-events-none group-not-data-[can-checkout]:opacity-50">
                        Place Order
                      </MutationButton>
                      <MutationLoading />
                      <MutationErrorAlertDialog showBackdrop>
                        <AlertDialogContent>
                          <AlertDialogTitle>Error</AlertDialogTitle>
                          <AlertDialogDescription>
                            <MutationErrorMessage />
                          </AlertDialogDescription>
                          <AlertDialogCloseButton />
                        </AlertDialogContent>
                      </MutationErrorAlertDialog>
                      <MutationSuccessDialog>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Order Confirmed</DialogTitle>
                            <DialogDescription>
                              <MutationSuccessMessage />
                            </DialogDescription>
                          </DialogHeader>
                          <DialogCloseButton />
                        </DialogContent>
                      </MutationSuccessDialog>
                    </CheckoutSubmitProvider>

                    <CheckoutResult />
                  </div>
                </Col>
              </Grid>
            </div>
          </div>
        </DirectBuyProvider>
      </CheckoutProvider>
    </CheckoutSettingsProvider>
  )
}
