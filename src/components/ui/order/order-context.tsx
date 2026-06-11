import { createContext, useContext, createSignal, createMemo, type Accessor, type JSX } from 'solid-js'

type OrderItem = {
  productId: string
  name: string
  price: number
  quantity: number
  image?: string
}

type OrderContextType = {
  items: Accessor<OrderItem[]>
  subtotal: Accessor<number>
  addItem: (item: OrderItem) => void
  addItems: (items: OrderItem[]) => void
  clear: () => void
}

const OrderContext = createContext<OrderContextType>()

function OrderProvider(props: { children?: JSX.Element }) {
  const [items, setItems] = createSignal<OrderItem[]>([])
  const subtotal = createMemo(() => items().reduce((s, i) => s + i.price * i.quantity, 0))

  const addItem = (item: OrderItem) => setItems(prev => [...prev, item])
  const addItems = (newItems: OrderItem[]) => setItems(newItems)
  const clear = () => setItems([])

  return (
    <OrderContext.Provider value={{ items, subtotal, addItem, addItems, clear }}>
      {props.children}
    </OrderContext.Provider>
  )
}

function useOrder() {
  const ctx = useContext(OrderContext)
  if (!ctx) throw new Error('useOrder must be used within OrderProvider')
  return ctx
}

export { OrderProvider, useOrder, type OrderItem }
