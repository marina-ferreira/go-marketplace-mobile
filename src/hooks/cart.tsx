import React, {
  createContext,
  useState,
  useCallback,
  useContext,
  useEffect
} from 'react'

import AsyncStorage from '@react-native-community/async-storage'

interface Product {
  id: string
  title: string
  image_url: string
  price: number
  quantity: number
}

interface CartContext {
  products: Product[]
  addToCart(item: Omit<Product, 'quantity'>): void
  increment(id: string): void
  decrement(id: string): void
}

const CartContext = createContext<CartContext | null>(null)

const CartProvider: React.FC = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    async function loadProducts(): Promise<void> {
      // TODO LOAD ITEMS FROM ASYNC STORAGE
    }

    loadProducts()
  }, [])

  const increment = useCallback(
    async id => {
      const product = products.find(item => item.id === id)
      if (!product) return

      const addedProduct = { ...product, quantity: product.quantity + 1 }
      const filteredProducts = products.filter(item => item.id !== product.id)

      setProducts([...filteredProducts, addedProduct])
    },
    [products]
  )

  const decrement = useCallback(
    async id => {
      const product = products.find(item => item.id === id)
      if (!product) return

      const filteredProducts = products.filter(item => item.id !== product.id)
      const removedProduct = { ...product, quantity: product.quantity - 1 }

      const items =
        product.quantity === 1
          ? [...filteredProducts]
          : [...filteredProducts, removedProduct]

      setProducts(items)
    },
    [products]
  )

  const addToCart = useCallback(
    async product => {
      const productIndex = products.findIndex(({ id }) => id === product.id)

      if (productIndex < 0) {
        setProducts([...products, { ...product, quantity: 1 }])
        return
      }

      increment(product.id)
    },
    [products, increment]
  )

  const value = React.useMemo(
    () => ({ addToCart, increment, decrement, products }),
    [products, addToCart, increment, decrement]
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

function useCart(): CartContext {
  const context = useContext(CartContext)

  if (!context) {
    throw new Error(`useCart must be used within a CartProvider`)
  }

  return context
}

export { CartProvider, useCart }
