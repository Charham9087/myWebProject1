"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { GetCatalogueWithProducts } from "@/server/catalogue-functions";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

export default function Catalogues() {
  const [catalogueData, setCatalogueData] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [itemsPerView, setItemsPerView] = useState(1);
  const router = useRouter();
  const minSwipeDistance = 50;

  const trackPixelEvent = (eventName, data = {}) => {
    if (typeof fbq === "function") fbq("track", eventName, data);
  };

  useEffect(() => {
    const existingCart = JSON.parse(localStorage.getItem("cartItems")) || [];
    setCartItems(existingCart);
  }, []);

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

  const handleAddToCart = (product) => {
    const existingCart = JSON.parse(localStorage.getItem("cartItems")) || [];
    const existingItem = existingCart.find((item) => item._id === product._id);

    const updatedCart = existingItem
      ? existingCart.map((item) =>
          item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
        )
      : [...existingCart, { ...product, quantity: 1 }];

    setCartItems(updatedCart);
    localStorage.setItem("cartItems", JSON.stringify(updatedCart));
    toast.success("Added to cart successfully", { position: "top-center" });

    trackPixelEvent("AddToCart", {
      content_name: product.title,
      content_ids: [product._id],
      content_type: "product",
      value: product.discountedPrice,
      currency: "PKR",
    });
  };

  const handleViewDetails = (id, product) => {
    trackPixelEvent("ViewContent", {
      content_name: product.title,
      content_ids: [product._id],
      content_type: "product",
      value: product.discountedPrice,
      currency: "PKR",
    });
    setLoading(true);
    setTimeout(() => router.push(`/viewDetails?_id=${id}`), 800);
  };

  const handleBuyNow = (product) => {
    trackPixelEvent("InitiateCheckout", {
      content_name: product.title,
      content_ids: [product._id],
      content_type: "product",
      value: product.discountedPrice,
      currency: "PKR",
    });
    window.location.href = `/checkoutPage?_id=${product._id}`;
  };

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

  const CatalogueCarousel = ({ catalogue }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);

    useEffect(() => {
      if (!isAutoPlaying) return;
      const interval = setInterval(() => {
        const maxIndex = Math.max(0, catalogue.products.length - itemsPerView);
        setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
      }, 4000);
      return () => clearInterval(interval);
    }, [isAutoPlaying, itemsPerView, catalogue.products.length]);

    const nextSlide = () => {
      const maxIndex = Math.max(0, catalogue.products.length - itemsPerView);
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    };
    const prevSlide = () => {
      const maxIndex = Math.max(0, catalogue.products.length - itemsPerView);
      setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
    };
    const onTouchStart = (e) => {
      setTouchEnd(null);
      setTouchStart(e.targetTouches[0].clientX);
      setIsAutoPlaying(false);
    };
    const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);
    const onTouchEnd = () => {
      if (!touchStart || !touchEnd) return;
      const distance = touchStart - touchEnd;
      if (distance > minSwipeDistance) nextSlide();
      else if (distance < -minSwipeDistance) prevSlide();
      setTimeout(() => setIsAutoPlaying(true), 3000);
    };

    return (
      <div className="mb-12">
        <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-6">{catalogue.name}</h2>
        <div
          className="relative overflow-hidden rounded-lg"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <div
            className="flex transition-transform duration-500 ease-in-out gap-4"
            style={{ transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)` }}
          >
            {catalogue.products.map((product, index) => (
              <div key={product._id} className="flex-shrink-0 px-2" style={{ width: `${100 / itemsPerView}%` }}>
                <Card
                  onClick={() => handleViewDetails(product._id, product)}
                  className="group h-full overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-card border-border shadow-sm cursor-pointer"
                >
                  <CardContent className="flex flex-col h-full p-0">
                    <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
                      <div className="aspect-[4/3] relative">
                        <Image
                          src={Array.isArray(product.images) ? product.images[0] : product.images || "/placeholder.svg"}
                          alt={product.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          priority={index < 2}
                          loading={index < 2 ? "eager" : "lazy"}
                          placeholder="blur"
                          blurDataURL="/placeholder-blur.jpg"
                        />
                      </div>
                      {product.originalPrice > product.discountedPrice && (
                        <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                          {Math.round(((product.originalPrice - product.discountedPrice) / product.originalPrice) * 100)}% OFF
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col flex-grow p-4 space-y-3">
                      <h3 className="font-semibold text-lg leading-tight text-foreground group-hover:text-primary transition-colors line-clamp-2">
                        {product.title}
                      </h3>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xl font-bold text-green-600 dark:text-green-400">Rs.{product.discountedPrice}</span>
                        {product.originalPrice > product.discountedPrice && (
                          <span className="text-sm text-muted-foreground line-through">Rs.{product.originalPrice}</span>
                        )}
                      </div>
                      <div className="flex flex-col gap-2 mt-auto pt-2">
                        <Button
                          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium shadow-sm hover:shadow-md transition-all duration-200"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleBuyNow(product);
                          }}
                        >
                          <ShoppingBag className="w-4 h-4 mr-2" /> Buy Now
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full border-2 hover:bg-muted/50 font-medium transition-all duration-200 bg-transparent"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart(product);
                          }}
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
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: Math.max(1, catalogue.products.length - itemsPerView + 1) }).map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex ? "bg-primary scale-125" : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
              }`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="relative max-w-7xl mx-auto p-4">
      <h1 className="text-xl text-center sm:text-2xl md:text-3xl font-bold mb-4">🛒 Explore Our Catalogues</h1>
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-2xl border border-gray-200 dark:border-gray-700 max-w-sm mx-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 text-center">Loading Products...</h3>
            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      )}
      {catalogueData.map((cat) => cat.products?.length > 0 && <CatalogueCarousel key={cat.name} catalogue={cat} />)}
    </div>
  );
}
