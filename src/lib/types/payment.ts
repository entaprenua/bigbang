export interface PaymentPayload {
  orderId: string
  orderNumber: string
  paymentId: string
  amount: string
  currency: string
  phone: string
  email?: string
  metadata?: Record<string, string>
}

export interface PaymentResult {
  success: boolean
  provider: string
  transactionId?: string
  status: string
  message?: string
}
