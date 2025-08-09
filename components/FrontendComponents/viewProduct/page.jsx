"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  ShoppingCart,
  CheckCircle,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import ViewProduct from "@/server/viewProduct";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function ViewProductPage() {
  const searchParams = useSearchParams();
  const _id = searchParams.get("_id");
  const router = useRouter()

  const [productdata, setProductdata] = useState({
    title: "",
    description: "",
    originalPrice: "",
    discountedPrice: "",
    stock: "",
    images: [],
  });

  const [quantity, setQuantity] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [cartItems, setcartItems] = useState([]);

  const handleNextImage = () => {
    setSelectedImage((prev) =>
      prev < (productdata.images?.length || 0) - 1 ? prev + 1 : prev
    );
  };

  const handlePrevImage = () => {
    setSelectedImage((prev) => (prev > 0 ? prev - 1 : prev));
  };

  useEffect(() => {
    async function fetchProductData() {
      if (!_id) return;
      try {
        const res = await ViewProduct({ _id });
        if (res) setProductdata(res);
        else console.warn("Product not found");
      } catch (error) {
        console.error("Failed to fetch product data:", error);
      }
    }
    fetchProductData();
  }, [_id]);

  const handleAddToCart = (productdata) => {
    const existingCart = JSON.parse(localStorage.getItem("cartItems")) || [];
    const existingItem = existingCart.find((item) => item._id === productdata._id);

    let updatedCart;
    if (existingItem) {
      updatedCart = existingCart.map((item) =>
        item._id === productdata._id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
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
      ];
    }

    setcartItems(updatedCart);
    localStorage.setItem("cartItems", JSON.stringify(updatedCart));
    toast.success("Added to cart successfully", { position: "top-center" });
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* Modal */}
      {isModalOpen && productdata.images?.length > 0 && (
        <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50">
          <div className="relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-2 right-2 text-white bg-black/60 rounded-full p-1"
            >
              <X size={24} />
            </button>
            <img
              src={productdata.images[selectedImage]}
              alt="Large view"
              className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg shadow-lg"
            />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white dark:bg-gray-900 rounded-xl shadow hover:shadow-md transition overflow-hidden">
        {/* Image carousel */}
        <div
          className="relative flex justify-center items-center bg-gray-100 dark:bg-gray-800 p-4 cursor-zoom-in"
          onClick={() => setIsModalOpen(true)}
        >
          {productdata.images?.length > 0 ? (
            <>
              <img
                src={productdata.images[selectedImage]}
                alt={productdata.title || "Product"}
                className="object-cover rounded-lg w-full max-w-md shadow-sm hover:shadow-md transition-transform duration-200 hover:scale-105"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevImage();
                }}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full p-1"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNextImage();
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full p-1"
              >
                <ChevronRight size={20} />
              </button>
              <div className="absolute bottom-2 flex gap-1">
                {productdata.images.map((_, idx) => (
                  <span
                    key={idx}
                    className={`h-1.5 w-1.5 rounded-full transition-all duration-200 ${selectedImage === idx ? "bg-white scale-125" : "bg-gray-400/70"
                      }`}
                  />
                ))}
              </div>
            </>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">Loading images...</p>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col justify-between space-y-4 p-4">
          <div>
            <h1 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 dark:text-white mb-1">
              {productdata.title || "Loading..."}
            </h1>
            <p className="text-green-600 text-sm sm:text-base font-bold mb-0.5">
              Rs. {productdata.discountedPrice}
            </p>
            {productdata.originalPrice && (
              <p className="text-gray-500 line-through text-xs mb-1">
                Rs. {productdata.originalPrice}
              </p>
            )}
            <p className="flex items-center text-xs text-green-700 dark:text-green-400 mb-2">
              <CheckCircle size={14} className="mr-1" /> {productdata.stock}
            </p>
            <p className="text-gray-500 text-xs sm:text-sm">
              {productdata.description}
            </p>
          </div>

          {/* Quantity */}
          <div className="flex items-center space-x-2 mt-2">
            <p className="text-xs font-semibold">Quantity:</p>
            <div className="flex items-center border rounded overflow-hidden">
              <button
                onClick={() =>
                  setQuantity(quantity === 0 ? quantity : quantity - 1)
                }
                className="px-2 py-0.5 bg-gray-200 dark:bg-gray-700 text-xs"
              >
                -
              </button>
              <span className="px-2 text-xs">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-2 py-0.5 bg-gray-200 dark:bg-gray-700 text-xs"
              >
                +
              </button>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-2 mt-2">
            <Button
              onClick={()=>{router.push(`/../checkoutPage?_id=${_id}`)}}
              className="flex-1 bg-blue-600 text-white hover:bg-blue-700 text-xs sm:text-sm">
              Buy
            </Button>
            <Button
              className="flex-1 bg-gray-200 text-gray-800 hover:bg-gray-300 text-xs sm:text-sm"
              onClick={() => handleAddToCart(productdata)}
            >
              Add To Cart
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
