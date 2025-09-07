"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { GetCatalogueWithProducts } from "@/server/catalogue-functions";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Catalogues() {
  const [catalogueData, setCatalogueData] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [itemsPerView, setItemsPerView] = useState(1);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const carouselRef = useRef(null);
  const router = useRouter();

  const minSwipeDistance = 50;

  // ✅ Load cart from localStorage
  useEffect(() => {
    const existingCart = JSON.parse(localStorage.getItem("cartItems")) || [];
    setCartItems(existingCart);
  }, []);

  // ✅ Fetch catalogue with products from API
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const data = await GetCatalogueWithProducts();
        setCatalogueData(data);
      } catch (error) {
        console.error("Error fetching catalogues:", error);
      } finally {
        setTimeout(() => setLoading(false), 800);
      }
    }
    fetchData();
  }, []);

  // ✅ Add to cart with toast
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

    setCartItems(updatedCart);
    localStorage.setItem("cartItems", JSON.stringify(updatedCart));
    toast.success("Added to cart successfully", { position: "top-center" });
  };

  // ✅ View details with router push
  const handleViewDetails = (id) => {
    setLoading(true);
    setTimeout(() => {
      router.push(`/viewDetails?_id=${id}`);
    }, 800);
  };

  // ✅ Responsive items per view
  useEffect(() => {
    const updateItemsPerView = () => {
      if (window.innerWidth >= 1280) setItemsPerView(4);
      else if (window.innerWidth >= 1024) setItemsPerView(3);
      else if (window.innerWidth >= 768) setItemsPerView(2);
      else setItemsPerView(1);
    };

    updateItemsPerView();
    window.addEventListener("resize", updateItemsPerView);
    return () => window.removeEventListener("resize", updateItemsPerView);
  }, []);

  // ✅ Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const maxIndex = Math.max(
          0,
          catalogueData.flatMap((c) => c.products).length - itemsPerView
        );
        return prev >= maxIndex ? 0 : prev + 1;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, itemsPerView, catalogueData]);

  const nextSlide = () => {
    const totalProducts = catalogueData.flatMap((c) => c.products).length;
    const maxIndex = Math.max(0, totalProducts - itemsPerView);
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const prevSlide = () => {
    const totalProducts = catalogueData.flatMap((c) => c.products).length;
    const maxIndex = Math.max(0, totalProducts - itemsPerView);
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
    setIsAutoPlaying(false);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) nextSlide();
    else if (isRightSwipe) prevSlide();

    setTimeout(() => setIsAutoPlaying(true), 3000);
  };
    const handleBuyNow = (product) => {
        window.location.href = `/checkoutPage?_id=${product._id}`
    }
  return (
    <div className="relative max-w-7xl mx-auto p-4">
      <h1 className="text-xl text-center sm:text-2xl md:text-3xl font-bold mb-4">
        🛒 Explore Our Catalogues
      </h1>

      {/* 🔄 Fancy Loading Popup (imported from your first code) */}
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-2xl border border-gray-200 dark:border-gray-700 max-w-sm mx-4">
            <div className="flex flex-col items-center space-y-4">
              {/* Animated spinner with gradient */}
              <div className="relative">
                <div className="w-16 h-16 border-4 border-gray-200 dark:border-gray-600 rounded-full"></div>
                <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-blue-500 border-r-blue-500 rounded-full animate-spin"></div>
              </div>

              {/* Loading text with animation */}
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                  Loading Products
                </h3>
                <div className="flex items-center justify-center space-x-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full animate-pulse"></div>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                Please wait while we fetch the latest products...
              </p>
            </div>
          </div>
        </div>
      )}

      {catalogueData.map(
        (cat) =>
          cat.products &&
          cat.products.length > 0 && (
            <div key={cat.name} className="mb-12">
              <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-6">
                {cat.name}
              </h2>

              {/* Carousel */}
              <div
                ref={carouselRef}
                className="relative overflow-hidden rounded-lg"
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
              >
                <div
                  className="flex transition-transform duration-500 ease-in-out gap-4"
                  style={{
                    transform: `translateX(-${currentIndex * (100 / itemsPerView)
                      }%)`,
                  }}
                >
                  {cat.products.map((product) => (
                    <div
                      key={product._id}
                      className="flex-shrink-0 px-2"
                      style={{ width: `${100 / itemsPerView}%` }}
                    >
                      <Card
                        onClick={() => handleViewDetails(product._id)}
                        className="group h-full overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-card border-border shadow-sm cursor-pointer"
                      >
                        <CardContent className="flex flex-col h-full p-0">
                          <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
                            <div className="aspect-[4/3] relative">
                              <img
                                src={
                                  Array.isArray(product.images)
                                    ? product.images[0]
                                    : product.images ||
                                    "/placeholder.svg?height=300&width=400"
                                }
                                alt={product.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                                loading="lazy"
                                onError={(e) => {
                                  e.currentTarget.src =
                                    "/diverse-products-still-life.png";
                                }}
                              />
                            </div>

                            {product.originalPrice > product.discountedPrice && (
                              <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                {Math.round(
                                  ((product.originalPrice -
                                    product.discountedPrice) /
                                    product.originalPrice) *
                                  100
                                )}
                                % OFF
                              </div>
                            )}
                          </div>

                          <div className="flex flex-col flex-grow p-4 space-y-3">
                            <h3 className="font-semibold text-lg leading-tight text-foreground group-hover:text-primary transition-colors line-clamp-2">
                              {product.title}
                            </h3>

                            {/* Pricing */}
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xl font-bold text-green-600 dark:text-green-400">
                                Rs.{product.discountedPrice}
                              </span>
                              {product.originalPrice >
                                product.discountedPrice && (
                                  <span className="text-sm text-muted-foreground line-through">
                                    Rs.{product.originalPrice}
                                  </span>
                                )}
                            </div>

                            <div className="flex flex-col gap-2 mt-auto pt-2">
                              <Button
                                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium shadow-sm hover:shadow-md transition-all duration-200"
                                onClick={() => handleBuyNow(product)}
                              >
                                <ShoppingBag className="w-4 h-4 mr-2" />
                                Buy Now
                              </Button>
                              <Button
                                variant="outline"
                                className="w-full border-2 hover:bg-muted/50 font-medium transition-all duration-200 bg-transparent"
                                onClick={() => handleAddToCart(product)}
                              >
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
                {Array.from({
                  length: Math.max(1, cat.products.length - itemsPerView + 1),
                }).map((_, index) => (
                  <button
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentIndex
                        ? "bg-primary scale-125"
                        : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                      }`}
                    onClick={() => setCurrentIndex(index)}
                  />
                ))}
              </div>
            </div>
          )
      )}
    </div>
  );
}
