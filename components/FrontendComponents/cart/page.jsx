"use client";

import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import toast from "react-hot-toast";

export default function SimpleCart() {
    const [cartItems, setCartItems] = useState([]);

    // Load cart items from localStorage on mount & keep synced
    useEffect(() => {
        const syncCart = () => {
            const cart = localStorage.getItem("cartItems");
            if (cart) {
                setCartItems(JSON.parse(cart));
            }
        };

        window.addEventListener("storage", syncCart);
        const interval = setInterval(syncCart, 1000);

        return () => {
            window.removeEventListener("storage", syncCart);
            clearInterval(interval);
        };
    }, []);

    // Add to cart handler (keep as is)
    const addToCart = (product) => {
        const existingItem = cartItems.find((item) => item._id === product._id);
        let updatedCart;
        if (existingItem) {
            updatedCart = cartItems.map((item) =>
                item._id === product._id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            );
        } else {
            updatedCart = [
                ...cartItems,
                {
                    name: product.name,
                    discountedPrice: product.discountedPrice,
                    originalPrice: product.originalPrice,
                    images: product.images,
                    _id: product._id,
                    id: product._id,
                    title: product.title,
                    categories: product.categories,
                    description: product.description,
                    quantity: 1,
                    catalogues: product.catalogues
                }
            ];
        }
        setCartItems(updatedCart);
        localStorage.setItem("cartItems", JSON.stringify(updatedCart));
        toast.success("Added to cart successfully", { position: "top-center" });
    };

    // Remove an item by id
    const removeItem = (id) => {
        const updatedCart = cartItems.filter((item) => item.id !== id);
        setCartItems(updatedCart);
        localStorage.setItem("cartItems", JSON.stringify(updatedCart));
    };

    // Increase quantity
    const increaseQty = (id) => {
        const updatedCart = cartItems.map((item) =>
            item.id === id ? { ...item, quantity: item.quantity + 1 } : item
        );
        setCartItems(updatedCart);
        localStorage.setItem("cartItems", JSON.stringify(updatedCart));
    };

    // Decrease quantity (minimum 1)
    const decreaseQty = (id) => {
        const updatedCart = cartItems.map((item) =>
            item.id === id && item.quantity > 1
                ? { ...item, quantity: item.quantity - 1 }
                : item
        );
        setCartItems(updatedCart);
        localStorage.setItem("cartItems", JSON.stringify(updatedCart));
    };

    // Checkout handler
    const checkout = () => {
        if (cartItems.length === 0) {
            alert("Cart is empty!");
            return;
        }
        alert(`Checkout successful! Total items: ${cartItems.length}`);
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
                            className="border rounded p-4 mb-4 flex gap-4"
                        >
                            <img
                                src={item.images?.[0] || "/placeholder.svg"}
                                alt={item.name}
                                className="w-20 h-20 object-cover rounded"
                            />
                            <div className="flex-1">
                                <h3 className="font-semibold">{item.name}</h3>
                                <p className="text-gray-600 text-sm">{item.description}</p>

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
                                        onClick={() => decreaseQty(item.id)}
                                        className="bg-gray-200 px-2 rounded hover:bg-gray-300"
                                    >-</button>
                                    <button
                                        onClick={() => increaseQty(item.id)}
                                        className="bg-gray-200 px-2 rounded hover:bg-gray-300"
                                    >+</button>
                                </div>
                            </div>
                            <button
                                onClick={() => removeItem(item.id)}
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
                                    (total, item) =>
                                        total + item.discountedPrice * item.quantity,
                                    0
                                )}
                            </p>
                        </div>
                        <button
                            onClick={checkout}
                            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
                        >
                            Checkout ({cartItems.length} items)
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
