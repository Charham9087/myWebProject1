"use client"

import { useState, useEffect } from "react"
import { ShoppingBag, Grid, List, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function ProductsGrid({ categoryName = "All Products" }) {
    const [products, setProducts] = useState([])
    const [cartItems, setCartItems] = useState([])
    const [sortBy, setSortBy] = useState("featured")
    const [viewMode, setViewMode] = useState("grid")
    const [filteredProducts, setFilteredProducts] = useState([])
    const [loading, setLoading] = useState(true)

    // ✅ Pagination states
    const [currentPage, setCurrentPage] = useState(1)
    const [productsPerPage, setProductsPerPage] = useState(6)

    // ✅ Load existing cart
    useEffect(() => {
        const existingCart = JSON.parse(localStorage.getItem("cartItems")) || []
        setCartItems(existingCart)
    }, [])

    // ✅ Fetch products
    useEffect(() => {
        async function fetchProducts() {
            try {
                setLoading(true)
                const res = await fetch("/api/Frontend/homepage")
                const data = await res.json()
                setProducts(data)
            } catch (error) {
                console.error("Error fetching products:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchProducts()
    }, [])

    // ✅ Sorting
    useEffect(() => {
        const sorted = [...products]

        switch (sortBy) {
            case "price-low":
                sorted.sort((a, b) => a.discountedPrice - b.discountedPrice)
                break
            case "price-high":
                sorted.sort((a, b) => b.discountedPrice - a.discountedPrice)
                break
            case "newest":
                break
            default:
                break
        }

        setFilteredProducts(sorted)
        setCurrentPage(1) // ✅ Reset to first page when sorting changes
    }, [products, sortBy])

    // ✅ Handle responsive products per page
    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth
            if (width < 640) {
                setProductsPerPage(6) // Mobile
            } else if (width < 1024) {
                setProductsPerPage(9) // Tablet
            } else {
                setProductsPerPage(12) // Desktop
            }
        }

        handleResize()
        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize)
    }, [])

    // ✅ Pagination calculation
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage)
    const startIndex = (currentPage - 1) * productsPerPage
    const endIndex = startIndex + productsPerPage
    const currentProducts = filteredProducts.slice(startIndex, endIndex)

    const handlePageChange = (page) => {
        setCurrentPage(page)
        window.scrollTo({ top: 0, behavior: "smooth" })
    }

    const handlePrevPage = () => {
        if (currentPage > 1) {
            handlePageChange(currentPage - 1)
        }
    }

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            handlePageChange(currentPage + 1)
        }
    }

    // ✅ View Details
    const handleViewDetails = (_id) => {
        window.location.href = `/viewDetails?_id=${_id}`
    }

    // ✅ Add to Cart
    const handleAddToCart = (product) => {
        const existingCart = JSON.parse(localStorage.getItem("cartItems")) || []
        const existingItem = existingCart.find((item) => item._id === product._id)

        let updatedCart
        if (existingItem) {
            updatedCart = existingCart.map((item) =>
                item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item,
            )
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
            ]
        }

        setCartItems(updatedCart)
        localStorage.setItem("cartItems", JSON.stringify(updatedCart))
        alert("Added to cart successfully!")
    }

    // ✅ Buy Now → Redirect to checkoutPage
    const handleBuyNow = (product) => {
        window.location.href = `/checkoutPage?_id=${product._id}`
    }

    return (
        <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 py-4 sm:py-8">
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-4">
                <div>
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-2">{categoryName}</h1>
                    <p className="text-sm text-muted-foreground">
                        {loading
                            ? "Loading products..."
                            : `Showing ${startIndex + 1}-${Math.min(endIndex, filteredProducts.length)} of ${filteredProducts.length} products`}
                    </p>
                </div>

                {/* Controls */}
                <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                    <div className="flex items-center gap-2">
                        <Button
                            variant={viewMode === "grid" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setViewMode("grid")}
                            className="px-3"
                        >
                            <Grid className="w-4 h-4" />
                        </Button>
                        <Button
                            variant={viewMode === "list" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setViewMode("list")}
                            className="px-3"
                        >
                            <List className="w-4 h-4" />
                        </Button>
                    </div>

                    <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="w-40 sm:w-48">
                            <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="featured">Featured</SelectItem>
                            <SelectItem value="newest">Newest</SelectItem>
                            <SelectItem value="price-low">Price: Low to High</SelectItem>
                            <SelectItem value="price-high">Price: High to Low</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Products Grid */}
            <div
                className={`grid gap-2 sm:gap-4 ${viewMode === "grid" ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5" : "grid-cols-1"
                    }`}
            >
                {currentProducts.map((product) => (
                    <Card
                        key={product._id}
                        className={`group overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-white dark:bg-card border border-gray-200 dark:border-border shadow-sm ${viewMode === "list" ? "flex flex-row" : "flex flex-col"
                            }`}
                    >
                        <CardContent className={`p-0 ${viewMode === "list" ? "flex flex-row w-full" : "flex flex-col h-full"}`}>
                            {/* Image */}
                            <div
                                className={`relative overflow-hidden bg-white ${viewMode === "list" ? "w-32 sm:w-48 flex-shrink-0" : "w-full"
                                    }`}
                                onClick={() => handleViewDetails(product._id)}
                            >
                                <div className="relative bg-white flex items-center justify-center aspect-square">
                                    <img
                                        src={product.images[0] || "/placeholder.svg"}
                                        alt={product.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        loading="lazy"
                                        onError={(e) => {
                                            e.target.src = "/product-placeholder.jpg"
                                        }}
                                    />
                                </div>
                                {product.originalPrice > product.discountedPrice && (
                                    <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded shadow-md">
                                        {`${Math.round(((product.originalPrice - product.discountedPrice) / product.originalPrice) * 100)}% OFF`}
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="flex flex-col p-2 sm:p-3 space-y-2 flex-grow">
                                <h3
                                    className="font-medium text-xs sm:text-sm leading-tight text-gray-900 dark:text-foreground line-clamp-2 cursor-pointer"
                                    onClick={() => handleViewDetails(product._id)}
                                >
                                    {product.title}
                                </h3>

                                <div className="flex flex-col gap-0.5">
                                    {product.originalPrice > product.discountedPrice && (
                                        <span className="text-xs text-gray-500 line-through">
                                            Rs.{product.originalPrice.toLocaleString()}
                                        </span>
                                    )}
                                    <span className="text-sm sm:text-base font-semibold text-gray-900 dark:text-foreground">
                                        Rs.{product.discountedPrice.toLocaleString()}
                                    </span>
                                </div>

                                {/* Buttons */}
                                <div className={`flex gap-1 mt-auto pt-1 ${viewMode === "list" ? "flex-row" : "flex-col sm:flex-row"}`}>
                                    <Button
                                        size="sm"
                                        className="bg-black hover:bg-gray-800 text-white font-medium flex-1 text-xs py-1.5"
                                        onClick={() => handleBuyNow(product)}
                                    >
                                        <ShoppingBag className="w-3 h-3 mr-1" />
                                        Buy Now
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="border hover:bg-gray-50 dark:hover:bg-muted/50 font-medium flex-1 text-xs py-1.5"
                                        onClick={() => handleAddToCart(product)}
                                    >
                                        Add to Cart
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                    {/* Page Info */}
                    <div className="text-sm text-muted-foreground">
                        Page {currentPage} of {totalPages}
                    </div>

                    {/* Pagination Buttons */}
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handlePrevPage}
                            disabled={currentPage === 1}
                            className="flex items-center gap-1 bg-transparent"
                        >
                            <ChevronLeft className="w-4 h-4" />
                            <span className="hidden sm:inline">Previous</span>
                        </Button>

                        {/* Page Numbers */}
                        <div className="flex items-center gap-1">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                                const showPage =
                                    page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)

                                if (!showPage) {
                                    if (page === currentPage - 2 || page === currentPage + 2) {
                                        return (
                                            <span key={page} className="px-2 text-muted-foreground">
                                                ...
                                            </span>
                                        )
                                    }
                                    return null
                                }

                                return (
                                    <Button
                                        key={page}
                                        variant={currentPage === page ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => handlePageChange(page)}
                                        className="w-8 h-8 p-0"
                                    >
                                        {page}
                                    </Button>
                                )
                            })}
                        </div>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleNextPage}
                            disabled={currentPage === totalPages}
                            className="flex items-center gap-1 bg-transparent"
                        >
                            <span className="hidden sm:inline">Next</span>
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            )}

            {/* Results Summary */}
            {!loading && (
                <div className="mt-6 sm:mt-8 text-center text-xs sm:text-sm text-muted-foreground border-t pt-4 sm:pt-6">
                    {filteredProducts.length === 0
                        ? "No products found"
                        : `Showing ${startIndex + 1}-${Math.min(endIndex, filteredProducts.length)} of ${filteredProducts.length} products`}
                </div>
            )}
        </div>
    )
}
