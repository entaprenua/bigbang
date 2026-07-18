import { createMemo, type JSX } from 'solid-js'
import { Collection } from '../collection'
import { useCart, type CartItemContextData } from '../cart/cart-context'
import { useDirectBuy } from '../direct-buy/direct-buy-context'

type CheckoutItemsProps = {
  class?: string
  children?: JSX.Element
}

function CheckoutItems(props: CheckoutItemsProps) {
  const cart = useCart()
  const directBuy = useDirectBuy()

  const data = createMemo((): CartItemContextData[] => {
    if (directBuy) {
      const item = directBuy.item()
      return item ? [item as CartItemContextData] : []
    }
    return cart.items.filter(item => item.selected)
  })

  return (
    <Collection data={data()}>
      {props.children}
    </Collection>
  )
}

export { CheckoutItems }
export type { CheckoutItemsProps }
