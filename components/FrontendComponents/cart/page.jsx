"use client";

import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SimpleCart() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    const syncCart = () => {
      const cart = localStorage.getItem("cartItems");
      if (cart) setCartItems(JSON.parse(cart));
    };
    window.addEventListener("storage", syncCart);
    const interval = setInterval(syncCart, 1000);
    syncCart(); // initial load
    return () => {
      window.removeEventListener("storage", syncCart);
      clearInterval(interval);
    };
  }, []);

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  const removeItem = (id) => {
    setCartItems((prevItems) => {
      const updatedCart = prevItems.filter((item) => item.id !== id);
      localStorage.setItem("cartItems", JSON.stringify(updatedCart));
      return updatedCart;
    });
    setSelectedIds((prev) => prev.filter((itemId) => itemId !== id));
  };

  const increaseQty = (id) => {
    setCartItems((prevItems) => {
      const updatedCart = prevItems.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      );
      localStorage.setItem("cartItems", JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  const decreaseQty = (id) => {
    setCartItems((prevItems) => {
      const updatedCart = prevItems.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      );
      localStorage.setItem("cartItems", JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  const handleCheckout = () => {
    if (selectedIds.length === 0) {
      alert("Please select at least one item to checkout!");
      return;
    }

    const selectedItems = cartItems.filter((item) =>
      selectedIds.includes(item.id)
    );

    const idsParam = selectedItems.map((item) => item.id).join(",");
    const qtyParam = selectedItems.map((item) => item.quantity).join(",");

    router.push(`/checkoutPage?_id=${idsParam}&quantity=${qtyParam}`);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">
        Shopping Cart ({cartItems.length})
      </h1>

      {cartItems.length === 0 ? (
        <p className="text-gray-500">Your cart is empty</p>
      ) : (
        <div>
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="border rounded p-4 mb-4 flex gap-4 items-start cursor-pointer hover:bg-gray-50 transition"
              onClick={() => router.push(`/viewDetails?_id=${item.id}`)}
            >
              <input
                type="checkbox"
                checked={selectedIds.includes(item.id)}
                onClick={(e) => e.stopPropagation()}
                onChange={() => toggleSelect(item.id)}
                className="mt-1"
              />
              <img
                src={item.images?.[0] || "/placeholder.svg"}
                alt={item.name}
                className="w-20 h-20 object-cover rounded"
                onClick={(e) => e.stopPropagation()}
              />
              <div className="flex-1">
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-gray-600 text-sm" data-limit="20">{item.description}</p>

                <div className="flex gap-2 mt-2 items-center">
                  <span className="text-gray-400 line-through">
                    Rs.{item.originalPrice}
                  </span>
                  <span className="text-green-600 font-bold">
                    Rs.{item.discountedPrice}
                  </span>
                  <span className="text-sm">Qty: {item.quantity}</span>
                </div>

                <div className="flex gap-2 mt-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      decreaseQty(item.id);
                    }}
                    className="bg-gray-200 px-2 rounded hover:bg-gray-300"
                  >
                    -
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      increaseQty(item.id);
                    }}
                    className="bg-gray-200 px-2 rounded hover:bg-gray-300"
                  >
                    +
                  </button>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeItem(item.id);
                }}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}

          <div className="border-t pt-4">
            <div className="text-right mb-4">
              <p className="text-lg font-bold">
                Total: Rs.
                {cartItems.reduce(
                  (total, item) => total + item.discountedPrice * item.quantity,
                  0
                )}
              </p>
            </div>
            <button
              onClick={handleCheckout}
              className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
            >
              Checkout ({selectedIds.length} selected)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
