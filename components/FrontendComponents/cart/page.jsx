"use client"

import { useEffect, useState } from "react"
import { Trash2, ShoppingBag, Plus, Minus } from "lucide-react"
import { useRouter } from "next/navigation"

export default function EnhancedCart() {
  const router = useRouter()
  const [cartItems, setCartItems] = useState([])
  const [selectedIds, setSelectedIds] = useState([])

  useEffect(() => {
    const syncCart = () => {
      const cart = localStorage.getItem("cartItems")
      if (cart) setCartItems(JSON.parse(cart))
    }
    window.addEventListener("storage", syncCart)
    const interval = setInterval(syncCart, 1000)
    syncCart() // initial load
    return () => {
      window.removeEventListener("storage", syncCart)
      clearInterval(interval)
    }
  }, [])

  const toggleSelect = (id) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]))
  }

  const removeItem = (id) => {
    setCartItems((prevItems) => {
      const updatedCart = prevItems.filter((item) => item.id !== id)
      localStorage.setItem("cartItems", JSON.stringify(updatedCart))
      return updatedCart
    })
    setSelectedIds((prev) => prev.filter((itemId) => itemId !== id))
  }

  const increaseQty = (id) => {
    setCartItems((prevItems) => {
      const updatedCart = prevItems.map((item) => (item.id === id ? { ...item, quantity: item.quantity + 1 } : item))
      localStorage.setItem("cartItems", JSON.stringify(updatedCart))
      return updatedCart
    })
  }

  const decreaseQty = (id) => {
    setCartItems((prevItems) => {
      const updatedCart = prevItems.map((item) =>
        item.id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item,
      )
      localStorage.setItem("cartItems", JSON.stringify(updatedCart))
      return updatedCart
    })
  }

  const handleCheckout = () => {
    if (selectedIds.length === 0) {
      alert("Please select at least one item to checkout!")
      return
    }

    // Only allow valid string IDs
    const validSelectedIds = selectedIds.filter((id) => id && typeof id === "string")

    const selectedItems = cartItems.filter((item) => validSelectedIds.includes(item._id || item.id))

    const idsParam = selectedItems
      .map((item) => item._id || item.id)
      .filter(Boolean) // remove empty values
      .join(",")

    const qtyParam = selectedItems.map((item) => item.quantity || 1).join(",")

    router.push(`/checkoutPage?_id=${idsParam}&quantity=${qtyParam}`)
  }

  // helper function to limit words
  const limitWords = (text, limit) => {
    if (!text) return ""
    const words = text.split(" ")
    return words.length > limit ? words.slice(0, limit).join(" ") + "..." : text
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-4">
        <div className="flex items-center gap-2 mb-6">
          <div className="p-1.5 bg-blue-100 rounded-lg">
            <ShoppingBag className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
            <p className="text-gray-600">{cartItems.length} items in your cart</p>
          </div>
        </div>

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border p-8 text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <ShoppingBag className="w-6 h-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Your cart is empty</h3>
            <p className="text-gray-500">Add some items to get started!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-all duration-200 overflow-hidden"
              >
                <div
                  className="p-4 flex gap-3 items-start cursor-pointer"
                  onClick={() => router.push(`/viewDetails?_id=${item.id}`)}
                >
                  <div className="flex-shrink-0">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(item.id)}
                      onClick={(e) => e.stopPropagation()}
                      onChange={() => toggleSelect(item.id)}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                    />
                  </div>

                  <div className="flex-shrink-0">
                    <img
                      src={item.images?.[0] || "/placeholder.svg"}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg border"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold text-gray-900 mb-1">{item.title}</h3>

                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-gray-400 line-through text-sm">Rs.{item.originalPrice}</span>
                      <span className="text-green-600 font-bold text-base">Rs.{item.discountedPrice}</span>
                      <span className="text-xs bg-green-100 text-green-800 px-1.5 py-0.5 rounded-full">
                        Save Rs.{item.originalPrice - item.discountedPrice}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600 font-medium">Quantity:</span>
                      <div className="flex items-center bg-gray-100 rounded-lg">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            decreaseQty(item.id)
                          }}
                          className="p-1.5 hover:bg-gray-200 rounded-l-lg transition-colors"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-3 py-1.5 font-semibold min-w-[2.5rem] text-center">{item.quantity}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            increaseQty(item.id)
                          }}
                          className="p-1.5 hover:bg-gray-200 rounded-r-lg transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex-shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        removeItem(item.id)
                      }}
                      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <div className="bg-white rounded-xl shadow-sm border p-4 mt-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-semibold text-gray-900">Order Summary</h3>
                  <p className="text-sm text-gray-600">{selectedIds.length} items selected</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                  <p className="text-xl font-bold text-gray-900">
                    Rs.
                    {cartItems
                      .filter((item) => selectedIds.includes(item.id))
                      .reduce((total, item) => total + item.discountedPrice * item.quantity, 0)}
                  </p>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={selectedIds.length === 0}
                className="w-full bg-blue-600 text-white py-2.5 px-4 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {selectedIds.length === 0
                  ? "Select items to checkout"
                  : `Proceed to Checkout (${selectedIds.length} items)`}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
