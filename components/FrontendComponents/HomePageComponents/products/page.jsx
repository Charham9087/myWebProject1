"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export default function ProductsGridPage() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        async function fetchProducts() {
            const res = await fetch('/api/Frontend/homepage');
            const data = await res.json();
            console.log(data);
            setProducts(data);
        }
        fetchProducts();
    }, [])

    return (
        <div className="max-w-7xl mx-auto p-4">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4">🛒 Explore Our Products</h1>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {products.map((products) => (
                    <div
                        key={products._id}
                        className="bg-white rounded-xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-transform duration-200 overflow-hidden flex flex-col"
                    >
                        <img
                            src={products.images?.[0] || "https://via.placeholder.com/300x200"}
                            alt={products.name}
                            className="w-full h-36 sm:h-40 md:h-44 object-cover"
                        />
                        <div className="p-3 flex flex-col flex-grow">
                            <h2 className="text-sm sm:text-base font-semibold text-gray-800">{products.name}</h2>
                            <p className="text-green-600 text-xs sm:text-sm font-bold">Rs. {products.discountedPrice}</p>
                            <p className="line-through text-gray-400 text-xs">Rs. {products.originalPrice}</p>
                            <p className="text-gray-500 text-xs sm:text-sm line-clamp-2 flex-grow">{products.title}</p>

                            <div className="flex gap-2 mt-2">
                                <Button className="flex-1 bg-blue-600 text-white hover:bg-blue-700 text-xs sm:text-sm">
                                    Buy
                                </Button>
                                <Button className="flex-1 bg-gray-200 text-gray-800 hover:bg-gray-300 text-xs sm:text-sm">
                                    Add
                                </Button>
                            </div>

                            {/* ✅ View button neeche full width */}
                            <Button 
                                className="mt-2 w-full bg-gray-100 text-gray-800 hover:bg-gray-200 text-xs sm:text-sm"
                                // onClick={() => router.push(`/products/${products._id}`)} // aise use kar sakte ho
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
