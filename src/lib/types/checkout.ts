export interface CheckoutFormData {
  email: string
  name: string
  phone: string
  provider: string
  paymentPhone: string
  deliveryMethod: string
  deliveryLocation: string
  deliveryZone: string
  shippingAddress: Record<string, string>
  billingAddress: Record<string, string>
  notes: string
  directBuy?: {
    productId: string
    quantity: number
    subtotal: string
  }
}
