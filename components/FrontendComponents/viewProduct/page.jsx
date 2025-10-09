"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { CheckCircle, X, ChevronLeft, ChevronRight, Share2, Star, ShoppingCart, Zap } from "lucide-react"
import { useSearchParams } from "next/navigation"
import ViewProduct from "@/server/viewProduct"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"

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
    } catch (error) {
      // Agar clipboard API fail ho jaye, to prompt se dikhado
      const url = window.location.href
      prompt("Copy this link:", url)
    }
  }


  useEffect(() => {
    async function fetchProductData() {
      if (!_id) return
      try {
        const res = await ViewProduct({ _id })
        if (res) setProductdata(res)
        else console.warn("Product not found")
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
              <img
                src={productdata.images[selectedImage] || "/placeholder.svg"}
                alt="Large view"
                className="max-h-[90vh] max-w-[90vw] object-contain rounded-xl sm:rounded-2xl shadow-2xl"
              />
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
          <div className="relative">
            <div
              className="relative flex justify-center items-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 p-4 sm:p-8 cursor-zoom-in group min-h-[300px] sm:min-h-[500px]"
              onClick={() => setIsModalOpen(true)}
            >
              {productdata.images?.length > 0 ? (
                <>
                  <div className="relative overflow-hidden rounded-xl sm:rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300">
                    <img
                      src={productdata.images[selectedImage] || "/placeholder.svg"}
                      alt={productdata.title || "Product"}
                      className="object-contain w-full h-64 sm:h-96 group-hover:scale-105 transition-transform duration-500"
                      onLoad={() => setIsImageLoading(false)}
                      onError={() => setIsImageLoading(false)}
                    />
                    {isImageLoading && (
                      <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-xl sm:rounded-2xl" />
                    )}
                  </div>
                  {productdata.images.length > 1 && (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handlePrevImage()
                        }}
                        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-gray-800 dark:text-white rounded-full p-2 sm:p-3 shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-200 opacity-0 group-hover:opacity-100"
                      >
                        <ChevronLeft size={16} className="sm:w-5 sm:h-5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleNextImage()
                        }}
                        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-gray-800 dark:text-white rounded-full p-2 sm:p-3 shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-200 opacity-0 group-hover:opacity-100"
                      >
                        <ChevronRight size={16} className="sm:w-5 sm:h-5" />
                      </button>
                    </>
                  )}
                  <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 flex gap-1 sm:gap-2">
                    {productdata.images.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedImage(idx)
                        }}
                        className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${selectedImage === idx
                            ? "bg-blue-600 w-6 sm:w-8"
                            : "bg-white/60 w-1.5 sm:w-2 hover:bg-white/80"
                          }`}
                      />
                    ))}
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse mb-4" />
                  <p className="text-sm sm:text-base">Loading images...</p>
                </div>
              )}
            </div>
            {productdata.images?.length > 1 && (
              <div className="flex gap-1 sm:gap-2 p-2 sm:p-4 overflow-x-auto">
                {productdata.images.map((image, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${selectedImage === idx
                        ? "border-blue-600 shadow-lg scale-105"
                        : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                      }`}
                  >
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col justify-between p-4 sm:p-8 space-y-4 sm:space-y-6">
            <div className="space-y-3 sm:space-y-4">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                <div className="flex-1">
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2 leading-tight">
                    {productdata.title || "Loading..."}
                  </h1>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} className="sm:w-4 sm:h-4" fill="currentColor" />
                      ))}
                    </div>
                    <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">(4.8) • 124 reviews</span>
                  </div>
                </div>
                <div className="flex gap-2 self-start">
                  <button
                    onClick={handleShare}
                    className="p-2 sm:p-3 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-all duration-200 hover:scale-110"
                  >
                    <Share2 size={16} className="sm:w-5 sm:h-5" />
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex flex-wrap items-baseline gap-2 sm:gap-3">
                  <span className="text-2xl sm:text-3xl font-bold text-green-600 dark:text-green-400">
                    Rs. {productdata.discountedPrice}
                  </span>
                  {productdata.originalPrice && (
                    <>
                      <span className="text-lg sm:text-xl text-gray-500 line-through">
                        Rs. {productdata.originalPrice}
                      </span>
                      <span className="px-2 py-1 bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 text-xs sm:text-sm font-semibold rounded-full">
                        {Math.round(
                          ((productdata.originalPrice - productdata.discountedPrice) / productdata.originalPrice) * 100,
                        )}
                        % OFF
                      </span>
                    </>
                  )}
                </div>
                <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
                  <CheckCircle size={14} className="sm:w-4 sm:h-4" />
                  <span className="font-medium text-sm sm:text-base">{productdata.stock}</span>
                </div>
              </div>

              <div className="prose prose-gray dark:prose-invert max-w-none prose-sm sm:prose-base">
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm sm:text-base">
                  {productdata.description}
                </p>
              </div>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <span className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">Quantity:</span>
                <div className="flex items-center border-2 border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden bg-white dark:bg-gray-800 w-fit">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 sm:px-4 py-2 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200 font-semibold text-sm sm:text-base"
                  >
                    -
                  </button>
                  <span className="px-4 sm:px-6 py-2 font-semibold min-w-[50px] sm:min-w-[60px] text-center text-sm sm:text-base">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 sm:px-4 py-2 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200 font-semibold text-sm sm:text-base"
                  >
                    +
                  </button>
                </div>
              </div>

            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                onClick={() => {
                  router.push(`/../checkoutPage?_id=${_id}`)
                }}
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-4 sm:px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <Zap size={16} className="sm:w-[18px] sm:h-[18px]" />
                Buy Now
              </Button>
              <Button
                className="flex-1 bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 font-semibold py-3 px-4 sm:px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2 text-sm sm:text-base"
                onClick={() => handleAddToCart(productdata)}
              >
                <ShoppingCart size={16} className="sm:w-[18px] sm:h-[18px]" />
                Add To Cart
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
