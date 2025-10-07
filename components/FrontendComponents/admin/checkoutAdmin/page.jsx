"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import fetchProducts from "@/server/fetch_products-AdminCheckout";
import { saveCheckout } from "@/server/checkout";

export default function CheckoutPage() {
  const router = useRouter();

  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [form, setForm] = useState({
    name: "",
    address: "",
    city: "",
    postal: "",
    email: "",
    phone: "",
    comments: "",
  });

  const [popup, setPopup] = useState(false);
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);

  // ✅ Fetch products
  useEffect(() => {
    async function loadProducts() {
      try {
        const fetched = await fetchProducts();
        setProducts(fetched || []);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    }
    loadProducts();
  }, []);

  // ✅ Generate Order ID (browser-safe)
  const generateOrderID = () => "ORD-" + Math.floor(Math.random() * 1e9);

  // ✅ Toggle product selection
  const toggleProduct = (product) => {
    setSelectedProducts((prev) => {
      const exists = prev.find((p) => p._id === product._id);
      if (exists) {
        return prev.filter((p) => p._id !== product._id);
      } else {
        return [...prev, { ...product, quantity: 1, manualPrice: "" }];
      }
    });
  };

  // ✅ Update quantity
  const updateQuantity = (id, delta) => {
    setSelectedProducts((prev) =>
      prev.map((p) =>
        p._id === id ? { ...p, quantity: Math.max(1, p.quantity + delta) } : p
      )
    );
  };

  // ✅ Manual price input
  const handleManualPriceChange = (id, value) => {
    const numericValue = value.replace(/\D/g, ""); // only digits
    setSelectedProducts((prev) =>
      prev.map((p) => (p._id === id ? { ...p, manualPrice: numericValue } : p))
    );
  };

  // ✅ Total price
  const total = selectedProducts.reduce(
    (sum, p) => sum + (Number(p.manualPrice) || 0) * (p.quantity || 1),
    0
  );

  // ✅ Form handler
  const handleChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  // ✅ Place Order
  const placeOrder = async () => {
    const newOrderID = generateOrderID();

    const { name, address, city, email, phone } = form;
    const isEmpty = [name, address, city, email, phone].some(
      (v) => v.trim() === ""
    );
    if (isEmpty) return toast.error("Please fill all required fields!");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email))
      return toast.error("Please enter a valid email address!");

    const phoneRegex = /^03\d{9}$/;
    if (!phoneRegex.test(phone))
      return toast.error("Please enter a valid Pakistani phone number!");

    if (selectedProducts.length === 0)
      return toast.error("Please select at least one product!");

    // ✅ Data to send to backend
    const orderData = {
      orderID: newOrderID,
      paymentMethod,
      total,
      products: selectedProducts.map((p) => ({
        id: p._id,
        name: p.name,
        price: Number(p.manualPrice) || 0,
        quantity: p.quantity,
      })),
      ...form,
      date: new Date().toISOString(),
    };

    try {
      await saveCheckout(orderData);
      toast.success("Order placed successfully!");
      router.push("/");
    } catch (err) {
      console.error("Order error:", err);
      toast.error("Failed to place order!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-6 px-4 relative">
      {/* ✅ Product Popup */}
      {popup && (
        <>
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={() => setPopup(false)}
          />
          <div className="fixed inset-0 flex justify-center items-center z-50">
            <div className="bg-white w-11/12 md:w-2/3 lg:w-1/2 rounded-2xl p-6 shadow-lg overflow-y-auto max-h-[80vh]">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 text-center">
                Select Products
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {products.length > 0 ? (
                  products.map((product) => {
                    const selected = selectedProducts.find(
                      (p) => p._id === product._id
                    );
                    return (
                      <div
                        key={product._id}
                        onClick={() => toggleProduct(product)}
                        className={`p-4 rounded-xl border cursor-pointer transition relative ${
                          selected
                            ? "border-blue-600 bg-blue-50"
                            : "border-gray-200 hover:border-blue-400"
                        }`}
                      >
                        <img
                          src={product.images?.[0] || "/placeholder.png"}
                          alt={product.name}
                          className="w-full h-32 object-cover rounded-md mb-2"
                        />
                        <h3 className="font-medium text-gray-800 truncate">
                          {product.name}
                        </h3>

                        {/* ✅ Quantity & Manual Price */}
                        {selected && (
                          <div
                            onClick={(e) => e.stopPropagation()}
                            className="mt-2 space-y-2"
                          >
                            <input
                              type="text"
                              value={selected.manualPrice}
                              onChange={(e) =>
                                handleManualPriceChange(
                                  product._id,
                                  e.target.value
                                )
                              }
                              placeholder="Enter Price (Rs)"
                              className="w-full border rounded-md p-1 text-sm"
                            />
                            <div className="flex items-center justify-center gap-3 mt-1">
                              <button
                                onClick={() => updateQuantity(product._id, -1)}
                                className="px-3 py-1 bg-gray-200 rounded-md"
                              >
                                -
                              </button>
                              <span className="font-medium">
                                {selected.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(product._id, 1)}
                                className="px-3 py-1 bg-gray-200 rounded-md"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <p className="text-center text-gray-500 col-span-2">
                    No products available.
                  </p>
                )}
              </div>

              <div className="mt-6 text-right">
                <button
                  onClick={() => setPopup(false)}
                  className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ✅ Checkout Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Checkout</h1>
        <p className="text-slate-600">
          Fill in your details and confirm your order
        </p>
      </div>

      {/* ✅ Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {/* 🧾 Form */}
        <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
          <h2 className="text-xl font-semibold text-slate-800 mb-2">
            Shipping Details
          </h2>

          {["name", "phone", "email", "address", "city", "postal", "comments"].map(
            (field) => (
              <input
                key={field}
                id={field}
                type={field === "email" ? "email" : "text"}
                placeholder={
                  field === "postal"
                    ? "Postal Code (optional)"
                    : field === "comments"
                    ? "Comments (optional)"
                    : field === "phone"
                    ? "03XXXXXXXXX"
                    : field === "email"
                    ? "you@example.com"
                    : field.charAt(0).toUpperCase() + field.slice(1)
                }
                value={form[field]}
                onChange={handleChange}
                className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            )
          )}
        </div>

        {/* 🛒 Summary */}
        <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-slate-800">
              Order Summary
            </h2>
            <button
              onClick={() => setPopup(true)}
              className="text-blue-600 hover:underline text-sm font-medium"
            >
              Manage Order
            </button>
          </div>

          {selectedProducts.length === 0 ? (
            <p className="text-center text-red-500 bg-red-50 p-3 rounded-md">
              ⚠️ No products selected
            </p>
          ) : (
            <div className="space-y-2">
              {selectedProducts.map((item) => (
                <div
                  key={item._id}
                  className="flex justify-between items-center"
                >
                  <p className="text-slate-700">
                    {item.name} × {item.quantity}
                  </p>
                  <p className="font-semibold text-slate-900">
                    Rs{" "}
                    {(
                      (Number(item.manualPrice) || 0) * item.quantity
                    ).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          )}

          <div className="border-t border-gray-200 pt-3 flex justify-between">
            <span className="font-bold text-slate-800">Total:</span>
            <span className="font-bold text-blue-600">
              Rs {total.toFixed(2)}
            </span>
          </div>

          <button
            onClick={placeOrder}
            className="w-full mt-4 bg-gray-900 text-white py-2 rounded-md hover:bg-gray-800"
          >
            🛒 Place Order - Rs {total.toFixed(2)}
          </button>
        </div>
      </div>
    </div>
  );
}
