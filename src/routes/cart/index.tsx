import { CartCount } from "~/components/ui/cart"
import { A } from "@solidjs/router"

export default function CartPage() {
  return (
    <div class="min-h-screen bg-stone-50 flex items-center justify-center">
      <div class="bg-white rounded-sm shadow-sm p-12 text-center max-w-md mx-4">
        <h1 class="text-2xl font-serif font-light mb-4">Your Cart</h1>

        <div class="inline-flex items-center justify-center w-16 h-16 bg-stone-100 rounded-full mb-4">
          <span class="text-2xl font-serif text-stone-700"><CartCount /></span>
        </div>

        <p class="text-stone-500 mb-6">items in your cart</p>

        <A
          href="/products"
          class="inline-block bg-stone-800 hover:bg-stone-700 text-white px-8 py-3 rounded-sm text-sm tracking-wide transition-colors"
        >
          Continue Shopping
        </A>
      </div>
    </div>
  )
}
