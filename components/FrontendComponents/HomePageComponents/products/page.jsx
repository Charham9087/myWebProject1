"use client";

import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function ProductsGridPage() {
    const [products, setProducts] = useState([]);
    const [cartItems, setcartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const { data: session } = useSession();

    // Load existing cart
    useEffect(() => {
        const existingCart = JSON.parse(localStorage.getItem("cartItems")) || [];
        setcartItems(existingCart);
    }, []);

    // Fetch products
    useEffect(() => {
        async function fetchProducts() {
            try {
                setLoading(true);
                const res = await fetch("/api/Frontend/homepage");
                const data = await res.json();
                setProducts(data);
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchProducts();
    }, []);

    const handleViewDetails = (_id) => {
        router.push(`/viewDetails?_id=${_id}`);
    };

    const handleAddToCart = (product) => {
        const existingCart = JSON.parse(localStorage.getItem("cartItems")) || [];
        const existingItem = existingCart.find((item) => item._id === product._id);

        let updatedCart;
        if (existingItem) {
            updatedCart = existingCart.map((item) =>
                item._id === product._id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            );
        } else {
            updatedCart = [
                ...existingCart,
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
                    catalogues: product.catalogues,
                },
            ];
        }

        setcartItems(updatedCart);
        localStorage.setItem("cartItems", JSON.stringify(updatedCart));
        toast.success("Added to cart successfully", { position: "top-center" });
    };

    return (
        <div className="relative max-w-7xl mx-auto p-4">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4">
                🛒 Explore Our Products
            </h1>

            {/* ✅ Loader Overlay (sirf grid pe) */}
            {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 z-10 rounded-lg">
                    <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                    <p>
                        <span className="sr-only">Loading...</span>
                    </p>
                </div>
            )}

            {/* ✅ Responsive grid */}
            <div className="relative grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {products.map((product) => (
                    <div
                        key={product._id}
                        onClick={() => handleViewDetails(product._id)}
                        className="bg-white rounded-xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-transform duration-200 overflow-hidden flex flex-col cursor-pointer"
                    >
                        <img
                            src={product.images?.[0] || "https://via.placeholder.com/300x200"}
                            alt={product.title}
                            className="w-full h-36 sm:h-40 md:h-44 object-cover"
                        />
                        <div className="p-3 flex flex-col flex-grow">
                            <h2 className="text-sm sm:text-base font-semibold text-gray-800">
                                {product.title}
                            </h2>
                            <p className="text-green-600 text-xs sm:text-sm font-bold">
                                Rs. {product.discountedPrice}
                            </p>
                            <p className="line-through text-gray-400 text-xs">
                                Rs. {product.originalPrice}
                            </p>
                            {/* ✅ Buttons wrapper responsive */}
                            <div className="flex flex-col sm:flex-row sm:justify-between gap-2 mt-2 w-full">
                                <Button
                                    className="flex-1 bg-blue-600 text-white hover:bg-blue-700 text-xs sm:text-sm"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        router.push(`/checkoutPage?_id=${product._id}`);
                                    }}
                                >
                                    Buy Now
                                </Button>
                                <Button
                                    className="flex-1 bg-gray-200 text-gray-800 hover:bg-gray-300 text-xs sm:text-sm"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleAddToCart(product);
                                    }}
                                >
                                    Add To Cart
                                </Button>
                            </div>

                            <Button
                                className="mt-2 w-full bg-gray-100 text-gray-800 hover:bg-gray-200 text-xs sm:text-sm"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleViewDetails(product._id);
                                }}
                            >
                                View Details
                            </Button>

                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
