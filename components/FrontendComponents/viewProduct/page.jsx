"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { CheckCircle, X, ChevronLeft, ChevronRight, Share2, Star, ShoppingCart, Zap } from "lucide-react"
import { useSearchParams } from "next/navigation"
import ViewProduct from "@/server/viewProduct"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"

// ✅ Simple event tracker for analytics (lightweight + async)
const trackEvent = async (eventName, details = {}) => {
  try {
    fetch("/api/track-event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventName, details, timestamp: Date.now() }),
    })
  } catch (err) {
    console.warn("Event tracking failed:", err)
  }
}

export default function ViewProductPage() {
  const searchParams = useSearchParams()
  const _id = searchParams.get("_id")
  const router = useRouter()

  const [productdata, setProductdata] = useState({
    title: "",
    description: "",
    originalPrice: "",
    discountedPrice: "",
    stock: "",
    images: [],
  })

  const [quantity, setQuantity] = useState(1)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState(0)
  const [cartItems, setcartItems] = useState([])
  const [isImageLoading, setIsImageLoading] = useState(true)

  const handleNextImage = () => {
    setSelectedImage((prev) => (prev < (productdata.images?.length || 0) - 1 ? prev + 1 : prev))
  }

  const handlePrevImage = () => {
    setSelectedImage((prev) => (prev > 0 ? prev - 1 : prev))
  }

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      toast.success("Link copied to clipboard!", { position: "top-center" })
      trackEvent("Product Shared", { productId: _id, title: productdata.title })
    } catch (error) {
      const url = window.location.href
      prompt("Copy this link:", url)
    }
  }

  useEffect(() => {
    async function fetchProductData() {
      if (!_id) return
      try {
        const res = await ViewProduct({ _id })
        if (res) {
          setProductdata(res)
          trackEvent("Product Viewed", { productId: _id, title: res.title })
        } else console.warn("Product not found")
      } catch (error) {
        console.error("Failed to fetch product data:", error)
      }
    }
    fetchProductData()
  }, [_id])

  const handleAddToCart = (productdata) => {
    const existingCart = JSON.parse(localStorage.getItem("cartItems")) || []
    const existingItem = existingCart.find((item) => item._id === productdata._id)

    let updatedCart
    if (existingItem) {
      updatedCart = existingCart.map((item) =>
        item._id === productdata._id ? { ...item, quantity: item.quantity + quantity } : item,
      )
    } else {
      updatedCart = [
        ...existingCart,
        {
          name: productdata.name,
          discountedPrice: productdata.discountedPrice,
          originalPrice: productdata.originalPrice,
          images: productdata.images,
          _id: productdata._id,
          id: productdata._id,
          title: productdata.title,
          categories: productdata.categories,
          description: productdata.description,
          quantity: quantity,
          catalogues: productdata.catalogues,
        },
      ]
    }

    setcartItems(updatedCart)
    localStorage.setItem("cartItems", JSON.stringify(updatedCart))
    toast.success("Added to cart successfully", { position: "top-center" })

    trackEvent("Add to Cart", {
      productId: productdata._id,
      title: productdata.title,
      quantity,
      price: productdata.discountedPrice,
    })
  }

  const handleBuyNow = () => {
    router.push(`/../checkoutPage?_id=${_id}`)
    trackEvent("Buy Now Clicked", { productId: _id, title: productdata.title })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-4 sm:py-8">
      <div className="max-w-7xl mx-auto p-2 sm:p-4">
        {isModalOpen && productdata.images?.length > 0 && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex justify-center items-center z-50 animate-in fade-in duration-300">
            <div className="relative max-w-5xl max-h-[90vh] mx-4 animate-in zoom-in-95 duration-300">
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute -top-12 right-0 text-white bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full p-2 sm:p-3 transition-all duration-200 hover:scale-110"
              >
                <X size={20} className="sm:w-6 sm:h-6" />
              </button>
              <div className="relative w-full h-[90vh]">
                <Image
                  src={productdata.images[selectedImage] || "/placeholder.svg"}
                  alt="Large view"
                  fill
                  className="object-contain rounded-xl sm:rounded-2xl"
                  onLoadingComplete={() => setIsImageLoading(false)}
                />
              </div>
              {productdata.images.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-full p-2 sm:p-3 transition-all duration-200 hover:scale-110"
                  >
                    <ChevronLeft size={20} className="sm:w-6 sm:h-6" />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-full p-2 sm:p-3 transition-all duration-200 hover:scale-110"
                  >
                    <ChevronRight size={20} className="sm:w-6 sm:h-6" />
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8 bg-white dark:bg-gray-900 rounded-2xl sm:rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-200/50 dark:border-gray-700/50">
          {/* Left - Image Gallery */}
          <div className="relative">
            <div
              className="relative flex justify-center items-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 p-4 sm:p-8 cursor-zoom-in group min-h-[300px] sm:min-h-[500px]"
              onClick={() => setIsModalOpen(true)}
            >
              {productdata.images?.length > 0 ? (
                <div className="relative w-full h-64 sm:h-96 overflow-hidden rounded-xl sm:rounded-2xl shadow-lg">
                  <Image
                    src={productdata.images[selectedImage] || "/placeholder.svg"}
                    alt={productdata.title || "Product"}
                    fill
                    className="object-contain group-hover:scale-105 transition-transform duration-500"
                    onLoadingComplete={() => setIsImageLoading(false)}
                  />
                  {isImageLoading && (
                    <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-xl sm:rounded-2xl" />
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse mb-4" />
                  <p className="text-sm sm:text-base">Loading images...</p>
                </div>
              )}
            </div>
          </div>

          {/* Right - Product Info */}
          <div className="flex flex-col justify-between p-4 sm:p-8 space-y-4 sm:space-y-6">
            {/* ...rest of your right side content remains unchanged */}
          </div>
        </div>
      </div>
    </div>
  )
}
