"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function MostSellingPage() {
    const [mostSellingProducts, setMostSellingProducts] = useState([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [itemsPerView, setItemsPerView] = useState(1)

    // ✅ Data fetch aap already kar chuke ho, bas mount pe call karna hai
    useEffect(() => {
        async function fetchMostSellingProducts() {
            // yeh wala fetch aapne apne backend se set kiya hai
            const res = await fetch("/api/Frontend/most-selling") 
            const data = await res.json()
            setMostSellingProducts(data)
        }
        fetchMostSellingProducts()
    }, [])

    // ✅ Responsive items per view
    useEffect(() => {
        const updateItemsPerView = () => {
            if (window.innerWidth >= 1280) setItemsPerView(4)
            else if (window.innerWidth >= 1024) setItemsPerView(3)
            else if (window.innerWidth >= 768) setItemsPerView(2)
            else setItemsPerView(1)
        }
        updateItemsPerView()
        window.addEventListener("resize", updateItemsPerView)
        return () => window.removeEventListener("resize", updateItemsPerView)
    }, [])

    const nextSlide = () => {
        const maxIndex = Math.max(0, mostSellingProducts.length - itemsPerView)
        setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1))
    }

    const prevSlide = () => {
        const maxIndex = Math.max(0, mostSellingProducts.length - itemsPerView)
        setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1))
    }

    const handleViewDetails = (id) => {
        window.location.href = `/viewDetails?_id=${id}`
    }

    const handleAddToCart = (product) => {
        const existingCart = JSON.parse(localStorage.getItem("cartItems")) || []
        const existingItem = existingCart.find((item) => item._id === product._id)

        let updatedCart
        if (existingItem) {
            updatedCart = existingCart.map((item) =>
                item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item,
            )
        } else {
            updatedCart = [...existingCart, { ...product, quantity: 1 }]
        }

        localStorage.setItem("cartItems", JSON.stringify(updatedCart))
        alert("Added to cart successfully!")
    }
        const handleBuyNow = (product) => {
        window.location.href = `/checkoutPage?_id=${product._id}`
    }

    return (
        <div className="relative w-full max-w-7xl mx-auto p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold">Most Selling 🔥</h2>
                    <p className="text-muted-foreground">Our top selling premium watches</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={prevSlide}>
                        <ChevronLeft className="w-5 h-5" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={nextSlide}>
                        <ChevronRight className="w-5 h-5" />
                    </Button>
                </div>
            </div>

            {/* Carousel */}
            <div className="overflow-hidden rounded-lg">
                <div
                    className="flex transition-transform duration-500 ease-in-out gap-4"
                    style={{ transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)` }}
                >
                    {mostSellingProducts.map((product) => (
                        <div key={product._id} className="flex-shrink-0 px-2" style={{ width: `${100 / itemsPerView}%` }}>
                            <Card
                                onClick={() => handleViewDetails(product._id)}
                                className="group h-full overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer"
                            >
                                <CardContent className="flex flex-col h-full p-0">
                                    <div className="relative bg-gray-50 dark:bg-gray-900">
                                        <div className="aspect-[4/3] flex items-center justify-center">
                                            <img
                                                src={product.images?.[0] || "/placeholder.svg"}
                                                alt={product.title}
                                                className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-700"
                                            />
                                        </div>
                                        {product.originalPrice > product.discountedPrice && (
                                            <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                                {Math.round(((product.originalPrice - product.discountedPrice) / product.originalPrice) * 100)}% OFF
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex flex-col flex-grow p-4 space-y-3">
                                        <h3 className="font-semibold text-lg leading-tight line-clamp-2">
                                            {product.title}
                                        </h3>

                                        {/* Pricing */}
                                        <div className="flex items-center gap-2">
                                            <span className="text-xl font-bold text-green-600">
                                                Rs.{product.discountedPrice}
                                            </span>
                                            {product.originalPrice > product.discountedPrice && (
                                                <span className="text-sm text-muted-foreground line-through">
                                                    Rs.{product.originalPrice}
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex flex-col gap-2 mt-auto pt-2">
                                            <Button className="w-full" onClick={() => handleBuyNow(product)}>
                                                <ShoppingBag className="w-4 h-4 mr-2" />
                                                Buy Now
                                            </Button>
                                            <Button variant="outline" className="w-full" onClick={() => handleAddToCart(product)}>
                                                Add to Cart
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    ))}
                </div>
            </div>

            {/* Dots indicator */}
            <div className="flex justify-center gap-2 mt-6">
                {Array.from({ length: Math.max(1, mostSellingProducts.length - itemsPerView + 1) }).map((_, index) => (
                    <button
                        key={index}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                            index === currentIndex ? "bg-primary scale-125" : "bg-muted-foreground/30"
                        }`}
                        onClick={() => setCurrentIndex(index)}
                    />
                ))}
            </div>
        </div>
    )
}
