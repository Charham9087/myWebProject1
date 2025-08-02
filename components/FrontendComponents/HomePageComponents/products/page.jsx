"use client";

import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";


export default function ProductsGridPage() {
    const [products, setProducts] = useState([]);
    const [cartItems, setcartItems] = useState([]);
    const router = useRouter();

    // Load existing cart from localStorage on mount
    useEffect(() => {
        const existingCart = JSON.parse(localStorage.getItem('cartItems')) || [];
        setcartItems(existingCart);
    }, []);

    // Fetch products from API
    useEffect(() => {
        async function fetchProducts() {
            const res = await fetch('/api/Frontend/homepage');
            const data = await res.json();
            console.log(data);
            setProducts(data);
        }
        fetchProducts();
    }, []);

    const handleViewDetails = (_id) => {
        router.push(`/viewDetails?_id=${_id}`)

    }

    // Add to cart handler
    const handleAddToCart = (product) => {
        const existingCart = JSON.parse(localStorage.getItem('cartItems')) || [];
        const existingItem = existingCart.find(item => item._id === product._id);

        let updatedCart;
        if (existingItem) {
            updatedCart = existingCart.map(item =>
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
                    id: product._id, // 👈 keep id for deletion
                    title: product.title,
                    categories: product.categories,
                    description: product.description,
                    quantity: 1,
                    catalogues: product.catalogues
                }
            ];
        }

        setcartItems(updatedCart); // update local state
        localStorage.setItem('cartItems', JSON.stringify(updatedCart)); // save to storage
        toast.success('Added to cart successfully', { position: 'top-center' });
    };

    return (
        <div className="max-w-7xl mx-auto p-4">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4">
                🛒 Explore Our Products
            </h1>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {products.map((product) => (
                    <div
                        key={product._id}
                        onClick={() => handleViewDetails(product._id)}
                        className="bg-white rounded-xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-transform duration-200 overflow-hidden flex flex-col cursor-pointer"
                    >
                        <img
                            src={product.images?.[0] || "https://via.placeholder.com/300x200"}
                            alt={product.name}
                            className="w-full h-36 sm:h-40 md:h-44 object-cover"
                        />
                        <div className="p-3 flex flex-col flex-grow">
                            <h2 className="text-sm sm:text-base font-semibold text-gray-800">{product.name}</h2>
                            <p className="text-green-600 text-xs sm:text-sm font-bold">Rs. {product.discountedPrice}</p>
                            <p className="line-through text-gray-400 text-xs">Rs. {product.originalPrice}</p>
                            <p className="text-gray-500 text-xs sm:text-sm line-clamp-2 flex-grow">{product.title}</p>

                            <div className="flex gap-2 mt-2">
                                <Button
                                    className="flex-1 bg-blue-600 text-white hover:bg-blue-700 text-xs sm:text-sm"
                                    onClick={(e) => { e.stopPropagation(); /* your Buy action */ }}
                                >
                                    Buy
                                </Button>
                                <Button
                                    className="flex-1 bg-gray-200 text-gray-800 hover:bg-gray-300 text-xs sm:text-sm"
                                    onClick={(e) => { e.stopPropagation(); handleAddToCart(product); }}
                                >
                                    Add To Cart
                                </Button>
                            </div>

                            <Button
                                className="mt-2 w-full bg-gray-100 text-gray-800 hover:bg-gray-200 text-xs sm:text-sm"
                                onClick={(e) => { e.stopPropagation(); handleViewDetails(product._id); }}
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
