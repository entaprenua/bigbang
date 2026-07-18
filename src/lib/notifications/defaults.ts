export type NotificationTemplate = {
  subject: string
  bodyHtml: string
  bodyText: string
}

export type NotificationDefaults = Record<string, NotificationTemplate>

export type OrderItem = {
  productName: string
  quantity: number
  price: string
}

export type CartItem = {
  productName: string
  image?: string
  price: string
  quantity: number
}

export type OrderEventContext = {
  customer: { name: string; email: string }
  order: {
    orderNumber: string
    total: string
    subtotal: string
    currency: string
    status: string
    trackingNumber?: string
  }
  items: OrderItem[]
  store: { name: string }
}

export type CartAbandonedContext = {
  customer: { name: string; email: string }
  cart: {
    total: string
    itemCount: number
    recoveryUrl: string
  }
  cartItems: CartItem[]
  store: { name: string }
}

export type NotificationContext = OrderEventContext | CartAbandonedContext

const wrapper = (content: string) => `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; color: #333; line-height: 1.6; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #4f46e5; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { padding: 20px; background: #f9fafb; border: 1px solid #e5e7eb; }
    .content h2 { color: #4f46e5; margin-top: 0; }
    .footer { text-align: center; padding: 15px; color: #6b7280; font-size: 12px; }
    .footer p { margin: 4px 0; }
    table { width: 100%; border-collapse: collapse; margin: 16px 0; }
    th, td { padding: 10px 12px; text-align: left; border-bottom: 1px solid #e5e7eb; }
    th { background: #f3f4f6; font-weight: 600; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; }
    .total { font-weight: bold; font-size: 18px; color: #4f46e5; text-align: right; padding-top: 12px; }
    .cta { display: inline-block; background: #4f46e5; color: white; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px; margin: 16px 0; }
    .cta:hover { background: #4338ca; }
    .detail-label { font-weight: 600; color: #6b7280; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; }
  </style>
</head>
<body>
  <div class="container">${content}</div>
</body>
</html>`

export const defaultNotificationTemplates: NotificationDefaults = {
  order_confirmation: {
    subject: "Order #{{order.orderNumber}} Confirmed!",
    bodyHtml: wrapper(`<div class="header">
      <h1>Order Confirmed!</h1>
      <p>Order #{{order.orderNumber}}</p>
    </div>
    <div class="content">
      <h2>Hi {{customer.name}},</h2>
      <p>Thank you for your order! We're processing it and will notify you when it ships.</p>

      <h3>Order Summary</h3>
      <table>
        <tr><th>Item</th><th>Qty</th><th>Price</th></tr>
        {{#each items}}
        <tr>
          <td>{{productName}}</td>
          <td>{{quantity}}</td>
          <td>{{price}}</td>
        </tr>
        {{/each}}
      </table>

      <p class="detail-label">Subtotal</p>
      <p>{{order.subtotal}}</p>
      <p class="total">Total: {{order.total}} {{order.currency}}</p>
    </div>
    <div class="footer">
      <p>{{store.name}}</p>
    </div>`),
    bodyText: `Hi {{customer.name}},

Thank you for your order! We're processing it and will notify you when it ships.

Order #{{order.orderNumber}}
Total: {{order.total}} {{order.currency}}

Items:
{{#each items}}
  - {{productName}} x{{quantity}} — {{price}}
{{/each}}

{{store.name}}`,
  },

  payment_failed: {
    subject: "Payment Failed for Order #{{order.orderNumber}}",
    bodyHtml: wrapper(`<div class="header" style="background: #dc2625;">
      <h1>Payment Failed</h1>
      <p>Order #{{order.orderNumber}}</p>
    </div>
    <div class="content">
      <h2>Hi {{customer.name}},</h2>
      <p>We were unable to process your payment for the order below. Please check your payment details and try again.</p>

      <h3>Order Summary</h3>
      <table>
        <tr><th>Item</th><th>Qty</th><th>Price</th></tr>
        {{#each items}}
        <tr>
          <td>{{productName}}</td>
          <td>{{quantity}}</td>
          <td>{{price}}</td>
        </tr>
        {{/each}}
      </table>

      <p class="total">Total: {{order.total}} {{order.currency}}</p>
      <p class="detail-label">Status</p>
      <p>{{order.status}}</p>
      <br/>
      <p>If you have any questions, please contact our support team.</p>
    </div>
    <div class="footer">
      <p>{{store.name}}</p>
    </div>`),
    bodyText: `Hi {{customer.name}},

We were unable to process your payment for Order #{{order.orderNumber}}.

Total: {{order.total}} {{order.currency}}
Status: {{order.status}}

Please check your payment details and try again. If you have any questions, contact our support team.

{{store.name}}`,
  },

  shipped: {
    subject: "Order #{{order.orderNumber}} Has Shipped!",
    bodyHtml: wrapper(`<div class="header">
      <h1>Your Order Has Shipped!</h1>
      <p>Order #{{order.orderNumber}}</p>
    </div>
    <div class="content">
      <h2>Hi {{customer.name}},</h2>
      <p>Great news! Your order is on its way.</p>

      <p class="detail-label">Tracking Number</p>
      <p>{{order.trackingNumber}}</p>

      <h3>Order Summary</h3>
      <table>
        <tr><th>Item</th><th>Qty</th><th>Price</th></tr>
        {{#each items}}
        <tr>
          <td>{{productName}}</td>
          <td>{{quantity}}</td>
          <td>{{price}}</td>
        </tr>
        {{/each}}
      </table>

      <p class="total">Total: {{order.total}} {{order.currency}}</p>
    </div>
    <div class="footer">
      <p>{{store.name}}</p>
    </div>`),
    bodyText: `Hi {{customer.name}},

Great news! Your order has shipped!

Order #{{order.orderNumber}}
Tracking Number: {{order.trackingNumber}}
Total: {{order.total}} {{order.currency}}

{{store.name}}`,
  },

  delivered: {
    subject: "Order #{{order.orderNumber}} Has Been Delivered",
    bodyHtml: wrapper(`<div class="header" style="background: #059669;">
      <h1>Delivered!</h1>
      <p>Order #{{order.orderNumber}}</p>
    </div>
    <div class="content">
      <h2>Hi {{customer.name}},</h2>
      <p>Your order has arrived! We hope you love everything you ordered.</p>

      <h3>Order Summary</h3>
      <table>
        <tr><th>Item</th><th>Qty</th><th>Price</th></tr>
        {{#each items}}
        <tr>
          <td>{{productName}}</td>
          <td>{{quantity}}</td>
          <td>{{price}}</td>
        </tr>
        {{/each}}
      </table>

      <p class="total">Total: {{order.total}} {{order.currency}}</p>

      <p>If you have any issues with your order, please don't hesitate to reach out.</p>
    </div>
    <div class="footer">
      <p>{{store.name}}</p>
    </div>`),
    bodyText: `Hi {{customer.name}},

Your order has arrived! We hope you love everything you ordered.

Order #{{order.orderNumber}}
Total: {{order.total}} {{order.currency}}

If you have any issues with your order, please reach out.

{{store.name}}`,
  },

  ready_for_pickup: {
    subject: "Order #{{order.orderNumber}} Ready for Pickup",
    bodyHtml: wrapper(`<div class="header" style="background: #ca8a04;">
      <h1>Ready for Pickup!</h1>
      <p>Order #{{order.orderNumber}}</p>
    </div>
    <div class="content">
      <h2>Hi {{customer.name}},</h2>
      <p>Your order is ready and waiting for you! Please come pick it up at your earliest convenience.</p>

      <h3>Order Summary</h3>
      <table>
        <tr><th>Item</th><th>Qty</th><th>Price</th></tr>
        {{#each items}}
        <tr>
          <td>{{productName}}</td>
          <td>{{quantity}}</td>
          <td>{{price}}</td>
        </tr>
        {{/each}}
      </table>

      <p class="total">Total: {{order.total}} {{order.currency}}</p>

      <p><strong>Please bring your order confirmation and a valid ID when picking up.</strong></p>
    </div>
    <div class="footer">
      <p>{{store.name}}</p>
    </div>`),
    bodyText: `Hi {{customer.name}},

Your order is ready for pickup!

Order #{{order.orderNumber}}
Total: {{order.total}} {{order.currency}}

Please bring your order confirmation and a valid ID when picking up.

{{store.name}}`,
  },

  cart_abandoned: {
    subject: "You left something in your cart!",
    bodyHtml: wrapper(`<div class="header" style="background: #f59e0b;">
      <h1>You left something behind!</h1>
    </div>
    <div class="content">
      <h2>Hi {{customer.name}},</h2>
      <p>Your cart at <strong>{{store.name}}</strong> is waiting for you. Complete your purchase before these items sell out!</p>

      <h3>Items in Your Cart</h3>
      <table>
        <tr><th>Item</th><th>Qty</th><th>Price</th></tr>
        {{#each cartItems}}
        <tr>
          <td>{{productName}}</td>
          <td>{{quantity}}</td>
          <td>{{price}}</td>
        </tr>
        {{/each}}
      </table>

      <p class="total">Total ({{cart.itemCount}} items): {{cart.total}}</p>

      <div style="text-align: center;">
        <a href="{{cart.recoveryUrl}}" class="cta">Return to Cart</a>
      </div>
    </div>
    <div class="footer">
      <p>{{store.name}}</p>
    </div>`),
    bodyText: `Hi {{customer.name}},

Your cart at {{store.name}} is waiting for you!

Items in Your Cart:
{{#each cartItems}}
  - {{productName}} x{{quantity}} — {{price}}
{{/each}}

Total ({{cart.itemCount}} items): {{cart.total}}

Visit your cart to complete your purchase:
{{cart.recoveryUrl}}

{{store.name}}`,
  },
}
