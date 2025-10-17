"use client";

import Image from "next/image";
import { useState, useEffect, useMemo } from "react";
import { ShoppingBag, Grid, List, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function ProductsGrid({ categoryName = "All Products" }) {
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [sortBy, setSortBy] = useState("featured");
  const [viewMode, setViewMode] = useState("grid");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(6);

  // ✅ Load cart from localStorage
  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cartItems")) || [];
    setCartItems(cart);
  }, []);

  // ✅ Fetch products with caching
  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const res = await fetch("/api/Frontend/homepage", { next: { revalidate: 3600 } });
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  // ✅ Sort products
  const sortedProducts = useMemo(() => {
    const sorted = [...products];
    if (sortBy === "price-low") sorted.sort((a, b) => a.discountedPrice - b.discountedPrice);
    else if (sortBy === "price-high") sorted.sort((a, b) => b.discountedPrice - a.discountedPrice);
    return sorted;
  }, [products, sortBy]);

  // ✅ Responsive grid count
  useEffect(() => {
    const updatePerPage = () => {
      const width = window.innerWidth;
      setProductsPerPage(width < 640 ? 6 : width < 1024 ? 9 : 12);
    };
    updatePerPage();
    window.addEventListener("resize", updatePerPage);
    return () => window.removeEventListener("resize", updatePerPage);
  }, []);

  // ✅ Pagination
  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);
  const start = (currentPage - 1) * productsPerPage;
  const end = start + productsPerPage;
  const currentProducts = sortedProducts.slice(start, end);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ✅ Fire safe Pixel Event
  const trackPixelEvent = (eventName, data = {}) => {
    if (typeof fbq === "function") {
      fbq("track", eventName, data);
    }
  };

  // ✅ Add to Cart
  const handleAddToCart = (product) => {
    const existing = JSON.parse(localStorage.getItem("cartItems")) || [];
    const found = existing.find((item) => item._id === product._id);
    let updated;
    if (found) {
      updated = existing.map((i) => (i._id === product._id ? { ...i, quantity: i.quantity + 1 } : i));
    } else {
      updated = [...existing, { ...product, quantity: 1 }];
    }
    setCartItems(updated);
    localStorage.setItem("cartItems", JSON.stringify(updated));

    // 🔥 Facebook Pixel Event - AddToCart
    trackPixelEvent("AddToCart", {
      content_name: product.title,
      content_ids: [product._id],
      content_type: "product",
      value: product.discountedPrice,
      currency: "PKR",
    });

    alert("Added to cart successfully!");
  };

  // ✅ Buy Now
  const handleBuyNow = (product) => {
    // 🔥 Facebook Pixel Event - InitiateCheckout
    trackPixelEvent("InitiateCheckout", {
      content_name: product.title,
      content_ids: [product._id],
      content_type: "product",
      value: product.discountedPrice,
      currency: "PKR",
    });

    window.location.href = `/checkoutPage?_id=${product._id}`;
  };

  // ✅ View Details
  const handleViewDetails = (_id) => {
    const product = products.find((p) => p._id === _id);

    // 🔥 Facebook Pixel Event - ViewContent
    if (product) {
      trackPixelEvent("ViewContent", {
        content_name: product.title,
        content_ids: [product._id],
        content_type: "product",
        value: product.discountedPrice,
        currency: "PKR",
      });
    }

    window.location.href = `/viewDetails?_id=${_id}`;
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 py-4 sm:py-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-2">
            {categoryName}
          </h1>
          <p className="text-sm text-muted-foreground">
            {loading
              ? "Loading products..."
              : `Showing ${start + 1}-${Math.min(end, sortedProducts.length)} of ${sortedProducts.length} products`}
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
        className={`grid gap-2 sm:gap-4 ${
          viewMode === "grid"
            ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
            : "grid-cols-1"
        }`}
      >
        {currentProducts.map((product, index) => (
          <Card
            key={product._id}
            className={`group overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-white dark:bg-card border border-gray-200 dark:border-border shadow-sm ${
              viewMode === "list" ? "flex flex-row" : "flex flex-col"
            }`}
          >
            <CardContent
              className={`p-0 ${
                viewMode === "list" ? "flex flex-row w-full" : "flex flex-col h-full"
              }`}
            >
              {/* ✅ Optimized Image */}
              <div
                className={`relative overflow-hidden bg-white ${
                  viewMode === "list" ? "w-32 sm:w-48 flex-shrink-0" : "w-full"
                }`}
                onClick={() => handleViewDetails(product._id)}
              >
                <div className="relative bg-white flex items-center justify-center aspect-square">
                  <Image
                    src={product.images[0] || "/placeholder.svg"}
                    alt={product.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    loading={index < 4 ? "eager" : "lazy"}
                    priority={index < 4}
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
                    onError={(e) => (e.target.src = "/product-placeholder.jpg")}
                  />
                </div>

                {product.originalPrice > product.discountedPrice && (
                  <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded shadow-md">
                    {`${Math.round(
                      ((product.originalPrice - product.discountedPrice) / product.originalPrice) * 100
                    )}% OFF`}
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

                <div
                  className={`flex gap-1 mt-auto pt-1 ${
                    viewMode === "list" ? "flex-row" : "flex-col sm:flex-row"
                  }`}
                >
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex items-center gap-1 bg-transparent"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Previous</span>
            </Button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) =>
                Math.abs(page - currentPage) <= 1 || page === 1 || page === totalPages ? (
                  <Button
                    key={page}
                    variant={page === currentPage ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(page)}
                    className="w-8 h-8 p-0"
                  >
                    {page}
                  </Button>
                ) : (
                  Math.abs(page - currentPage) === 2 && (
                    <span key={page} className="px-2 text-muted-foreground">
                      ...
                    </span>
                  )
                )
              )}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1 bg-transparent"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
